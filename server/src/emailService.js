const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBillEmail = async (customerEmail, visit, invoice) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not found. Skipping email send.');
        return false;
    }

    if (!customerEmail) {
        console.warn('No customer email provided.');
        return false;
    }

    const itemsHtml = visit.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.service?.name || item.product?.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `Your Receipt from Salon City - Visit #${visit.id}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #d4af37; margin: 0;">SALON CITY</h2>
          <p style="color: #666; margin: 5px 0;">Delhi • +91 81301 03727</p>
        </div>
        
        <p>Hi ${visit.customer.name},</p>
        <p>Thank you for visiting us! Here is your receipt for your recent visit.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(visit.date).toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Visit ID:</strong> #${visit.id}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right;">
          <p style="margin: 5px 0;">Subtotal: ₹${invoice.subtotal.toFixed(2)}</p>
          <p style="margin: 5px 0;">Tax: ₹${invoice.tax.toFixed(2)}</p>
          <p style="margin: 5px 0;">Discount: -₹${invoice.discount.toFixed(2)}</p>
          <h3 style="margin: 10px 0; color: #333;">Total: ₹${invoice.total.toFixed(2)}</h3>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
          <p>We hope to see you again soon!</p>
        </div>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${customerEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendBillEmail };
