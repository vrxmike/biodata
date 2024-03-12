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
 * Route for getting a profile by ID.
 * @name GET /profiles/:id
 * @function
 * @memberof module:routes/profileRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.get('/profiles/:id', profileController.getProfileById);

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

/**
 * Route for deleting a profile by ID.
 * @name DELETE /profiles/:id
 * @function
 * @memberof module:routes/profileRoutes
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
router.delete('/profiles/:id', profileController.deleteProfile);

module.exports = router;
