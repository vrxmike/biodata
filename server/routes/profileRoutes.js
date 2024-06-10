const express = require('express');
const router = express.Router();

/**
 * Controller for handling profile-related operations.
 * @type {Object}
 */
const profileController = require('../controllers/profileController');

/**
 * Route for creating a new profile.
 * @name POST /profiles
 * @function
 * @memberof module:routes/profileRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.post('/profiles', profileController.createProfile);

/**
 * Route for updating a profile by ID.
 * @name PUT /profiles/:id
 * @function
 * @memberof module:routes/profileRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.put('/profiles/:id', profileController.updateProfile);

module.exports = router;
