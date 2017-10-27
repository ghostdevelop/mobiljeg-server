import express from 'express';

import authRoutes from './auth';
import ticketRoutes from './ticket';

const router = express.Router();

// => API /data/
router.use('/auth', authRoutes);
router.use('/ticket', ticketRoutes);

router.use('/', (req, res) => res.status(401).send('No route matched.'));

export default router;
