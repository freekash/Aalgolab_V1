const express = require('express');
const router = express.Router();
const controller = require('../controllers/settingsController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', controller.get);
router.put('/', controller.update);

module.exports = router;
