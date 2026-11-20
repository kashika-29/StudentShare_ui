# StudentShare Database Documentation

## Overview

StudentShare uses a PostgreSQL database managed through Prisma ORM. This document explains the database architecture, models, relationships, and operational procedures.

## Why PostgreSQL?

PostgreSQL was selected for StudentShare because:

1. **Relational Data**: The application requires complex relationships between users, items, requests, transactions, and reviews - PostgreSQL excels at handling relational data with proper foreign key constraints.

2. **Data Integrity**: PostgreSQL provides robust constraints (unique, foreign key, check) ensuring data consistency across the platform.

3. **Advanced Features**: Support for enums, indexes, and JSON provides flexibility for future enhancements.

4. **Scalability**: PostgreSQL can handle the expected growth of a student platform with proper indexing and query optimization.

5. **ACID Compliance**: Ensures transactional integrity - critical for financial transactions (deposits, payments) and inventory management.

6. **Open Source**: No licensing costs, well-documented, and strong community support.

## Prisma & PostgreSQL Connection

Prisma connects to PostgreSQL through:

1. **Datasource Configuration**: Defined in `prisma/schema.prisma` with the connection string from `DATABASE_URL` environment variable.

2. **Prisma Client**: Auto-generated TypeScript/JavaScript client that provides type-safe database access.

3. **Migration System**: Prisma Migrate handles schema changes and version control.

Connection string format:
```
postgresql://username:password@localhost:5432/database_name?schema=public
```

## Database Architecture

### Core Models

#### User
Represents students and administrators in the system.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `name` (String): User's full name
- `email` (String, Unique): User's email address
- `profileImage` (String, Optional): URL to profile picture
- `hostel` (String, Optional): Hostel/location information
- `role` (Enum: STUDENT/ADMIN): User's role in the system
- `createdAt` (DateTime): Account creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships:**
- One-to-Many with Items (as owner)
- One-to-Many with BorrowRequests (as requester)
- One-to-Many with Transactions (as borrower and lender)
- One-to-Many with Messages (as sender and receiver)
- One-to-Many with Notifications
- One-to-Many with Reviews (as reviewer and reviewed)
- One-to-Many with UrgentRequests
- One-to-Many with Reports (as reporter and reported)

#### Category
Categorizes items for better organization and search.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `name` (String, Unique): Category name
- `description` (String, Optional): Category description
- `createdAt` (DateTime): Creation timestamp

**Relationships:**
- One-to-Many with Items
- One-to-Many with UrgentRequests

#### Item
Represents items available for borrowing, renting, selling, or exchange.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `ownerId` (String, Foreign Key): Reference to User
- `categoryId` (String, Foreign Key): Reference to Category
- `title` (String): Item title
- `description` (String): Detailed description
- `transactionType` (Enum): BORROW/RENT/SELL/EXCHANGE
- `condition` (String): Item condition description
- `price` (Float, Optional): Daily rental price or selling price
- `deposit` (Float, Optional): Security deposit amount
- `location` (String): Item location
- `availableFrom` (DateTime): Availability start date
- `availableUntil` (DateTime): Availability end date
- `status` (Enum): AVAILABLE/UNAVAILABLE/INACTIVE
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships:**
- Many-to-One with User (owner)
- Many-to-One with Category
- One-to-Many with ItemImages
- One-to-Many with BorrowRequests
- One-to-Many with Transactions
- One-to-Many with Reports

**Indexes:**
- ownerId, categoryId, status, transactionType
- Composite index on availableFrom and availableUntil for availability queries

#### ItemImage
Stores images for items (multiple images per item).

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `itemId` (String, Foreign Key): Reference to Item
- `imageUrl` (String): URL to the image
- `createdAt` (DateTime): Upload timestamp

**Relationships:**
- Many-to-One with Item (cascade delete)

#### BorrowRequest
Represents requests to borrow/rent items.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `itemId` (String, Foreign Key): Reference to Item
- `requesterId` (String, Foreign Key): Reference to User (requester)
- `ownerId` (String, Foreign Key): Reference to User (owner)
- `startDate` (DateTime): Request start date
- `endDate` (DateTime): Request end date
- `message` (String, Optional): Request message
- `status` (Enum): PENDING/ACCEPTED/REJECTED/CANCELLED/COMPLETED
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships:**
- Many-to-One with Item (cascade delete)
- Many-to-One with User (requester, cascade delete)
- Many-to-One with User (owner, cascade delete)
- One-to-One with Transaction

