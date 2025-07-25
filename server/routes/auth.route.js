// server/routes/auth.route.js
const express = require('express');
const { signup} = require('../controllers/auth.controller'); // Import functions

const router = express.Router();

router.post('/signup', signup);



module.exports = router;