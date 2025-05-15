require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // allow frontend access

// 📩 Endpoint to create PDF and send it via email
app.post('/send-prescription', async (req, res) => {
  try {
    const { patientName, diagnosis, medicines, email } = req.body;

    // Validate inputs
    if (!patientName || !diagnosis || !medicines || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure prescriptions folder exists
    const prescriptionsDir = path.join(__dirname, 'prescriptions');
    if (!fs.existsSync(prescriptionsDir)) {
      fs.mkdirSync(prescriptionsDir, { recursive: true });
    }

    const filePath = path.join(prescriptionsDir, 'prescription.pdf');
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Prescription Record', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Patient Name: ${patientName}`);
    doc.text(`Diagnosis: ${diagnosis}`);
    doc.text(`Medicines: ${medicines}`);
    doc.end();

    stream.on('finish', async () => {
      // Email setup
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your Prescription',
        text: 'Please find your prescription attached.',
        attachments: [
          {
            filename: 'prescription.pdf',
            path: filePath,
            contentType: 'application/pdf',
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      fs.unlinkSync(filePath); // delete PDF after sending

      res.status(200).json({ message: 'Email sent successfully!' });
    });

  } catch (error) {
    console.error('❌ Error sending prescription:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Start the server
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || "https://ehr-fyp-1.onrender.com/";

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
