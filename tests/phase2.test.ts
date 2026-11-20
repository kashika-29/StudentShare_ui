import assert from "node:assert/strict";
import { after, test } from "node:test";
import { PrismaClient } from "@prisma/client";
import { registerSchema, loginSchema } from "../lib/auth/schemas";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { signSessionToken, verifySessionToken } from "../lib/auth/session";
import { assertBorrowingDates, rangesOverlap, startOfUtcDay } from "../lib/dates";
import { createItemSchema } from "../lib/items/schemas";
import { createItem, updateItem } from "../lib/items/service";
import {
  acceptBorrowRequest,
  cancelBorrowRequest,
  createBorrowRequest,
  rejectBorrowRequest,
} from "../lib/borrow-requests/service";
import { ForbiddenError } from "../lib/errors";
import { assertAdmin } from "../lib/auth/roles";
import type { PublicUser } from "../lib/users";

process.env.AUTH_SECRET ??= "phase2-test-secret-do-not-use-in-production";

const prisma = new PrismaClient();
const stamp = Date.now();

const ownerEmail = `phase2.owner.${stamp}@campus.edu`;
const borrowerEmail = `phase2.borrower.${stamp}@campus.edu`;
const otherEmail = `phase2.other.${stamp}@campus.edu`;

let owner: PublicUser;
let borrower: PublicUser;
let other: PublicUser;
let admin: PublicUser;
let categoryId: string;
let itemId: string;
let requestId: string;

function asUser(
  user: { id: string; name: string; email: string; profileImage: string | null; hostel: string | null; role: PublicUser["role"]; createdAt: Date; updatedAt: Date },
): PublicUser {
  return user;
}

test("Zod lowercases emails and rejects short passwords", () => {
  const parsed = registerSchema.parse({
    name: "Test Student",
    email: "  Alex.J@Campus.EDU  ",
    password: "longenough",
  });
  assert.equal(parsed.email, "alex.j@campus.edu");

  const login = loginSchema.parse({
    email: "Admin@Campus.EDU",
    password: "secret",
  });
  assert.equal(login.email, "admin@campus.edu");

  assert.equal(registerSchema.safeParse({ name: "A", email: "a@b.com", password: "short" }).success, false);
});

test("passwords are hashed with bcrypt and never stored as plaintext", async () => {
  const password = "Campus#2026";
  const hashed = await hashPassword(password);
  assert.notEqual(hashed, password);
  assert.match(hashed, /^\$2[aby]\$/);
  assert.equal(await verifyPassword(password, hashed), true);
  assert.equal(await verifyPassword("wrong-password", hashed), false);
});

test("session tokens round-trip and reject tampering", async () => {
  const token = await signSessionToken({ sub: "user_1", role: "STUDENT" });
  const session = await verifySessionToken(token);
  assert.deepEqual(session, { sub: "user_1", role: "STUDENT" });
  assert.equal(await verifySessionToken(`${token}x`), null);
});

test("borrowing date helpers reject invalid and overlapping ranges", () => {
  assert.equal(
    rangesOverlap(
      { start: new Date("2026-09-10"), end: new Date("2026-09-12") },
      { start: new Date("2026-09-12"), end: new Date("2026-09-14") },
    ),
    true,
  );
  assert.equal(
    rangesOverlap(
      { start: new Date("2026-09-10"), end: new Date("2026-09-12") },
      { start: new Date("2026-09-13"), end: new Date("2026-09-14") },
    ),
    false,
  );

  const now = new Date("2026-09-11T12:00:00.000Z");
  const errors = assertBorrowingDates({
    startDate: new Date("2026-09-20"),
    endDate: new Date("2026-09-18"),
    availableFrom: new Date("2026-09-01"),
    availableUntil: new Date("2026-12-31"),
    now,
  });
  assert.ok(errors.some((message) => message.includes("startDate must be before endDate")));

  const past = assertBorrowingDates({
    startDate: new Date("2026-09-01"),
    endDate: new Date("2026-09-02"),
    availableFrom: new Date("2026-01-01"),
    availableUntil: new Date("2026-12-31"),
    now,
  });
  assert.ok(past.some((message) => message.includes("past")));
  assert.ok(startOfUtcDay(now) <= now);
});

