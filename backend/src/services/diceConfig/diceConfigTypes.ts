/**
 * @summary
 * Type definitions for Dice Configuration entity.
 *
 * @module services/diceConfig/diceConfigTypes
 */

import { DiceSelectionMethod, DiceStorageStatus, DiceValidationStatus } from '@/constants';

/**
 * @interface DiceConfigEntity
 * @description Represents a dice configuration entity
 */
export interface DiceConfigEntity {
  diceSides: number;
  selectionMethod: DiceSelectionMethod;
  probabilityRange: {
    min: number;
    max: number;
  };
  individualProbability: number;
  displayFormat: string;
  sessionTimestamp: string;
  storageFallbackStatus: DiceStorageStatus;
  instanceSyncKey: string;
}

/**
 * @interface DiceConfigSetRequest
 * @description Request payload for setting dice configuration
 */
export interface DiceConfigSetRequest {
  diceSides: number;
  selectionMethod: DiceSelectionMethod;
}

/**
 * @interface DiceConfigValidationResult
 * @description Result of dice configuration validation
 */
export interface DiceConfigValidationResult {
  isValid: boolean;
  status: DiceValidationStatus;
  errorMessage?: string;
  errorPriority?: number;
}

/**
 * @interface DiceConfigResponse
 * @description Response structure for dice configuration
 */
export interface DiceConfigResponse {
  diceSides: number;
  selectionMethod: DiceSelectionMethod;
  probabilityRange: {
    min: number;
    max: number;
  };
  individualProbability: number;
  displayFormat: string;
}
