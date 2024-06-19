require('dotenv').config({ path: './config.env' });
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT generation and verification
const User = require('../models/user'); // Import User model
const crypto = require('crypto'); // For generating password reset token
const nodemailer = require('nodemailer'); // For sending emails

/**
 * Handles user login.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
/**
 * Authenticates a user and generates JWT and refresh tokens.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the authentication process is complete.
 * @throws {Error} - If there is an error during the authentication process.
 */
const login = async (req, res) => {
  try {
    // 1. Extract and validate credentials (consider using a validation library)
    const { email, password } = req.body;
    // Perform robust validation for email format, password length/strength, etc.

    // 2. Find user by email (consider case-insensitive search if needed)
    const user = await User.findOne({ email: { $regex: new RegExp(email, 'i') } });

    // 3. Handle non-existent user gracefully (avoid leaking information)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Avoid revealing specific error details
    }

    // 4. Compare passwords securely using bcrypt (asynchronous version)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Maintain ambiguity for security
    }

    // 5. Generate JWT token with user ID and role as payload and appropriate expiration time
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration based on your needs

    // Generate refresh token
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Adjust expiration based on your needs

    // Save refresh token in user document
    user.refreshToken = refreshToken;
    await user.save();

    // 6. Respond with both tokens
    res.json({ token, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); // Provide a generic error message
  }
};

// Refresh token route
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user by ID and refresh token
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newPayload = { userId: user._id, role: user.role };
    const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiration based on your needs

    res.json({ token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// **Logout route (implement based on your authentication strategy):**
const logout = async (req, res) => {
  try {
    // Extract user ID from request (depends on your authentication middleware)
    const userId = req.user._id;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Invalidate refresh token
    user.refreshToken = null;
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Password reset request route
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate password reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Save the token and set its expiration time
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send password reset email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'passwordreset@example.com',
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${req.headers.host}/reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Password reset route
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by token and check if token has not expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password and update user document
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, logout, refreshToken, requestPasswordReset, resetPassword };
