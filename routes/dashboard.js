const router = require('express').Router();
const auth = require('../auth/auth');
const dashboard = require('../controllers/dashboardController')

router.get('/dashboard', dashboard.storeAdminDashboard);