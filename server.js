const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { cleanEnv, str, port } = require('envalid');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate environment variables
const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  MONGO_URI: str(),
});

// Create logger with Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Connect to MongoDB
mongoose.connect(env.MONGO_URI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define Mongoose schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  subject: { type: String, required: true, minlength: 3, maxlength: 100 },
  message: { type: String, required: true, minlength: 10, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Serve static files from 'public' directory (including index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiter: max 5 requests per IP per 15 minutes on /submit-form
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/submit-form', limiter);

// Validation function
function validateFormData(data) {
  const nameRegex = /^[A-Za-z\s]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const subjectRegex = /^[A-Za-z0-9\s.,!?'"-]{3,100}$/;
  const messageRegex = /^[A-Za-z0-9\s.,!?'"-]{10,500}$/;

  return (
    nameRegex.test(data.name) &&
    emailRegex.test(data.email) &&
    phoneRegex.test(data.phone) &&
    subjectRegex.test(data.subject) &&
    messageRegex.test(data.message)
  );
}

// POST endpoint to handle contact form submissions
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic presence check
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Format validation
    if (!validateFormData(req.body)) {
      return res.status(400).json({ message: 'Invalid input data format.' });
    }

    // Save to database
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();

    logger.info(`New contact saved: ${email}`);

    return res.status(200).json({ message: 'Your message has been received. Thank you!' });
  } catch (error) {
    logger.error('Error saving contact:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong.' });
});

// Start the server
app.listen(env.PORT, () => {
  logger.info(`Server started at http://localhost:${env.PORT}`);
});
