/**
 * @summary
 * Hook for managing dice configuration.
 * Integrates API calls with local state management.
 *
 * @module domain/diceConfig/hooks/useDiceConfig
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diceConfigService } from '../../services/diceConfigService';
import { useDiceConfigStore } from '../../stores/diceConfigStore';
import type { DiceConfigFormOutput } from '../../types/forms';
import { useEffect } from 'react';

export const useDiceConfig = () => {
  const queryClient = useQueryClient();
  const { config, setConfig, clearConfig } = useDiceConfigStore();

  const queryKey = ['diceConfig'];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: diceConfigService.get,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutateAsync: updateConfig, isPending: isUpdating } = useMutation({
    mutationFn: (newConfig: DiceConfigFormOutput) => diceConfigService.set(newConfig),
    onSuccess: (updatedConfig) => {
      setConfig(updatedConfig);
      queryClient.setQueryData(queryKey, updatedConfig);
    },
  });

  const { mutateAsync: validateCustom } = useMutation({
    mutationFn: (customSides: number | string) => diceConfigService.validateCustom(customSides),
  });

  const { data: predefinedOptions } = useQuery({
    queryKey: ['diceConfig', 'predefinedOptions'],
    queryFn: diceConfigService.getPredefinedOptions,
    staleTime: Infinity, // Never refetch
  });

  // Sync API data with store on mount
  useEffect(() => {
    if (data && !config) {
      setConfig(data);
    }
  }, [data, config, setConfig]);

  return {
    config: config || data,
    isLoading,
    error,
    isUpdating,
    updateConfig,
    validateCustom,
    predefinedOptions: predefinedOptions || [4, 6, 8, 10, 12, 20],
    clearConfig,
  };
};
