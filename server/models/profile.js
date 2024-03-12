const mongoose = require('mongoose');

/**
 * Represents the profile schema for a user.
 *
 * @typedef {Object} ProfileSchema
 * @property {mongoose.Schema.Types.ObjectId} _id - The unique identifier for the profile.
 * @property {mongoose.Schema.Types.ObjectId} user - The reference to the User model.
 * @property {Object} personal_info - The personal information of the user.
 * @property {Object} voter_info - The voter information of the user.
 * @property {Object} affiliations - The affiliations of the user.
 * @property {Object} education - The education details of the user.
 * @property {string} languages - The languages known by the user.
 * @property {Object} religious_service - The religious service details of the user.
 * @property {Object} employment - The employment details of the user.
 * @property {Object} health_info - The health information of the user.
 * @property {Object} emergency_contact_info - The emergency contact information of the user.
 * @property {mongoose.Schema.Types.ObjectId} signature - The signature of the user.
 * @property {Object} documents - The documents associated with the user.
 * @property {string} application_status - The status of the user's application.
 * @property {string} admin_notes - The comments made by the admin on the application.
 * @property {Date} admin_approval_date - The date of admin approval.
 * @property {Date} admin_rejection_date - The date of admin rejection.
 * @property {Object} application_progress - The progress of the user's application.
 * @property {string} user_role - The role of the user.
 */
const profileSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  },
  personal_info: {
    type: {
      full_name: { type: String, isActivated: true },
      date_of_birth: { type: Date, isActivated: true },
      place_of_birth: { type: String, isActivated: true },
      marital_status: { type: String, isActivated: true },
      number_of_children: { type: String, isActivated: true },
      name_of_spouse: { type: String, isActivated: true },
      IDNumber: { type: String, isActivated: true },
      passport_number: { type: String, isActivated: true },
      KRAPin: { type: String, isActivated: true },
      current_residence_address: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: [
      'full_name',
      'date_of_birth',
      'place_of_birth',
      'marital_status',
      'number_of_children',
      'name_of_spouse',
      'IDNumber',
      'passport_number',
      'KRAPin',
      'current_residence_address',
    ],
  },
  voter_info: {
    type: {
      registered_Voter: { type: Boolean, isActivated: true },
      constituency: { type: String, isActivated: true },
      ward: { type: String, isActivated: true },
      county: { type: String, isActivated: true },
      voter_Card_No: { type: String, isActivated: true },
      voting_Station: { type: String, isActivated: true },
      date_registered: { type: Date, isActivated: true },
    },
    additionalProperties: true,
    required: [
      'registered_Voter',
      'constituency',
      'ward',
      'county',
      'voter_Card_No',
      'voting_Station',
      'date_registered',
    ],
  },
  affiliations: {
    type: {
      other_muslim_organizations: { type: Boolean, isActivated: true },
      capacity_in_organizations: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: ['other_muslim_organizations', 'capacity_in_organizations'],
  },
  education: {
    type: {
      secular_level: { type: String, isActivated: true },
      islamic_level: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: ['secular_level', 'islamic_level'],
  },
  languages: {
    type: String,
    isActivated: true,
    examples: ['English, Kiswahili, Arabic'],
  },
  religious_service: {
    type: {
      imam: { type: Boolean, isActivated: true },
    },
    additionalProperties: true,
    required: ['imam'],
  },
  employment: {
    type: {
      place_of_work: { type: String, isActivated: true },
      company_name: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: ['place_of_work', 'company_name'],
  },
  health_info: {
    type: {
      blood_group: { type: String, isActivated: true },
      ailments_allergies: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: ['blood_group', 'ailments_allergies'],
  },
  emergency_contact_info: {
    type: {
      next_of_kin: { type: String, isActivated: true },
      relationship: { type: String, isActivated: true },
      mobile_number: { type: String, isActivated: true },
      email: { type: String, isActivated: true },
      residential_address: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: ['next_of_kin', 'relationship', 'mobile_number', 'email', 'residential_address'],
  },
  signature: {
    type: mongoose.Schema.Types.ObjectId,
    isActivated: true,
  },
  documents: {
    type: {
      'C.V': { type: mongoose.Schema.Types.ObjectId, isActivated: true },
      idcard: { type: mongoose.Schema.Types.ObjectId, isActivated: true },
      passport: { type: mongoose.Schema.Types.ObjectId, isActivated: true },
      profile_picture: { type: mongoose.Schema.Types.ObjectId, isActivated: true },
    },
    additionalProperties: true,
    required: ['C.V', 'idcard', 'passport', 'profile_picture' ],
  },
  application_status: {
    type: String,
    isActivated: true,
    examples: ['pending', 'approved', 'rejected'],
  },
  admin_notes: {
    type: String,
    isActivated: true,
    examples: ["Admin's comments on the application"],
  },
  admin_approval_date: {
    type: Date,
    isActivated: true,
  },
  admin_rejection_date: {
    type: Date,
    isActivated: true,
  },
  application_progress: {
    type: {
      status: { type: String, isActivated: true },
      timestamp: { type: Date, isActivated: true },
      notes: { type: String, isActivated: true },
    },
    additionalProperties: true,
    required: ['status', 'timestamp', 'notes'],
  },
  user_role: {
    type: String,
    enum: ['standard_user', 'admin'],
    isActivated: true,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
