/**
 * @summary
 * Form type definitions for Dice Configuration.
 * Derived from Zod schemas for type safety.
 *
 * @module domain/diceConfig/types/forms
 */

import { z } from 'zod';
import { diceConfigSchema, customDiceValidationSchema } from '../validations/diceConfig';

export type DiceConfigFormInput = z.input<typeof diceConfigSchema>;
export type DiceConfigFormOutput = z.output<typeof diceConfigSchema>;

export type CustomDiceValidationInput = z.input<typeof customDiceValidationSchema>;
export type CustomDiceValidationOutput = z.output<typeof customDiceValidationSchema>;
