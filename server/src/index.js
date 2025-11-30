const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { sendBillEmail } = require('./emailService');

const path = require('path');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (admin && admin.password === password) {
    res.json({ success: true, token: 'dummy-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// --- STAFF MANAGEMENT ---
app.get('/api/staff', async (req, res) => {
  const staff = await prisma.staff.findMany({ where: { active: true } });
  res.json(staff);
});

app.post('/api/staff', async (req, res) => {
  const staff = await prisma.staff.create({ data: req.body });
  res.json(staff);
});

// --- PRODUCT MANAGEMENT ---
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const product = await prisma.product.create({ data: req.body });
  res.json(product);
});

// --- SERVICE MANAGEMENT ---
app.get('/api/services', async (req, res) => {
  const services = await prisma.service.findMany({
    where: { deletedAt: null },
    orderBy: { category: 'asc' }
  });
  res.json(services);
});

app.get('/api/services/recent', async (req, res) => {
  const [added, deleted] = await Promise.all([
    prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 5
    }),
    prisma.service.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      take: 5
    })
  ]);
  res.json({ added, deleted });
});

app.post('/api/services', async (req, res) => {
  const { name, price, category, duration, gender } = req.body;
  const service = await prisma.service.create({
    data: {
      name,
      price: parseFloat(price),
      category,
      duration: parseInt(duration) || 30,
      gender: gender || 'Unisex'
    },
  });
  res.json(service);
});

app.delete('/api/services/:id', async (req, res) => {
  await prisma.service.update({
    where: { id: parseInt(req.params.id) },
    data: { deletedAt: new Date() }
  });
  res.json({ success: true });
});

app.patch('/api/services/:id/restore', async (req, res) => {
  await prisma.service.update({
    where: { id: parseInt(req.params.id) },
    data: { deletedAt: null }
  });
  res.json({ success: true });
});

// --- CUSTOMER MANAGEMENT ---
app.get('/api/customers/search', async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.json([]);
  const customer = await prisma.customer.findFirst({
    where: { contactNo: phone, deletedAt: null },
    include: { visits: { include: { invoice: true } } }
  });
  res.json(customer);
});

app.post('/api/customers', async (req, res) => {
  const { name, contactNo, email } = req.body;
  const customer = await prisma.customer.upsert({
    where: { contactNo },
    update: { name, email },
    create: { name, contactNo, email }
  });
  res.json(customer);
});

app.get('/api/customers', async (req, res) => {
  const customers = await prisma.customer.findMany({
    where: { deletedAt: null },
    include: {
      visits: {
        include: {
          invoice: true,
          items: { include: { service: true, product: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(customers);
});

app.delete('/api/customers/:id', async (req, res) => {
  await prisma.customer.update({
    where: { id: parseInt(req.params.id) },
    data: { deletedAt: new Date() }
  });
  res.json({ success: true });
});

// --- VISIT WORKFLOW ---

// 1. Create Visit (Check-in)
app.post('/api/visits', async (req, res) => {
  try {
    const { customerId, staffId, notes } = req.body;
    const visit = await prisma.visit.create({
      data: {
        customerId: parseInt(customerId),
        staffId: staffId ? parseInt(staffId) : null,
        status: 'CHECKED_IN',
        notes
      },
      include: { customer: true, staff: true }
    });
    res.json(visit);
  } catch (error) {
    console.error('Create Visit Error:', error);
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

// 2. Get Active Visits (Dashboard)
app.get('/api/visits/active', async (req, res) => {
  const visits = await prisma.visit.findMany({
    where: { status: { not: 'COMPLETED' } },
    include: { customer: true, staff: true, items: true },
    orderBy: { date: 'desc' }
  });
  res.json(visits);
});

// 3. Get Visit Details
app.get('/api/visits/:id', async (req, res) => {
  const visit = await prisma.visit.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      customer: true,
      staff: true,
      items: { include: { service: true, product: true, staff: true } },
      invoice: true
    }
  });
  res.json(visit);
});

// 3.5 Update Visit Status (Manual)
app.patch('/api/visits/:id/status', async (req, res) => {
  const { status } = req.body;
  const visit = await prisma.visit.update({
    where: { id: parseInt(req.params.id) },
    data: { status }
  });
  res.json(visit);
});

// 4. Update Visit Items (Add Service/Product)
app.post('/api/visits/:id/items', async (req, res) => {
  const { type, itemId, staffId, price, quantity } = req.body;
  const visitId = parseInt(req.params.id);

  const data = {
    visitId,
    type, // SERVICE or PRODUCT
    price: parseFloat(price),
    quantity: quantity || 1,
    staffId: staffId ? parseInt(staffId) : null
  };

  if (type === 'SERVICE') data.serviceId = parseInt(itemId);
  if (type === 'PRODUCT') data.productId = parseInt(itemId);

  const item = await prisma.visitItem.create({ data });

  // Auto-update status to IN_SERVICE if adding items
  await prisma.visit.update({
    where: { id: visitId },
    data: { status: 'IN_SERVICE' }
  });

  res.json(item);
});

// 5. Remove Visit Item
app.delete('/api/visits/items/:id', async (req, res) => {
  await prisma.visitItem.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// 6. Generate Invoice
app.post('/api/visits/:id/invoice', async (req, res) => {
  const visitId = parseInt(req.params.id);
  const { discount, taxRate } = req.body; // discount is amount, taxRate is %

  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: { items: true }
  });

  const subtotal = visit.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxable = subtotal - discount;
  const tax = (taxable * taxRate) / 100;
  const total = taxable + tax;

  const invoice = await prisma.invoice.upsert({
    where: { visitId },
    update: {
      subtotal,
      discount,
      tax,
      total,
      // Keep existing status if it exists, or maybe reset to PENDING? 
      // If we are regenerating, it usually means we changed items, so PENDING/WAITING_PAYMENT is appropriate.
      // But let's just update the amounts. The status update to WAITING_PAYMENT happens below anyway.
    },
    create: {
      visitId,
      subtotal,
      discount,
      tax,
      total,
      status: 'PENDING'
    }
  });

  await prisma.visit.update({
    where: { id: visitId },
    data: { status: 'WAITING_PAYMENT' }
  });

  res.json(invoice);
});

// 7. Process Payment
app.post('/api/invoices/:id/pay', async (req, res) => {
  const invoiceId = parseInt(req.params.id);
  const { amount, mode } = req.body;

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount: parseFloat(amount),
      mode
    }
  });

  // Check if fully paid
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true, visit: { include: { customer: true } } }
  });

  const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);

  console.log(`Payment Debug: Invoice ${invoiceId}, Total: ${invoice.total}, Paid: ${totalPaid}`);

  let isPaid = false;
  if (totalPaid >= invoice.total - 1) { // Tolerance for float
    console.log('Payment Debug: Marking as PAID and COMPLETED');
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });
    await prisma.visit.update({
      where: { id: invoice.visitId },
      data: { status: 'COMPLETED' }
    });
    isPaid = true;
  } else {
    console.log('Payment Debug: Payment incomplete');
  }

  res.json({ ...payment, isPaid });

  // Send Email Receipt if fully paid
  if (isPaid) {
    if (invoice.visit.customer.email) {
      sendBillEmail(invoice.visit.customer.email, invoice.visit, invoice);
    }
  }
});

