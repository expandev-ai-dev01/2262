/**
 * @summary
 * API controller for Dice Configuration entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/dice-config/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  diceConfigGet,
  diceConfigSet,
  diceConfigValidateCustom,
  diceConfigGetPredefinedOptions,
} from '@/services/diceConfig';

/**
 * @api {get} /api/internal/dice-config Get Dice Configuration
 * @apiName GetDiceConfig
 * @apiGroup DiceConfig
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.diceSides Number of dice sides
 * @apiSuccess {String} data.selectionMethod Selection method (predefined | custom)
 * @apiSuccess {Number} data.probabilityRange.min Minimum probability range value
 * @apiSuccess {Number} data.probabilityRange.max Maximum probability range value
 * @apiSuccess {Number} data.individualProbability Individual face probability
 * @apiSuccess {String} data.displayFormat Display format (e.g., D6, D20)
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await diceConfigGet();
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/dice-config Set Dice Configuration
 * @apiName SetDiceConfig
 * @apiGroup DiceConfig
 *
 * @apiBody {Number} diceSides Number of dice sides (2-1000)
 * @apiBody {String} selectionMethod Selection method (predefined | custom)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.diceSides Number of dice sides
 * @apiSuccess {String} data.selectionMethod Selection method (predefined | custom)
 * @apiSuccess {Number} data.probabilityRange.min Minimum probability range value
 * @apiSuccess {Number} data.probabilityRange.max Maximum probability range value
 * @apiSuccess {Number} data.individualProbability Individual face probability
 * @apiSuccess {String} data.displayFormat Display format (e.g., D6, D20)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function setHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await diceConfigSet(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/dice-config/validate-custom Validate Custom Dice Sides
 * @apiName ValidateCustomDiceConfig
 * @apiGroup DiceConfig
 *
 * @apiBody {Number|String} customSides Custom dice sides input
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Boolean} data.isValid Validation result
 * @apiSuccess {String} data.status Validation status (valid | invalid | pending)
 * @apiSuccess {String} [data.errorMessage] Error message if invalid
 * @apiSuccess {Number} [data.errorPriority] Error priority level (1 or 2)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code
 * @apiError {String} error.message Error message
 */
export async function validateCustomHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await diceConfigValidateCustom(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/dice-config/predefined-options Get Predefined Dice Options
 * @apiName GetPredefinedDiceOptions
 * @apiGroup DiceConfig
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number[]} data Array of predefined dice side options
 */
export async function getPredefinedOptionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await diceConfigGetPredefinedOptions();
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
