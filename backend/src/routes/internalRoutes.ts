/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as diceConfigController from '@/api/internal/dice-config/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Dice Configuration routes - /api/internal/dice-config
 */
router.get('/dice-config', diceConfigController.getHandler);
router.post('/dice-config', diceConfigController.setHandler);
router.post('/dice-config/validate-custom', diceConfigController.validateCustomHandler);
router.get('/dice-config/predefined-options', diceConfigController.getPredefinedOptionsHandler);

export default router;
