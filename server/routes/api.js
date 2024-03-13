const express = require('express');
const router = express.Router();

/**
 * The registration routes module.
 *
 * @type {Object}
 */
const registrationRoutes = require('./registrationRoutes');

/**
 * The profile routes module.
 *
 * @type {Object}
 */
const profileRoutes = require('./profileRoutes');

/**
 * The authentication routes module.
 *
 * @type {Object}
 */
const authRoutes = require('./authRoutes');

/**
 * The user routes module.
 *
 * @type {Object}
 */
const userRoutes = require('./userRoutes');

/**
 * Middleware for handling registration routes.
 */
router.use('/registration', registrationRoutes);

/**
 * Middleware for handling profile routes.
 */
router.use('/profiles', profileRoutes);

/**
 * Middleware for handling authentication routes.
 */
router.use('/auth', authRoutes);

/**
 * Middleware for handling user routes.
 */
router.use('/user', userRoutes);

module.exports = router;
