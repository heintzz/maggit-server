const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

router.put('/token/:device_id', tokenController.updateToken);

module.exports = router;
