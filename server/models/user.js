const mongoose = require('mongoose');
/**
 * User Schema
 *
 * @typedef {Object} UserSchema
 * @property {mongoose.Schema.Types.ObjectId} _id - The unique identifier for the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {string} role - The role of the user. Can be 'standard_user' or 'admin'.
 * @property {Date} created_at - The date when the user was created.
 * @property {Date} updated_at - The date when the user was last updated.
 * @property {boolean} isAdmin - Indicates whether the user is an admin or not.
 * @property {mongoose.Schema.Types.ObjectId} profile - The reference to the user's profile.
 *
 * @property {boolean} isActivated - Indicates whether the user is activated or not.
 *
 * @typedef {import('mongoose').Model<UserSchema>} UserModel
 */
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique email addresses
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    // Examples and other validations can be added here
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password should be at least 6 characters.'],
    // Remember to implement secure password hashing!
  },
  role: {
    type: String,
    enum: ['standard_user', 'admin'],
    default: 'standard_user',
    // Examples and other validations can be added here
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
  },
  isActivated: {
    type: Boolean,
    default: true,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  }
}, {
  additionalProperties: true,
  required: [
    "_id",
    "email",
    "password",
    "role",
    "created_at",
    "updated_at",
    "isAdmin",
    "profile"
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
