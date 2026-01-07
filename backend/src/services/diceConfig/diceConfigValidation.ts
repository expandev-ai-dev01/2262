/**
 * @summary
 * Validation schemas for Dice Configuration entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/diceConfig/diceConfigValidation
 */

import { z } from 'zod';
import { DICE_DEFAULTS, DICE_PREDEFINED_OPTIONS, DICE_SELECTION_METHOD } from '@/constants';

/**
 * Schema for dice sides validation (predefined)
 */
export const predefinedSidesSchema = z
  .number()
  .refine((val) => (DICE_PREDEFINED_OPTIONS.SIDES as readonly number[]).includes(val), {
    message: 'Dice sides must be one of: 4, 6, 8, 10, 12, 20',
  });

/**
 * Schema for dice sides validation (custom)
 */
export const customSidesSchema = z
  .number()
  .int({ message: 'Digite apenas números inteiros' })
  .min(DICE_DEFAULTS.MIN_SIDES, { message: 'O dado deve ter pelo menos 2 lados' })
  .max(DICE_DEFAULTS.MAX_SIDES, { message: 'Máximo de 1000 lados permitido' });

/**
 * Schema for selection method validation
 */
export const selectionMethodSchema = z.enum([
  DICE_SELECTION_METHOD.PREDEFINED,
  DICE_SELECTION_METHOD.CUSTOM,
]);

/**
 * Schema for set configuration request validation
 */
export const setConfigSchema = z.object({
  diceSides: z.number().int().positive(),
  selectionMethod: selectionMethodSchema,
});

/**
 * Inferred types from schemas
 */
export type SetConfigInput = z.infer<typeof setConfigSchema>;
