/**
 * @summary
 * Zod validation schemas for Dice Configuration.
 * Implements all validation rules from feature specification.
 *
 * @module domain/diceConfig/validations/diceConfig
 */

import { z } from 'zod';

const PREDEFINED_OPTIONS = [4, 6, 8, 10, 12, 20] as const;

export const diceConfigSchema = z.object({
  diceSides: z
    .number({ message: 'Número de lados é obrigatório' })
    .int({ message: 'Digite apenas números inteiros' })
    .min(2, { message: 'O dado deve ter pelo menos 2 lados' })
    .max(1000, { message: 'Máximo de 1000 lados permitido' }),
  selectionMethod: z
    .enum(['predefined', 'custom'], { message: 'Método de seleção inválido' })
    .default('predefined'),
});

export const customDiceValidationSchema = z.object({
  customSides: z.union([
    z.number().int().min(2).max(1000),
    z.string().regex(/^\d+$/, { message: 'Digite apenas números inteiros' }),
  ]),
});

export const predefinedOptionsSchema = z.enum(['4', '6', '8', '10', '12', '20'], {
  message: 'Selecione uma opção válida',
});

export { PREDEFINED_OPTIONS };
