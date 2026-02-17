const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);

module.exports = router;
