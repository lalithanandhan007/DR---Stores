import { Router } from 'express';
import { getDashboardStats, getWeeklyRevenue, getMonthlyRevenue, getOrderTrend, getCategoryDistribution, getTopProducts, getLowStock, getActivity, getAnalytics, getReports } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/weekly-revenue', getWeeklyRevenue);
router.get('/monthly-revenue', getMonthlyRevenue);
router.get('/order-trend', getOrderTrend);
router.get('/category-distribution', getCategoryDistribution);
router.get('/top-products', getTopProducts);
router.get('/low-stock', getLowStock);
router.get('/activity', getActivity);
router.get('/analytics', getAnalytics);
router.get('/reports', getReports);

export default router;
