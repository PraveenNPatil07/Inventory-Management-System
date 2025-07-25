// server/routes/auth.route.js
const express = require('express');
const { signup,signin} = require('../controllers/auth.controller'); // Import functions

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);




module.exports = router;