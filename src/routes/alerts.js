const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/alertController');

router.use(auth);
router.get('/', ctrl.list);
router.put('/:id/seen', ctrl.markSeen);

module.exports = router;