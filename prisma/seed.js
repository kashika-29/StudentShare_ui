const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()
const passwordHash = bcrypt.hashSync('Campus#2026', 10)

async function main() {
  console.log('Starting seed...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.borrowRequest.deleteMany()
  await prisma.itemImage.deleteMany()
  await prisma.item.deleteMany()
  await prisma.message.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.urgentRequest.deleteMany()
  await prisma.report.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Cleared existing data')

  // Create Users (10-15 students + 1 admin)
  const users = await Promise.all([
    // Admin
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@campus.edu',
        passwordHash,
        role: 'ADMIN',
        hostel: 'Admin Block',
      },
    }),
    // Students
    prisma.user.create({
      data: {
        name: 'Alex Johnson',
        email: 'alex.j@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block A, Room 101',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Williams',
        email: 'sarah.w@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block B, Room 205',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.c@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block A, Room 305',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Emily Davis',
        email: 'emily.d@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block C, Room 112',
      },
    }),
    prisma.user.create({
      data: {
        name: 'James Wilson',
        email: 'james.w@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block B, Room 408',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Garcia',
        email: 'maria.g@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block A, Room 210',
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Brown',
        email: 'david.b@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block C, Room 315',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Lisa Anderson',
        email: 'lisa.a@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block B, Room 120',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Robert Taylor',
        email: 'robert.t@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block A, Room 425',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jennifer Martinez',
        email: 'jennifer.m@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block C, Room 208',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Christopher Lee',
        email: 'christopher.l@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block B, Room 312',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Amanda White',
        email: 'amanda.w@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block A, Room 118',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Daniel Harris',
        email: 'daniel.h@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block C, Room 420',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jessica Clark',
        email: 'jessica.c@campus.edu',
        passwordHash,
        role: 'STUDENT',
        hostel: 'Block B, Room 215',
      },
    }),
  ])

  console.log(`Created ${users.length} users`)

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        description: 'Textbooks, reference books, and study materials',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Formal wear, casual clothing, and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hostel Essentials',
        description: 'Daily use items for hostel life',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        description: 'Sports equipment and gear',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Academic',
        description: 'Academic tools and supplies',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Project Materials',
        description: 'Components and materials for projects',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Other',
        description: 'Miscellaneous items',
      },
    }),
  ])

  console.log(`Created ${categories.length} categories`)

  // Create Items (25+ realistic items)
  const items = await Promise.all([
    // Electronics
    prisma.item.create({
      data: {
        ownerId: users[1].id,
        categoryId: categories[0].id,
        title: 'Scientific Calculator',
        description: 'Casio fx-991EX scientific calculator, perfect for engineering exams',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 50,
        location: 'Block A, Room 101',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[2].id,
        categoryId: categories[0].id,
        title: 'USB-C Charger',
        description: '65W USB-C laptop charger, compatible with most modern laptops',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 30,
        location: 'Block B, Room 205',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[3].id,
        categoryId: categories[0].id,
        title: 'Wireless Headphones',
        description: 'Sony WH-1000XM4 noise-canceling headphones',
        transactionType: 'RENT',
        condition: 'Good',
        price: 10,
        deposit: 100,
        location: 'Block A, Room 305',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[4].id,
        categoryId: categories[0].id,
        title: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 40,
        location: 'Block C, Room 112',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Books
    prisma.item.create({
      data: {
        ownerId: users[5].id,
        categoryId: categories[1].id,
        title: 'DBMS Textbook',
        description: 'Database System Concepts by Silberschatz, 7th edition',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 60,
        location: 'Block B, Room 408',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[6].id,
        categoryId: categories[1].id,
        title: 'Data Structures Book',
        description: 'Introduction to Algorithms by CLRS, 3rd edition',
        transactionType: 'BORROW',
        condition: 'Fair',
        price: null,
        deposit: 70,
        location: 'Block A, Room 210',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[7].id,
        categoryId: categories[1].id,
        title: 'Physics Reference Book',
        description: 'University Physics with Modern Physics, 14th edition',
        transactionType: 'SELL',
        condition: 'Like New',
        price: 45,
        deposit: null,
        location: 'Block C, Room 315',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Clothing
    prisma.item.create({
      data: {
        ownerId: users[8].id,
        categoryId: categories[2].id,
        title: 'Formal Shirt',
        description: 'White formal shirt, size M, perfect for interviews',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 30,
        location: 'Block B, Room 120',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[9].id,
        categoryId: categories[2].id,
        title: 'Formal Blazer',
        description: 'Navy blue blazer, size L, excellent condition',
        transactionType: 'RENT',
        condition: 'Good',
        price: 15,
        deposit: 80,
        location: 'Block A, Room 425',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[10].id,
        categoryId: categories[2].id,
        title: 'Interview Tie',
        description: 'Classic red tie, brand new',
        transactionType: 'BORROW',
        condition: 'New',
        price: null,
        deposit: 20,
        location: 'Block C, Room 208',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Hostel Essentials
    prisma.item.create({
      data: {
        ownerId: users[11].id,
        categoryId: categories[3].id,
        title: 'Steam Iron',
        description: 'Philips steam iron, works perfectly',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 40,
        location: 'Block B, Room 312',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[12].id,
        categoryId: categories[3].id,
        title: 'Electric Kettle',
        description: '1.5L electric kettle, fast boiling',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 35,
        location: 'Block A, Room 118',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[13].id,
        categoryId: categories[3].id,
        title: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 25,
        location: 'Block C, Room 420',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Sports
    prisma.item.create({
      data: {
        ownerId: users[14].id,
        categoryId: categories[4].id,
        title: 'Football',
        description: 'Size 5 football, good condition',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 30,
        location: 'Block B, Room 215',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[1].id,
        categoryId: categories[4].id,
        title: 'Volleyball',
        description: 'Official size volleyball, excellent condition',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 35,
        location: 'Block A, Room 101',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[2].id,
        categoryId: categories[4].id,
        title: 'Badminton Racket',
        description: 'Yonex badminton racket with cover',
        transactionType: 'RENT',
        condition: 'Good',
        price: 5,
        deposit: 50,
        location: 'Block B, Room 205',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Academic
    prisma.item.create({
      data: {
        ownerId: users[3].id,
        categoryId: categories[5].id,
        title: 'Drafting Table',
        description: 'Portable drafting table for engineering drawings',
        transactionType: 'BORROW',
        condition: 'Fair',
        price: null,
        deposit: 60,
        location: 'Block A, Room 305',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[4].id,
        categoryId: categories[5].id,
        title: 'Graphing Calculator',
        description: 'TI-84 Plus graphing calculator',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 80,
        location: 'Block C, Room 112',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Project Materials
    prisma.item.create({
      data: {
        ownerId: users[5].id,
        categoryId: categories[6].id,
        title: 'Arduino Starter Kit',
        description: 'Complete Arduino UNO starter kit with components',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 100,
        location: 'Block B, Room 408',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[6].id,
        categoryId: categories[6].id,
        title: 'Raspberry Pi 4',
        description: 'Raspberry Pi 4 with 4GB RAM and power supply',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 120,
        location: 'Block A, Room 210',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[7].id,
        categoryId: categories[6].id,
        title: 'Soldering Iron Kit',
        description: 'Complete soldering iron kit with solder and stand',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 50,
        location: 'Block C, Room 315',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[8].id,
        categoryId: categories[6].id,
        title: 'Multimeter',
        description: 'Digital multimeter for electrical projects',
        transactionType: 'BORROW',
        condition: 'Like New',
        price: null,
        deposit: 45,
        location: 'Block B, Room 120',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    // Additional items
    prisma.item.create({
      data: {
        ownerId: users[9].id,
        categoryId: categories[0].id,
        title: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with good battery life',
        transactionType: 'RENT',
        condition: 'Good',
        price: 8,
        deposit: 60,
        location: 'Block A, Room 425',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[10].id,
        categoryId: categories[1].id,
        title: 'Chemistry Lab Manual',
        description: 'Organic chemistry lab manual with notes',
        transactionType: 'EXCHANGE',
        condition: 'Fair',
        price: null,
        deposit: null,
        location: 'Block C, Room 208',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[11].id,
        categoryId: categories[3].id,
        title: 'Storage Box',
        description: 'Large plastic storage box with lock',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 20,
        location: 'Block B, Room 312',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
    prisma.item.create({
      data: {
        ownerId: users[12].id,
        categoryId: categories[7].id,
        title: 'Umbrella',
        description: 'Large umbrella, wind-resistant',
        transactionType: 'BORROW',
        condition: 'Good',
        price: null,
        deposit: 15,
        location: 'Block A, Room 118',
        availableFrom: new Date('2026-09-01'),
        availableUntil: new Date('2026-12-31'),
        status: 'AVAILABLE',
      },
    }),
  ])

  console.log(`Created ${items.length} items`)

  // Create Item Images for some items
  await Promise.all([
    prisma.itemImage.create({
      data: {
        itemId: items[0].id,
        imageUrl: 'https://example.com/calculator.jpg',
      },
    }),
    prisma.itemImage.create({
      data: {
        itemId: items[1].id,
        imageUrl: 'https://example.com/charger.jpg',
      },
    }),
    prisma.itemImage.create({
      data: {
        itemId: items[2].id,
        imageUrl: 'https://example.com/headphones.jpg',
      },
    }),
    prisma.itemImage.create({
      data: {
        itemId: items[4].id,
        imageUrl: 'https://example.com/textbook.jpg',
      },
    }),
    prisma.itemImage.create({
      data: {
        itemId: items[7].id,
        imageUrl: 'https://example.com/shirt.jpg',
      },
    }),
  ])

  console.log('Created item images')

  // Create Borrow Requests (pending, accepted, completed)
  const borrowRequests = await Promise.all([
    // Pending requests
    prisma.borrowRequest.create({
      data: {
        itemId: items[0].id,
        requesterId: users[2].id,
        ownerId: users[1].id,
        startDate: new Date('2026-09-15'),
        endDate: new Date('2026-09-17'),
        message: 'Need for calculus exam on 16th',
        status: 'PENDING',
      },
    }),
    prisma.borrowRequest.create({
      data: {
        itemId: items[1].id,
        requesterId: users[3].id,
        ownerId: users[2].id,
        startDate: new Date('2026-09-20'),
        endDate: new Date('2026-09-22'),
        message: 'My charger is not working',
        status: 'PENDING',
      },
    }),
    prisma.borrowRequest.create({
      data: {
        itemId: items[4].id,
        requesterId: users[4].id,
        ownerId: users[5].id,
        startDate: new Date('2026-09-25'),
        endDate: new Date('2026-09-30'),
        message: 'Need for DBMS exam preparation',
        status: 'PENDING',
      },
    }),
    // Accepted requests
    prisma.borrowRequest.create({
      data: {
        itemId: items[2].id,
        requesterId: users[5].id,
        ownerId: users[3].id,
        startDate: new Date('2026-09-10'),
        endDate: new Date('2026-09-12'),
        message: 'Need for study session',
        status: 'ACCEPTED',
      },
    }),
    prisma.borrowRequest.create({
      data: {
        itemId: items[7].id,
        requesterId: users[6].id,
        ownerId: users[8].id,
        startDate: new Date('2026-09-12'),
        endDate: new Date('2026-09-14'),
        message: 'Have an interview on 13th',
        status: 'ACCEPTED',
      },
    }),
    // Completed requests
    prisma.borrowRequest.create({
      data: {
        itemId: items[11].id,
        requesterId: users[7].id,
        ownerId: users[11].id,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-03'),
        message: 'Needed to iron clothes for event',
        status: 'COMPLETED',
      },
    }),
    prisma.borrowRequest.create({
      data: {
        itemId: items[13].id,
        requesterId: users[8].id,
        ownerId: users[14].id,
        startDate: new Date('2026-09-05'),
        endDate: new Date('2026-09-07'),
        message: 'Weekend football match',
        status: 'COMPLETED',
      },
    }),
    // Rejected request
    prisma.borrowRequest.create({
      data: {
        itemId: items[5].id,
        requesterId: users[9].id,
        ownerId: users[6].id,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-05'),
        message: 'Need for assignment',
        status: 'REJECTED',
      },
    }),
  ])

  console.log(`Created ${borrowRequests.length} borrow requests`)

  // Create Transactions for accepted and completed requests
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        requestId: borrowRequests[3].id,
        itemId: items[2].id,
        borrowerId: users[5].id,
        ownerId: users[3].id,
        borrowedAt: new Date('2026-09-10'),
        expectedReturnAt: new Date('2026-09-12'),
        status: 'ACTIVE',
      },
    }),
    prisma.transaction.create({
      data: {
        requestId: borrowRequests[4].id,
        itemId: items[7].id,
        borrowerId: users[6].id,
        ownerId: users[8].id,
        borrowedAt: new Date('2026-09-12'),
        expectedReturnAt: new Date('2026-09-14'),
        status: 'ACTIVE',
      },
    }),
    prisma.transaction.create({
      data: {
        requestId: borrowRequests[5].id,
        itemId: items[11].id,
        borrowerId: users[7].id,
        ownerId: users[11].id,
        borrowedAt: new Date('2026-09-01'),
        expectedReturnAt: new Date('2026-09-03'),
        returnedAt: new Date('2026-09-03'),
        status: 'COMPLETED',
      },
    }),
    prisma.transaction.create({
      data: {
        requestId: borrowRequests[6].id,
        itemId: items[13].id,
        borrowerId: users[8].id,
        ownerId: users[14].id,
        borrowedAt: new Date('2026-09-05'),
        expectedReturnAt: new Date('2026-09-07'),
        returnedAt: new Date('2026-09-07'),
        status: 'COMPLETED',
      },
    }),
  ])

  console.log(`Created ${transactions.length} transactions`)

  // Create Reviews for completed transactions
  await Promise.all([
    prisma.review.create({
      data: {
        reviewerId: users[7].id,
        reviewedUserId: users[11].id,
        transactionId: transactions[2].id,
        rating: 5,
        comment: 'Great item, exactly as described. Owner was very cooperative!',
      },
    }),
    prisma.review.create({
      data: {
        reviewerId: users[8].id,
        reviewedUserId: users[14].id,
        transactionId: transactions[3].id,
        rating: 4,
        comment: 'Football was in good condition. Thanks!',
      },
    }),
    prisma.review.create({
      data: {
        reviewerId: users[11].id,
        reviewedUserId: users[7].id,
        transactionId: transactions[2].id,
        rating: 5,
        comment: 'Returned on time, very responsible borrower.',
      },
    }),
  ])

  console.log('Created reviews')

  // Create Messages
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: users[2].id,
        receiverId: users[1].id,
        requestId: borrowRequests[0].id,
        content: 'Hi, can I borrow the calculator for 2 days?',
      },
    }),
    prisma.message.create({
      data: {
        senderId: users[1].id,
        receiverId: users[2].id,
        requestId: borrowRequests[0].id,
        content: 'Sure, I can lend it to you.',
        readAt: new Date(),
      },
    }),
    prisma.message.create({
      data: {
        senderId: users[3].id,
        receiverId: users[2].id,
        requestId: borrowRequests[1].id,
        content: 'Is the charger still available?',
      },
    }),
  ])

  console.log('Created messages')

  // Create Notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: 'BORROW_REQUEST',
        message: 'Sarah Williams requested to borrow your Scientific Calculator',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[2].id,
        type: 'BORROW_REQUEST',
        message: 'Michael Chen requested to borrow your USB-C Charger',
        read: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[5].id,
        type: 'REQUEST_ACCEPTED',
        message: 'Your request for Wireless Headphones has been accepted',
        read: true,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[7].id,
        type: 'TRANSACTION_COMPLETED',
        message: 'Your transaction for Steam Iron has been completed',
        read: true,
      },
    }),
  ])

  console.log('Created notifications')

  // Create Urgent Requests
  await Promise.all([
    prisma.urgentRequest.create({
      data: {
        userId: users[9].id,
        categoryId: categories[0].id,
        requestedItem: 'Laptop charger urgently needed',
        description: 'My laptop charger stopped working and I have exams tomorrow',
        requiredDate: new Date('2026-09-11'),
        duration: 2,
        location: 'Block A, Room 425',
        status: 'OPEN',
      },
    }),
    prisma.urgentRequest.create({
      data: {
        userId: users[10].id,
        categoryId: categories[2].id,
        requestedItem: 'Formal shoes for interview',
        description: 'Have a job interview on 12th, need formal shoes size 9',
        requiredDate: new Date('2026-09-12'),
        duration: 1,
        location: 'Block C, Room 208',
        status: 'OPEN',
      },
    }),
    prisma.urgentRequest.create({
      data: {
        userId: users[13].id,
        categoryId: categories[6].id,
        requestedItem: 'Multimeter for lab',
        description: 'Need multimeter for electronics lab tomorrow',
        requiredDate: new Date('2026-09-11'),
        duration: 1,
        location: 'Block C, Room 420',
        status: 'FULFILLED',
      },
    }),
  ])

  console.log('Created urgent requests')

  // Create Reports
  await Promise.all([
    prisma.report.create({
      data: {
        reporterId: users[1].id,
        reportedUserId: users[9].id,
        itemId: null,
        reason: 'Late return',
        description: 'User returned item 3 days late without communication',
        status: 'PENDING',
      },
    }),
    prisma.report.create({
      data: {
        reporterId: users[2].id,
        reportedUserId: users[10].id,
        itemId: items[1].id,
        reason: 'Item damaged',
        description: 'Item was returned with visible damage',
        status: 'INVESTIGATING',
      },
    }),
  ])

  console.log('Created reports')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
