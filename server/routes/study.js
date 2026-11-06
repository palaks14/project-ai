const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/log', studyController.logSession);
router.get('/revision-queue', studyController.getRevisionQueue);

module.exports = router;
