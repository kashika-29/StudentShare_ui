-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BORROW', 'RENT', 'SELL', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BorrowRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('ACTIVE', 'RETURN_PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UrgentRequestStatus" AS ENUM ('OPEN', 'CLOSED', 'FULFILLED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileImage" TEXT,
    "hostel" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "condition" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "deposit" DOUBLE PRECISION,
    "location" TEXT NOT NULL,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableUntil" TIMESTAMP(3) NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemImage" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BorrowRequest" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "status" "BorrowRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BorrowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedReturnAt" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "status" "TransactionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewedUserId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "requestId" TEXT,
    "content" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrgentRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "requestedItem" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "status" "UrgentRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UrgentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "itemId" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Item_ownerId_idx" ON "Item"("ownerId");

-- CreateIndex
CREATE INDEX "Item_categoryId_idx" ON "Item"("categoryId");

-- CreateIndex
CREATE INDEX "Item_status_idx" ON "Item"("status");

-- CreateIndex
CREATE INDEX "Item_transactionType_idx" ON "Item"("transactionType");

-- CreateIndex
CREATE INDEX "Item_availableFrom_availableUntil_idx" ON "Item"("availableFrom", "availableUntil");

-- CreateIndex
CREATE INDEX "ItemImage_itemId_idx" ON "ItemImage"("itemId");

-- CreateIndex
CREATE INDEX "BorrowRequest_itemId_idx" ON "BorrowRequest"("itemId");

-- CreateIndex
CREATE INDEX "BorrowRequest_requesterId_idx" ON "BorrowRequest"("requesterId");

-- CreateIndex
CREATE INDEX "BorrowRequest_ownerId_idx" ON "BorrowRequest"("ownerId");

-- CreateIndex
CREATE INDEX "BorrowRequest_status_idx" ON "BorrowRequest"("status");

-- CreateIndex
CREATE INDEX "BorrowRequest_startDate_endDate_idx" ON "BorrowRequest"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_requestId_key" ON "Transaction"("requestId");

-- CreateIndex
CREATE INDEX "Transaction_requestId_idx" ON "Transaction"("requestId");

-- CreateIndex
CREATE INDEX "Transaction_itemId_idx" ON "Transaction"("itemId");

-- CreateIndex
CREATE INDEX "Transaction_borrowerId_idx" ON "Transaction"("borrowerId");

-- CreateIndex
CREATE INDEX "Transaction_ownerId_idx" ON "Transaction"("ownerId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_expectedReturnAt_idx" ON "Transaction"("expectedReturnAt");

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId");

-- CreateIndex
CREATE INDEX "Review_reviewedUserId_idx" ON "Review"("reviewedUserId");

-- CreateIndex
CREATE INDEX "Review_transactionId_idx" ON "Review"("transactionId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_requestId_idx" ON "Message"("requestId");

-- CreateIndex
CREATE INDEX "Message_readAt_idx" ON "Message"("readAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "UrgentRequest_userId_idx" ON "UrgentRequest"("userId");

-- CreateIndex
CREATE INDEX "UrgentRequest_categoryId_idx" ON "UrgentRequest"("categoryId");

-- CreateIndex
CREATE INDEX "UrgentRequest_status_idx" ON "UrgentRequest"("status");

-- CreateIndex
CREATE INDEX "UrgentRequest_requiredDate_idx" ON "UrgentRequest"("requiredDate");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Report_reportedUserId_idx" ON "Report"("reportedUserId");

-- CreateIndex
CREATE INDEX "Report_itemId_idx" ON "Report"("itemId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImage" ADD CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BorrowRequest" ADD CONSTRAINT "BorrowRequest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "BorrowRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewedUserId_fkey" FOREIGN KEY ("reviewedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgentRequest" ADD CONSTRAINT "UrgentRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrgentRequest" ADD CONSTRAINT "UrgentRequest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
