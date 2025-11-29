const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Admin
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: { username: 'admin', password: 'password123' },
    });

    // 2. Staff
    const staffMembers = [
        { name: 'Alice', role: 'Stylist' },
        { name: 'Bob', role: 'Stylist' },
        { name: 'Charlie', role: 'Manager' },
        { name: 'Diana', role: 'Receptionist' },
    ];

    for (const s of staffMembers) {
        await prisma.staff.create({ data: s });
    }

    // 3. Services
    const services = [
        { name: 'Men Haircut', category: 'Hair', price: 250, duration: 30 },
        { name: 'Women Haircut', category: 'Hair', price: 500, duration: 45 },
        { name: 'Hair Spa', category: 'Hair', price: 1200, duration: 60 },
        { name: 'Root Touchup', category: 'Hair', price: 1500, duration: 90 },
        { name: 'Clean Up', category: 'Skin Care', price: 600, duration: 30 },
        { name: 'Gold Facial', category: 'Skin Care', price: 2000, duration: 60 },
        { name: 'Diamond Facial', category: 'Skin Care', price: 3000, duration: 60 },
        { name: 'Manicure', category: 'Manicure/Pedicure', price: 500, duration: 45 },
        { name: 'Pedicure', category: 'Manicure/Pedicure', price: 600, duration: 45 },
        { name: 'Full Arms Wax', category: 'Waxing', price: 300, duration: 20 },
        { name: 'Full Legs Wax', category: 'Waxing', price: 500, duration: 30 },
        { name: 'Bridal Makeup', category: 'Makeup', price: 15000, duration: 180 },
        { name: 'Party Makeup', category: 'Makeup', price: 3000, duration: 60 },
    ];

    for (const s of services) {
        await prisma.service.create({ data: s });
    }

    // 4. Products
    const products = [
        { name: 'Loreal Shampoo', category: 'Hair Care', price: 800, stock: 20 },
        { name: 'Loreal Conditioner', category: 'Hair Care', price: 750, stock: 15 },
        { name: 'Face Serum', category: 'Skin Care', price: 1200, stock: 10 },
        { name: 'Hair Gel', category: 'Styling', price: 400, stock: 25 },
    ];

    for (const p of products) {
        await prisma.product.create({ data: p });
    }

    // 5. Sample Customers
    const customers = [
        { name: 'Rahul Sharma', contactNo: '9876543210', email: 'rahul@example.com' },
        { name: 'Priya Singh', contactNo: '9988776655', email: 'priya@example.com' },
    ];

    for (const c of customers) {
        await prisma.customer.create({ data: c });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
