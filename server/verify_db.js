const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const serviceCount = await prisma.service.count();
    const customerCount = await prisma.customer.count();
    const billCount = await prisma.bill.count();
    const adminCount = await prisma.admin.count();

    console.log('--- Database Status ---');
    console.log(`Services: ${serviceCount}`);
    console.log(`Customers: ${customerCount}`);
    console.log(`Bills: ${billCount}`);
    console.log(`Admins: ${adminCount}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
