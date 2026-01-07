/**
 * @summary
 * Type definitions for Dice Configuration domain.
 * Represents the dice configuration state and related types.
 *
 * @module domain/diceConfig/types/models
 */

export interface DiceConfig {
  diceSides: number;
  selectionMethod: 'predefined' | 'custom';
  probabilityRange: {
    min: number;
    max: number;
  };
  individualProbability: number;
  displayFormat: string;
}

export interface DiceConfigFilters {
  diceSides?: number;
  selectionMethod?: 'predefined' | 'custom';
}

export interface ValidationResult {
  isValid: boolean;
  status: 'valid' | 'invalid' | 'pending';
  errorMessage?: string;
  errorPriority?: 1 | 2;
}

export interface SessionConfig {
  diceSides: number;
  selectionMethod: 'predefined' | 'custom';
  timestamp: number;
  storageType: 'localStorage' | 'sessionStorage' | 'unavailable';
  syncKey: string;
}
