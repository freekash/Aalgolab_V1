const express = require('express');
const router = express.Router();
const controller = require('../controllers/apiKeyController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', controller.list);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/verify', controller.verify);

module.exports = router;
