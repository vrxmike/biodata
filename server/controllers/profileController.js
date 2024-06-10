const Profile = require('../models/profile'); // Assuming your profile model

// Function to create a new profile
const createProfile = async (userId, reqBody, session) => {
  try {
    // 1. Extract profile data from request body and include the userId
    const extractedData = extractProfileData(reqBody); // Call extractProfileData function
    extractedData.userId = userId;

    // 3. Create a new profile document
    const profile = new Profile(extractedData, user._id);

    // 4. Try to save the profile document
    // Mongoose will automatically validate the data
    await profile.save({ session });

    // 4. return the created profile document
    return profile;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by caller
  }
};

// Function to extract profile data from request body
function extractProfileData(reqBody) {
  if (!reqBody || !reqBody.personal_info) {
    return {}; // Return an empty object or some default value
  }
  
  const {
    // Extract relevant fields based on your profile schema
    personal_info: {
      full_name,
      date_of_birth,
      place_of_birth,
      marital_status,
      number_of_children,
      name_of_spouse,
      IDNumber,
      passport_number,
      KRAPin,
      current_residence_address,
    },
    voter_info: {
      registered_Voter,
      constituency,
      ward,
      county,
      voter_Card_No,
      voting_Station,
      date_registered,
    },
    affiliations: {
      other_muslim_organizations,
      capacity_in_organizations,
    },
    education: {
      secular_level,
      islamic_level,
    },
    languages,
    religious_service: { imam },
    employment: { place_of_work, company_name },
    health_info: { blood_group, ailments_allergies },
    emergency_contact_info: {
      next_of_kin,
      relationship,
      mobile_number,
      email,
      residential_address,
    },
    documents: { 'C.V': cvId, idcard, passport, profile_picture },
    application_status,
    admin_notes,
    admin_approval_date,
    admin_rejection_date,
    application_progress: { status, timestamp, notes },
    user_role,
    // ... Extract other relevant fields and adjust as needed
  } = reqBody;

  return {
    personal_info: {
      full_name,
      date_of_birth,
      place_of_birth,
      marital_status,
      number_of_children,
      name_of_spouse,
      IDNumber,
      passport_number,
      KRAPin,
      current_residence_address,
    },
    voter_info: {
      registered_Voter,
      constituency,
      ward,
      county,
      voter_Card_No,
      voting_Station,
      date_registered,
    },
    affiliations: {
      other_muslim_organizations,
      capacity_in_organizations,
    },
    education: {
      secular_level,
      islamic_level,
    },
    languages,
    religious_service: { imam },
    employment: { place_of_work, company_name },
    health_info: { blood_group, ailments_allergies },
    emergency_contact_info: {
      next_of_kin,
      relationship,
      mobile_number,
      email,
      residential_address,
    },
    documents: { 'C.V': cvId, idcard, passport, profile_picture },
    application_status,
    admin_notes,
    admin_approval_date,
    admin_rejection_date,
    application_progress: { status, timestamp, notes },
    user_role,
    // Add other fields as needed
  };
}

// Function to update a profile
const updateProfile = async (userId, profileId, reqBody, session) => {
  try {
    // 1. Extract profile data from request body
    const extractedData = extractProfileData(reqBody); // Call extractProfileData function

    // 3. Update profile document
    const updatedProfile = await Profile.findByIdAndUpdate(
      { _id: profileId, user: userId },
      { $set: extractedData },
      { new: true, session, runValidators: true }
    );
    
    // 4. Return the updated profile document
    return updatedProfile;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by caller
  }
};
// Other profile-related

module.exports = {
  createProfile,
  extractProfileData,
  updateProfile
};
