/**
 * @summary
 * Type definitions for DiceConfigSelector component.
 *
 * @module domain/diceConfig/components/DiceConfigSelector/types
 */

export interface DiceConfigSelectorProps {
  className?: string;
  onConfigChange?: (diceSides: number, selectionMethod: 'predefined' | 'custom') => void;
}
