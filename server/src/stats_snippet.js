// ... existing imports
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns'); // We might need date-fns or just use native JS

// ... existing code

// Dashboard Stats
app.get('/api/stats', async (req, res) => {
    try {
        // 1. Basic Counts
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const dailySales = await prisma.bill.aggregate({
            where: { createdAt: { gte: startOfToday } },
            _sum: { total: true }
        });

        const monthlySales = await prisma.bill.aggregate({
            where: { createdAt: { gte: startOfThisMonth } },
            _sum: { total: true }
        });

        const totalOrders = await prisma.bill.count();

        // 2. Top 5 Products by Revenue
        const topProductsRaw = await prisma.billItem.groupBy({
            by: ['serviceId'],
            _sum: { price: true },
            orderBy: { _sum: { price: 'desc' } },
            take: 5
        });

        // Fetch service names
        const topProducts = await Promise.all(topProductsRaw.map(async (item) => {
            const service = await prisma.service.findUnique({ where: { id: item.serviceId } });
            return {
                name: service ? service.name : 'Unknown',
                value: item._sum.price
            };
        }));

        // 3. Monthly Revenue Trend (Last 6 Months)
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const revenue = await prisma.bill.aggregate({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                },
                _sum: { total: true }
            });

            monthlyTrend.push({
                name: start.toLocaleString('default', { month: 'short' }),
                revenue: revenue._sum.total || 0
            });
        }

        // 4. Recent Bills
        const recentBills = await prisma.bill.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { customer: true } // Assuming relation exists or just use customerName
        });

        res.json({
            dailySales: dailySales._sum.total || 0,
            monthlySales: monthlySales._sum.total || 0,
            totalOrders,
            topProducts,
            monthlyTrend,
            recentBills
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
