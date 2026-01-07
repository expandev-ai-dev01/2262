/**
 * @summary
 * Type definitions for useDiceConfig hook.
 *
 * @module domain/diceConfig/hooks/useDiceConfig/types
 */

import type { DiceConfig, ValidationResult } from '../../types/models';
import type { DiceConfigFormOutput } from '../../types/forms';

export interface UseDiceConfigReturn {
  config: DiceConfig | null | undefined;
  isLoading: boolean;
  error: Error | null;
  isUpdating: boolean;
  updateConfig: (config: DiceConfigFormOutput) => Promise<DiceConfig>;
  validateCustom: (customSides: number | string) => Promise<ValidationResult>;
  predefinedOptions: number[];
  clearConfig: () => void;
}
