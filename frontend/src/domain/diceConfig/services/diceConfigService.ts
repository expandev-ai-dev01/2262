/**
 * @service DiceConfigService
 * @domain diceConfig
 * @type REST
 *
 * @summary
 * Service for Dice Configuration API operations.
 * Handles all dice configuration CRUD operations and validation.
 */

import { authenticatedClient } from '@/core/lib/api';
import type { DiceConfig, ValidationResult } from '../types/models';
import type { DiceConfigFormOutput } from '../types/forms';

export const diceConfigService = {
  /**
   * Get current dice configuration
   */
  async get(): Promise<DiceConfig> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: DiceConfig }>(
      '/dice-config'
    );
    return data.data;
  },

  /**
   * Set dice configuration
   */
  async set(config: DiceConfigFormOutput): Promise<DiceConfig> {
    const { data } = await authenticatedClient.post<{ success: boolean; data: DiceConfig }>(
      '/dice-config',
      config
    );
    return data.data;
  },

  /**
   * Validate custom dice sides input
   */
  async validateCustom(customSides: number | string): Promise<ValidationResult> {
    const { data } = await authenticatedClient.post<{ success: boolean; data: ValidationResult }>(
      '/dice-config/validate-custom',
      { customSides }
    );
    return data.data;
  },

  /**
   * Get predefined dice options
   */
  async getPredefinedOptions(): Promise<number[]> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: number[] }>(
      '/dice-config/predefined-options'
    );
    return data.data;
  },
};
