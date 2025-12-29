(async () => {
  try {
    const nodemailer = require('nodemailer');

    const user = 'romaine.ruecker@ethereal.email';
    const pass = 'NgBTUZJCp1VcGRUBmb';

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `Test <${user}>`,
      to: user,
      subject: 'Ethereal account test message',
      html: '<p>This is a test message sent using the provided Ethereal account.</p>',
    });

    console.log('Message sent: %s', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info) || 'N/A';
    console.log('Preview URL:', previewUrl);
    console.log('SMTP response:', info.response);
  } catch (err) {
    console.error('Error sending test email:', err);
    process.exit(1);
  }
})();