**Indexes:**
- itemId, requesterId, ownerId, status
- Composite index on startDate and endDate for overlap prevention

#### Transaction
Represents active or completed borrowing transactions.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `requestId` (String, Foreign Key, Unique): Reference to BorrowRequest
- `itemId` (String, Foreign Key): Reference to Item
- `borrowerId` (String, Foreign Key): Reference to User (borrower)
- `ownerId` (String, Foreign Key): Reference to User (owner)
- `borrowedAt` (DateTime): When item was borrowed
- `expectedReturnAt` (DateTime): Expected return date
- `returnedAt` (DateTime, Optional): Actual return date
- `status` (Enum): ACTIVE/RETURN_PENDING/COMPLETED/OVERDUE/CANCELLED
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships:**
- Many-to-One with BorrowRequest (cascade delete)
- Many-to-One with Item (cascade delete)
- Many-to-One with User (borrower, cascade delete)
- Many-to-One with User (owner, cascade delete)
- One-to-Many with Reviews

**Indexes:**
- requestId, itemId, borrowerId, ownerId, status, expectedReturnAt

#### Review
Represents user reviews after completed transactions.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `reviewerId` (String, Foreign Key): Reference to User (reviewer)
- `reviewedUserId` (String, Foreign Key): Reference to User (reviewed)
- `transactionId` (String, Foreign Key): Reference to Transaction
- `rating` (Int): Rating from 1-5
- `comment` (String, Optional): Review comment
- `createdAt` (DateTime): Creation timestamp

**Relationships:**
- Many-to-One with User (reviewer, cascade delete)
- Many-to-One with User (reviewed, cascade delete)
- Many-to-One with Transaction (cascade delete)

**Indexes:**
- reviewerId, reviewedUserId, transactionId, rating

#### Message
Represents messages between users.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `senderId` (String, Foreign Key): Reference to User (sender)
- `receiverId` (String, Foreign Key): Reference to User (receiver)
- `requestId` (String, Foreign Key, Optional): Reference to BorrowRequest
- `content` (String): Message content
- `readAt` (DateTime, Optional): Read timestamp
- `createdAt` (DateTime): Creation timestamp

**Relationships:**
- Many-to-One with User (sender, cascade delete)
- Many-to-One with User (receiver, cascade delete)

**Indexes:**
- senderId, receiverId, requestId, readAt

#### Notification
Represents user notifications.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `userId` (String, Foreign Key): Reference to User
- `type` (String): Notification type
- `message` (String): Notification message
- `read` (Boolean): Read status
- `createdAt` (DateTime): Creation timestamp

**Relationships:**
- Many-to-One with User (cascade delete)

**Indexes:**
- userId, read, createdAt

#### UrgentRequest
Represents urgent item requests from students.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `userId` (String, Foreign Key): Reference to User
- `categoryId` (String, Foreign Key): Reference to Category
- `requestedItem` (String): Item being requested
- `description` (String): Request description
- `requiredDate` (DateTime): Date when item is needed
- `duration` (Int): Duration needed (in days)
- `location` (String): Requester's location
- `status` (Enum): OPEN/CLOSED/FULFILLED
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships:**
- Many-to-One with User (cascade delete)
- Many-to-One with Category (cascade delete)

**Indexes:**
- userId, categoryId, status, requiredDate

#### Report
Represents reports filed against users or items.

**Fields:**
- `id` (String, Primary Key): Unique identifier
- `reporterId` (String, Foreign Key): Reference to User (reporter)
- `reportedUserId` (String, Foreign Key): Reference to User (reported)
- `itemId` (String, Foreign Key, Optional): Reference to Item
- `reason` (String): Report reason
- `description` (String): Detailed description
- `status` (Enum): PENDING/INVESTIGATING/RESOLVED/DISMISSED
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relationships:**
- Many-to-One with User (reporter, cascade delete)
- Many-to-One with User (reported, cascade delete)
- Many-to-One with Item (set null on delete)