test("assertAdmin allows ADMIN and rejects STUDENT", () => {
  const student: PublicUser = {
    id: "1",
    name: "Student",
    email: "s@campus.edu",
    profileImage: null,
    hostel: null,
    role: "STUDENT",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const adminUser: PublicUser = { ...student, id: "2", role: "ADMIN" };
  assert.equal(assertAdmin(adminUser).id, "2");
  assert.throws(() => assertAdmin(student), ForbiddenError);
});

test("createItemSchema rejects ownerId field to prevent owner spoofing", () => {
  const result = createItemSchema.safeParse({
    ownerId: "attacker",
    categoryId: "cat_1",
    title: "Calculator",
    description: "Scientific calculator",
    transactionType: "BORROW",
    condition: "Good",
    location: "Block A",
    availableFrom: "2026-09-01",
    availableUntil: "2026-12-31",
  });
  assert.equal(result.success, false);
});

test("item CRUD and borrow-request authorization against the database", async (t) => {
  const category = await prisma.category.findFirst();
  assert.ok(category, "seeded categories should exist");
  categoryId = category.id;

  const passwordHash = await hashPassword("Campus#2026");
  const [ownerRow, borrowerRow, otherRow] = await Promise.all([
    prisma.user.create({
      data: { name: "Phase2 Owner", email: ownerEmail, passwordHash, role: "STUDENT", hostel: "A" },
    }),
    prisma.user.create({
      data: { name: "Phase2 Borrower", email: borrowerEmail, passwordHash, role: "STUDENT", hostel: "B" },
    }),
    prisma.user.create({
      data: { name: "Phase2 Other", email: otherEmail, passwordHash, role: "STUDENT", hostel: "C" },
    }),
  ]);

  const adminRow = await prisma.user.findUnique({ where: { email: "admin@campus.edu" } });
  assert.ok(adminRow);

  owner = asUser(ownerRow);
  borrower = asUser(borrowerRow);
  other = asUser(otherRow);
  admin = asUser(adminRow);

  const item = await createItem(owner, {
    categoryId,
    title: "Phase2 Test Item",
    description: "Created by Phase 2 tests",
    transactionType: "BORROW",
    condition: "Good",
    deposit: 20,
    location: "Block A",
    availableFrom: "2026-09-01",
    availableUntil: "2026-12-31",
  });
  itemId = item.id;
  assert.equal(item.ownerId, owner.id);

  await t.test("students cannot update another student's item", async () => {
    await assert.rejects(
      () => updateItem(other, itemId, { title: "Hijacked" }),
      ForbiddenError,
    );
  });

  await t.test("admins can update another student's item", async () => {
    const updated = await updateItem(admin, itemId, { title: "Phase2 Test Item (admin ok)" });
    assert.equal(updated.title, "Phase2 Test Item (admin ok)");
  });

  await t.test("owners cannot borrow their own item", async () => {
    await assert.rejects(
      () =>
        createBorrowRequest(owner, {
          itemId,
          startDate: "2026-10-01",
          endDate: "2026-10-03",
        }),
      ForbiddenError,
    );
  });

  const request = await createBorrowRequest(borrower, {
    itemId,
    startDate: "2026-10-01",
    endDate: "2026-10-03",
    message: "Need it for a lab",
  });
  requestId = request.id;
  assert.equal(request.requesterId, borrower.id);
  assert.equal(request.ownerId, owner.id);

  await t.test("overlapping pending requests are rejected", async () => {
    await assert.rejects(() =>
      createBorrowRequest(other, {
        itemId,
        startDate: "2026-10-02",
        endDate: "2026-10-04",
      }),
    );
  });

  await t.test("non-owners cannot accept", async () => {
    await assert.rejects(() => acceptBorrowRequest(borrower, requestId), ForbiddenError);
  });

  await t.test("non-requesters cannot cancel", async () => {
    await assert.rejects(() => cancelBorrowRequest(other, requestId), ForbiddenError);
  });

  const accepted = await acceptBorrowRequest(owner, requestId);
  assert.equal(accepted.status, "ACCEPTED");

  const transaction = await prisma.transaction.findUnique({ where: { requestId } });
  assert.ok(transaction);
  assert.equal(transaction.borrowerId, borrower.id);

  await t.test("accepted dates cannot be booked again", async () => {
    await assert.rejects(() =>
      createBorrowRequest(other, {
        itemId,
        startDate: "2026-10-01",
        endDate: "2026-10-03",
      }),
    );
  });

  const laterRequest = await createBorrowRequest(other, {
    itemId,
    startDate: "2026-11-01",
    endDate: "2026-11-03",
  });
  const rejected = await rejectBorrowRequest(owner, laterRequest.id);
  assert.equal(rejected.status, "REJECTED");

  const cancellable = await createBorrowRequest(other, {
    itemId,
    startDate: "2026-12-01",
    endDate: "2026-12-03",
  });
  const cancelled = await cancelBorrowRequest(other, cancellable.id);
  assert.equal(cancelled.status, "CANCELLED");
});

after(async () => {
  if (itemId) {
    await prisma.transaction.deleteMany({ where: { itemId } });
    await prisma.borrowRequest.deleteMany({ where: { itemId } });
    await prisma.item.deleteMany({ where: { id: itemId } });
  }
  await prisma.user.deleteMany({
    where: { email: { in: [ownerEmail, borrowerEmail, otherEmail] } },
  });
  await prisma.$disconnect();
});