app.post('/api/invoices/:id/send-email', async (req, res) => {
  const invoiceId = parseInt(req.params.id);
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { visit: { include: { customer: true, items: { include: { service: true, product: true } } } } }
  });

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const sent = await sendBillEmail(invoice.visit.customer.email, invoice.visit, invoice);
  res.json({ success: sent });
});

// 8. Feedback
app.post('/api/visits/:id/feedback', async (req, res) => {
  const visitId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  const feedback = await prisma.feedback.create({
    data: { visitId, rating: parseInt(rating), comment }
  });
  res.json(feedback);
});

// --- DASHBOARD STATS ---
app.get('/api/stats', async (req, res) => {
  try {
    const { date } = req.query;
    const selectedDate = date ? new Date(date) : new Date();

    // Start/End of Selected Day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Start/End of Selected Month
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // 1. Daily Sales (Selected Date)
    const dailySales = await prisma.invoice.aggregate({
      where: { createdAt: { gte: startOfDay, lte: endOfDay }, status: 'PAID' },
      _sum: { total: true }
    });

    // 2. Monthly Revenue (Selected Month)
    const monthlySales = await prisma.invoice.aggregate({
      where: { createdAt: { gte: startOfMonth, lte: endOfMonth }, status: 'PAID' },
      _sum: { total: true }
    });

    // 3. Daily Orders (Selected Date)
    const dailyOrders = await prisma.visit.count({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: 'COMPLETED'
      }
    });

    // 4. Monthly Orders (Selected Month)
    const monthlyOrders = await prisma.visit.count({
      where: {
        date: { gte: startOfMonth, lte: endOfMonth },
        status: 'COMPLETED'
      }
    });

    // 5. Top 5 Products/Services (Selected Month)
    const items = await prisma.visitItem.findMany({
      where: { visit: { status: 'COMPLETED', date: { gte: startOfMonth, lte: endOfMonth } } },
      include: { service: true, product: true }
    });

    const itemCounts = {};
    items.forEach(item => {
      const name = item.service?.name || item.product?.name || 'Unknown';
      itemCounts[name] = (itemCounts[name] || 0) + 1;
    });

    const topProducts = Object.entries(itemCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 6. Monthly Trend (Last 6 months from Selected Date)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(selectedDate);
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);

      const revenue = await prisma.invoice.aggregate({
        where: { createdAt: { gte: start, lte: end }, status: 'PAID' },
        _sum: { total: true }
      });

      monthlyTrend.push({
        name: start.toLocaleString('default', { month: 'short' }),
        revenue: revenue._sum.total || 0
      });
    }

    // 7. Recent Transactions (Selected Date)
    const recentBills = await prisma.invoice.findMany({
      where: date ? { createdAt: { gte: startOfDay, lte: endOfDay } } : {},
      take: date ? undefined : 5,
      orderBy: { createdAt: 'desc' },
      include: { visit: { include: { customer: true } } }
    });

    // Format recent bills for frontend
    const formattedRecentBills = recentBills.map(inv => ({
      id: inv.id,
      visitId: inv.visitId,
      customerName: inv.visit.customer.name,
      contactNo: inv.visit.customer.contactNo,
      createdAt: inv.createdAt,
      total: inv.total,
      status: inv.status
    }));

    res.json({
      dailySales: dailySales._sum.total || 0,
      monthlySales: monthlySales._sum.total || 0,
      dailyOrders,
      monthlyOrders,
      topProducts,
      monthlyTrend,
      recentBills: formattedRecentBills
    });

  } catch (e) {
    console.error('Stats Error:', e);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Auto-create default admin if not exists
  try {
    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: { username: 'admin', password: 'password123' }
    });
    console.log('Admin user verified/created:', admin.username);
  } catch (error) {
    console.error('Failed to verify admin user:', error);
  }
});
