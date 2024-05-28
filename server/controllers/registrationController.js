/**
 * @fileoverview This file contains the registration controller logic for user registration, email verification, and user/profile retrieval and deletion.
 * @module controllers/registrationController
 * @requires mongoose
 * @requires ../models/user
 * @requires ../models/profile
 * @requires bcrypt
 * @requires ./profileController
 * @requires nodemailer
 * @requires crypto
 */

// FILEPATH: /home/vamp/project-vayan/server/controllers/registrationController.js

const mongoose = require('mongoose');
const User = require('../models/user');
const Profile = require('../models/profile');
const bcrypt = require('bcrypt'); // For password hashing
const profileController = require('./profileController'); // Adjust path as needed
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the registration is successful or rejects with an error.
 */
const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1. Extract and validate user data
    const { email, password, role } = req.body;
    // Validate role
    /**
     * Array of allowed roles.
     * @type {string[]}
     */
    const allowedRoles = ["standard_user", "admin"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 2. Check for existing user (optional)
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3. Create user document with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save({ session });

    // 4. Delegate profile creation to profileController
    await profileController.createProfile(user._id, req.body, session);

    // 5. Send confirmation email (if applicable)
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");

    // Save the token in user document
    user.emailVerificationToken = emailVerificationToken;
    await user.save({ session });

    // Send verification email
    const transporter = nodemailer.createTransport({  /* your SMTP settings */});
    const mailOptions = {
      to: user.email,
      from: "no-reply@example.com",
      subject: "Email Verification",
      text: `Please verify your email address by clicking on the following link: http://${req.headers.host}/verify-email?token=${emailVerificationToken}`,
    };
    await transporter.sendMail(mailOptions);

    // 6. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // 7. Send success response
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    const errorMessage = error.message || 'Error during registration';
    res.status(500).json({ message: errorMessage }); // Provide more specific error messages
  }
};

/**
 * Verifies the user's email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the email is verified successfully or rejects with an error.
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Find user by token
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Verify user
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a new verification token
    const emailVerificationToken = crypto.randomBytes(20).toString("hex");

    // Save the token in user document
    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({  /* your SMTP settings */});
    const mailOptions = {
      to: user.email,
      from: "no-reply@example.com",
      subject: "Email Verification",
      text: `Please verify your email address by clicking on the following link: http://${req.headers.host}/verify-email?token=${emailVerificationToken}`,
    };
    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({ message: "Verification email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Retrieves a user and their profile.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with the user and profile data or rejects with an error.
 */
const getUserAndProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find the user document
    const user = await User.findById(req.params.userId).session(session);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the profile document
    const profile = await Profile.findOne({ user: user._id }).populate('user').session(session);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Commit the transaction and end the session
    await session.commitTransaction();
    session.endSession();

    // Send the user email and profile data in the response
    res.json({ email: user.email, profile });
  } catch (error) {
    // If an error occurred, abort the transaction and end the session
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Deletes a user and their profile.
 * @paraam {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user and profile are deleted successfully or rejects with an error.
 */
const deleteUserAndProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find the user document
    const user = await User.findById(req.params.userId).session(session);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and delete the profile document
    const profile = await Profile.findOneAndDelete({ user: user._id }).session(session);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Delete the user document
    await User.findByIdAndDelete(user._id).session(session);

    // Commit the transaction and end the session
    await session.commitTransaction();
    session.endSession();

    // Send a success response
    res.json({ message: 'User and profile deleted successfully' });
  } catch (error) {
    // If an error occurred, abort the transaction and end the session
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, getUserAndProfile, deleteUserAndProfile, verifyEmail, resendVerificationEmail };
