/**
 * @summary
 * Business logic for Dice Configuration entity.
 * Handles configuration operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/diceConfig/diceConfigService
 */

import { z } from 'zod';
import {
  DICE_DEFAULTS,
  DICE_PREDEFINED_OPTIONS,
  DICE_SELECTION_METHOD,
  DICE_VALIDATION_STATUS,
} from '@/constants';
import { ServiceError } from '@/utils';
import {
  DiceConfigEntity,
  DiceConfigResponse,
  DiceConfigValidationResult,
} from './diceConfigTypes';
import { predefinedSidesSchema, customSidesSchema, setConfigSchema } from './diceConfigValidation';

/**
 * Creates default dice configuration
 * @returns {DiceConfigEntity} Default configuration object
 */
function createDefaultConfig(): DiceConfigEntity {
  const sides = DICE_DEFAULTS.DEFAULT_SIDES;
  return {
    diceSides: sides,
    selectionMethod: DICE_SELECTION_METHOD.PREDEFINED,
    probabilityRange: {
      min: 1,
      max: sides,
    },
    individualProbability: 1 / sides,
    displayFormat: `D${sides}`,
    sessionTimestamp: new Date().toISOString(),
    storageFallbackStatus: 'localStorage',
    instanceSyncKey: generateSyncKey(),
  };
}

/**
 * Generates unique sync key for instance synchronization
 * @returns {string} Unique sync key
 */
function generateSyncKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculates probability data based on dice sides
 * @param {number} sides - Number of dice sides
 * @returns {object} Probability calculations
 */
function calculateProbability(sides: number) {
  return {
    probabilityRange: {
      min: 1,
      max: sides,
    },
    individualProbability: 1 / sides,
  };
}

/**
 * @summary
 * Retrieves current dice configuration.
 *
 * @function diceConfigGet
 * @module services/diceConfig
 *
 * @returns {Promise<DiceConfigResponse>} Current dice configuration
 *
 * @example
 * const config = await diceConfigGet();
 * // Returns: { diceSides: 6, selectionMethod: 'predefined', ... }
 */
export async function diceConfigGet(): Promise<DiceConfigResponse> {
  const config = createDefaultConfig();

  return {
    diceSides: config.diceSides,
    selectionMethod: config.selectionMethod,
    probabilityRange: config.probabilityRange,
    individualProbability: config.individualProbability,
    displayFormat: config.displayFormat,
  };
}

/**
 * @summary
 * Sets dice configuration with validation.
 *
 * @function diceConfigSet
 * @module services/diceConfig
 *
 * @param {unknown} body - Raw request body to validate against setConfigSchema
 * @returns {Promise<DiceConfigResponse>} The updated dice configuration
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 *
 * @example
 * const config = await diceConfigSet({ diceSides: 20, selectionMethod: 'predefined' });
 * // Returns: { diceSides: 20, selectionMethod: 'predefined', ... }
 */
export async function diceConfigSet(body: unknown): Promise<DiceConfigResponse> {
  const validation = setConfigSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // Validate based on selection method
  if (params.selectionMethod === DICE_SELECTION_METHOD.PREDEFINED) {
    const predefinedValidation = predefinedSidesSchema.safeParse(params.diceSides);
    if (!predefinedValidation.success) {
      throw new ServiceError(
        'VALIDATION_ERROR',
        'Dice sides must be one of: 4, 6, 8, 10, 12, 20',
        400
      );
    }
  } else {
    const customValidation = customSidesSchema.safeParse(params.diceSides);
    if (!customValidation.success) {
      throw new ServiceError('VALIDATION_ERROR', customValidation.error.errors[0].message, 400);
    }
  }

  const probability = calculateProbability(params.diceSides);

  return {
    diceSides: params.diceSides,
    selectionMethod: params.selectionMethod,
    probabilityRange: probability.probabilityRange,
    individualProbability: probability.individualProbability,
    displayFormat: `D${params.diceSides}`,
  };
}

/**
 * @summary
 * Validates custom dice sides input with priority-based error messages.
 *
 * @function diceConfigValidateCustom
 * @module services/diceConfig
 *
 * @param {unknown} body - Raw request body containing customSides
 * @returns {Promise<DiceConfigValidationResult>} Validation result with status and error message
 *
 * @example
 * const result = await diceConfigValidateCustom({ customSides: 100 });
 * // Returns: { isValid: true, status: 'valid' }
 */
export async function diceConfigValidateCustom(body: unknown): Promise<DiceConfigValidationResult> {
  const inputSchema = z.object({
    customSides: z.union([z.number(), z.string()]),
  });

  const inputValidation = inputSchema.safeParse(body);

  if (!inputValidation.success) {
    return {
      isValid: false,
      status: DICE_VALIDATION_STATUS.INVALID,
      errorMessage: 'Por favor, insira a quantidade de lados',
      errorPriority: 2,
    };
  }

  const { customSides } = inputValidation.data;

  // Priority 1: Format validation
  if (typeof customSides === 'string') {
    if (customSides.trim() === '') {
      return {
        isValid: false,
        status: DICE_VALIDATION_STATUS.INVALID,
        errorMessage: 'Por favor, insira a quantidade de lados',
        errorPriority: 2,
      };
    }

    if (customSides.includes('.') || customSides.includes(',')) {
      return {
        isValid: false,
        status: DICE_VALIDATION_STATUS.INVALID,
        errorMessage: 'Digite apenas números inteiros, sem casas decimais',
        errorPriority: 1,
      };
    }

    if (!/^\d+$/.test(customSides)) {
      return {
        isValid: false,
        status: DICE_VALIDATION_STATUS.INVALID,
        errorMessage: 'Digite apenas números inteiros',
        errorPriority: 1,
      };
    }
  }

  const numericValue = typeof customSides === 'number' ? customSides : parseInt(customSides, 10);

  if (isNaN(numericValue)) {
    return {
      isValid: false,
      status: DICE_VALIDATION_STATUS.INVALID,
      errorMessage: 'Digite apenas números inteiros',
      errorPriority: 1,
    };
  }

  if (!Number.isInteger(numericValue)) {
    return {
      isValid: false,
      status: DICE_VALIDATION_STATUS.INVALID,
      errorMessage: 'Digite apenas números inteiros, sem casas decimais',
      errorPriority: 1,
    };
  }

  // Priority 2: Range validation
  if (numericValue < DICE_DEFAULTS.MIN_SIDES) {
    return {
      isValid: false,
      status: DICE_VALIDATION_STATUS.INVALID,
      errorMessage: 'O dado deve ter pelo menos 2 lados',
      errorPriority: 2,
    };
  }

  if (numericValue > DICE_DEFAULTS.MAX_SIDES) {
    return {
      isValid: false,
      status: DICE_VALIDATION_STATUS.INVALID,
      errorMessage: 'Máximo de 1000 lados permitido',
      errorPriority: 2,
    };
  }

  return {
    isValid: true,
    status: DICE_VALIDATION_STATUS.VALID,
  };
}

/**
 * @summary
 * Retrieves predefined dice options.
 *
 * @function diceConfigGetPredefinedOptions
 * @module services/diceConfig
 *
 * @returns {Promise<number[]>} Array of predefined dice side options
 *
 * @example
 * const options = await diceConfigGetPredefinedOptions();
 * // Returns: [4, 6, 8, 10, 12, 20]
 */
export async function diceConfigGetPredefinedOptions(): Promise<number[]> {
  return [...DICE_PREDEFINED_OPTIONS.SIDES];
}
