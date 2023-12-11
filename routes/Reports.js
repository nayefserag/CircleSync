const router = require('express').Router();
const logic = require('../controllers/Reports.js');

router.get('/report',logic.sendToRadis ,logic.sendReport);

module.exports = router