require('dotenv').config({ path: './config.env' });
const User = require('../models/user'); // Relative path to user model
const crypto = require('crypto'); // For generating email update token
const nodemailer = require('nodemailer'); // For sending emails

// Email update request route
/**
 * Handles the request to update the user's email address.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the email update process is complete.
 * @throws {Error} - If there is a server error.
 */
const requestEmailUpdate = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate email update token
    const token = crypto.randomBytes(20).toString('hex');

    // Save the token and new email
    user.emailUpdateToken = token;
    user.newEmail = newEmail;
    await user.save();

    // Send verification email to new email address
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      post: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    // Define mail options
    const mailOptions = {
      to: newEmail,
      from: 'emailupdate@example.com',
      subject: 'Email Update Verification',
      text: `Please click on the following link, or paste this into your browser to complete the process:\n\nhttp://${req.headers.host}/verify-email-update/${token}\n\nIf you did not request this, please ignore this email and your email address will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Verification email sent to new email address' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Email update verification route
const verifyEmailUpdate = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by token
    const user = await User.findOne({ emailUpdateToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update email address and remove the token and new email
    user.email = user.newEmail;
    user.newEmail = undefined;
    user.emailUpdateToken = undefined;
    await user.save();

    res.json({ message: 'Email update successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requestEmailUpdate, verifyEmailUpdate };