**Indexes:**
- reporterId, reportedUserId, itemId, status

## Key Relationships

### User → Items
One user can own multiple items. When a user is deleted, their items are cascade deleted.

### User → BorrowRequests
Users can create multiple borrow requests (as requester) and receive multiple requests (as owner). Cascade delete ensures data consistency.

### Item → BorrowRequests
One item can have multiple borrow requests. When an item is deleted, associated requests are cascade deleted.

### BorrowRequest → Transaction
One-to-one relationship - each accepted borrow request becomes a transaction. Cascade delete ensures consistency.

### Transaction → Reviews
One transaction can have multiple reviews (both borrower and owner can review each other). Cascade delete maintains integrity.

### User → Messages
Users can send and receive multiple messages. Cascade delete removes messages when users are deleted.

### User → Notifications
One user can have multiple notifications. Cascade delete ensures cleanup.

### User → UrgentRequests
Users can create multiple urgent requests. Cascade delete maintains consistency.

### User → Reports
Users can create reports and be reported. Cascade delete ensures cleanup.

## Availability Consideration

The schema is designed to support preventing overlapping borrowing periods. The `BorrowRequest` model includes:
- `startDate` and `endDate` fields
- Composite index on these dates for efficient overlap queries
- Status tracking (PENDING, ACCEPTED, etc.)

In Phase 2, business logic will be implemented to:
1. Check for overlapping ACCEPTED requests before accepting new requests
2. Use the composite index for efficient date range queries
3. Enforce that only one ACTIVE transaction exists per item at a time

## Enum Types

The following enums are used for type safety:

- **UserRole**: STUDENT, ADMIN
- **TransactionType**: BORROW, RENT, SELL, EXCHANGE
- **ItemStatus**: AVAILABLE, UNAVAILABLE, INACTIVE
- **BorrowRequestStatus**: PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED
- **TransactionStatus**: ACTIVE, RETURN_PENDING, COMPLETED, OVERDUE, CANCELLED
- **UrgentRequestStatus**: OPEN, CLOSED, FULFILLED
- **ReportStatus**: PENDING, INVESTIGATING, RESOLVED, DISMISSED

## Running Migrations

### Create a new migration
```bash
npx prisma migrate dev --name migration_name
```

This command:
1. Generates the migration SQL
2. Applies the migration to the database
3. Regenerates the Prisma Client

### Reset the database
```bash
npx prisma migrate reset
```

This command:
1. Drops the database
2. Creates a new database
3. Applies all migrations
4. Runs the seed script

### Generate Prisma Client
```bash
npx prisma generate
```

Regenerates the Prisma Client based on the current schema.

## Seeding the Database

### Run the seed script
```bash
npm run seed
```

Or using Prisma CLI:
```bash
npx prisma db seed
```

The seed script creates:
- 15 users (14 students + 1 admin)
- 8 categories
- 25 items across various categories
- 5 item images
- 8 borrow requests (pending, accepted, completed, rejected)
- 4 transactions (active and completed)
- 3 reviews
- 3 messages
- 4 notifications
- 3 urgent requests
- 2 reports

## Validation

### Validate Prisma schema
```bash
npx prisma validate
```

Checks the schema for syntax errors and validates against the database.

### Format Prisma schema
```bash
npx prisma format
```

Formats the schema file according to Prisma conventions.

### View database in Prisma Studio
```bash
npx prisma studio
```

Opens a visual database browser to inspect and edit data.

## Security Considerations

1. **Environment Variables**: Database credentials are stored in `.env` (not committed to git)
2. **Cascade Deletes**: Proper cascade delete rules prevent orphaned records
3. **Foreign Keys**: All relationships are enforced at the database level
4. **Unique Constraints**: Email addresses and category names are unique
5. **Indexes**: Strategic indexes optimize query performance

## Future Enhancements

1. **Soft Deletes**: Add `deletedAt` fields to preserve records while marking as deleted
2. **Audit Logs**: Track who modified records and when
3. **Full-text Search**: PostgreSQL full-text search for item descriptions
4. **Geospatial Queries**: Location-based item search
5. **Data Archiving**: Archive old transactions to improve performance
