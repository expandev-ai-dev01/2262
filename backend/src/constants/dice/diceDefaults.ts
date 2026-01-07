/**
 * @summary
 * Default values and constants for Dice configuration.
 * Provides centralized configuration for dice sides, validation limits,
 * and predefined dice options.
 *
 * @module constants/dice/diceDefaults
 */

/**
 * @interface DiceDefaultsType
 * @description Default configuration values for dice system.
 *
 * @property {number} DEFAULT_SIDES - Default number of sides when app starts (6)
 * @property {number} MIN_SIDES - Minimum allowed sides for custom dice (2)
 * @property {number} MAX_SIDES - Maximum allowed sides for custom dice (1000)
 * @property {number} SESSION_EXPIRY_HOURS - Hours until session expires (24)
 * @property {number} SYNC_POLLING_INTERVAL_MS - Polling interval when storage events fail (2000ms)
 * @property {number} MAX_SYNC_RETRIES - Maximum sync retry attempts before fallback (3)
 */
export const DICE_DEFAULTS = {
  /** Default number of sides when app starts */
  DEFAULT_SIDES: 6,
  /** Minimum allowed sides for custom dice */
  MIN_SIDES: 2,
  /** Maximum allowed sides for custom dice */
  MAX_SIDES: 1000,
  /** Hours until session expires */
  SESSION_EXPIRY_HOURS: 24,
  /** Polling interval when storage events fail (milliseconds) */
  SYNC_POLLING_INTERVAL_MS: 2000,
  /** Maximum sync retry attempts before fallback */
  MAX_SYNC_RETRIES: 3,
} as const;

/** Type representing the DICE_DEFAULTS constant */
export type DiceDefaultsType = typeof DICE_DEFAULTS;

/**
 * @interface DicePredefinedOptionsType
 * @description Available predefined dice options.
 *
 * @property {number[]} SIDES - Array of predefined dice side options [4, 6, 8, 10, 12, 20]
 */
export const DICE_PREDEFINED_OPTIONS = {
  SIDES: [4, 6, 8, 10, 12, 20],
} as const;

/** Type representing the DICE_PREDEFINED_OPTIONS constant */
export type DicePredefinedOptionsType = typeof DICE_PREDEFINED_OPTIONS;

/**
 * @interface DiceSelectionMethodType
 * @description Available selection methods for dice configuration.
 *
 * @property {string} PREDEFINED - Use predefined dice options ('predefined')
 * @property {string} CUSTOM - Use custom dice input ('custom')
 */
export const DICE_SELECTION_METHOD = {
  PREDEFINED: 'predefined',
  CUSTOM: 'custom',
} as const;

/** Type representing the DICE_SELECTION_METHOD constant */
export type DiceSelectionMethodType = typeof DICE_SELECTION_METHOD;

/** Union type of all valid selection methods */
export type DiceSelectionMethod =
  (typeof DICE_SELECTION_METHOD)[keyof typeof DICE_SELECTION_METHOD];

/**
 * @interface DiceStorageStatusType
 * @description Available storage status types.
 *
 * @property {string} LOCAL_STORAGE - Using localStorage ('localStorage')
 * @property {string} SESSION_STORAGE - Using sessionStorage fallback ('sessionStorage')
 * @property {string} UNAVAILABLE - No storage available ('unavailable')
 */
export const DICE_STORAGE_STATUS = {
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
  UNAVAILABLE: 'unavailable',
} as const;

/** Type representing the DICE_STORAGE_STATUS constant */
export type DiceStorageStatusType = typeof DICE_STORAGE_STATUS;

/** Union type of all valid storage status values */
export type DiceStorageStatus = (typeof DICE_STORAGE_STATUS)[keyof typeof DICE_STORAGE_STATUS];

/**
 * @interface DiceValidationStatusType
 * @description Available validation status types.
 *
 * @property {string} VALID - Input is valid ('valid')
 * @property {string} INVALID - Input is invalid ('invalid')
 * @property {string} PENDING - Validation pending ('pending')
 */
export const DICE_VALIDATION_STATUS = {
  VALID: 'valid',
  INVALID: 'invalid',
  PENDING: 'pending',
} as const;

/** Type representing the DICE_VALIDATION_STATUS constant */
export type DiceValidationStatusType = typeof DICE_VALIDATION_STATUS;

/** Union type of all valid validation status values */
export type DiceValidationStatus =
  (typeof DICE_VALIDATION_STATUS)[keyof typeof DICE_VALIDATION_STATUS];
