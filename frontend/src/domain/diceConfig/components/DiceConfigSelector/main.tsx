/**
 * @summary
 * Main dice configuration selector component.
 * Allows users to select predefined dice or enter custom values.
 *
 * @module domain/diceConfig/components/DiceConfigSelector
 */

import { useState, useEffect } from 'react';
import { cn } from '@/core/lib/utils';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/tabs';
import { useDiceConfig } from '../../hooks/useDiceConfig';
import type { DiceConfigSelectorProps } from './types';
import { toast } from 'sonner';
import { Dices } from 'lucide-react';

function DiceConfigSelector({ className, onConfigChange }: DiceConfigSelectorProps) {
  const { config, isLoading, updateConfig, validateCustom, predefinedOptions } = useDiceConfig();

  const [selectedTab, setSelectedTab] = useState<'predefined' | 'custom'>('predefined');
  const [selectedPredefined, setSelectedPredefined] = useState<number>(6);
  const [customValue, setCustomValue] = useState<string>('');
  const [customError, setCustomError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  // Initialize from config
  useEffect(() => {
    if (config) {
      setSelectedTab(config.selectionMethod);
      if (config.selectionMethod === 'predefined') {
        setSelectedPredefined(config.diceSides);
      } else {
        setCustomValue(config.diceSides.toString());
      }
    }
  }, [config]);

  const handlePredefinedSelect = async (sides: number) => {
    setSelectedPredefined(sides);
    try {
      await updateConfig({
        diceSides: sides,
        selectionMethod: 'predefined',
      });
      onConfigChange?.(sides, 'predefined');
      toast.success(`Dado de ${sides} lados selecionado`);
    } catch (error) {
      toast.error('Erro ao atualizar configuração');
    }
  };

  const handleCustomInputChange = async (value: string) => {
    setCustomValue(value);
    setCustomError('');

    // Filter non-numeric characters
    const filtered = value.replace(/[^0-9]/g, '');
    if (filtered !== value) {
      setCustomValue(filtered);
      return;
    }

    if (!filtered) {
      setCustomError('Por favor, insira a quantidade de lados');
      return;
    }

    // Real-time validation
    setIsValidating(true);
    try {
      const result = await validateCustom(filtered);
      if (!result.isValid && result.errorMessage) {
        setCustomError(result.errorMessage);
      }
    } catch (error) {
      setCustomError('Erro ao validar entrada');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCustomSubmit = async () => {
    if (!customValue || customError || isValidating) return;

    const sides = parseInt(customValue, 10);

    try {
      await updateConfig({
        diceSides: sides,
        selectionMethod: 'custom',
      });
      onConfigChange?.(sides, 'custom');
      toast.success(`Dado personalizado de ${sides} lados configurado`);
    } catch (error) {
      toast.error('Erro ao configurar dado personalizado');
    }
  };

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Carregando configuração...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full shadow-lg', className)}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Dices className="size-5" />
          Configurar Dado
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value as 'predefined' | 'custom')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predefined">Dados Padrão</TabsTrigger>
            <TabsTrigger value="custom">Personalizado</TabsTrigger>
          </TabsList>

          <TabsContent value="predefined" className="space-y-4">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {predefinedOptions.map((sides) => (
                <Button
                  key={sides}
                  variant={selectedPredefined === sides ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handlePredefinedSelect(sides)}
                  className="h-16 text-lg font-semibold transition-all hover:scale-105"
                >
                  D{sides}
                </Button>
              ))}
            </div>
            {config && (
              <div className="bg-muted/50 rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">Configuração atual:</p>
                <p className="text-2xl font-bold">{config.displayFormat}</p>
                <p className="text-muted-foreground text-xs">
                  Probabilidade: {(config.individualProbability * 100).toFixed(2)}% por face
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-sides">Número de lados (2-1000)</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-sides"
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite o número de lados"
                  value={customValue}
                  onChange={(e) => handleCustomInputChange(e.target.value)}
                  aria-invalid={!!customError}
                  className="flex-1"
                />
                <Button
                  onClick={handleCustomSubmit}
                  disabled={!customValue || !!customError || isValidating}
                  className="min-w-24"
                >
                  {isValidating ? 'Validando...' : 'Aplicar'}
                </Button>
              </div>
              {customError && <p className="text-destructive text-sm font-medium">{customError}</p>}
            </div>
            {config && config.selectionMethod === 'custom' && (
              <div className="bg-muted/50 rounded-md p-4 text-center">
                <p className="text-muted-foreground text-sm">Configuração atual:</p>
                <p className="text-2xl font-bold">{config.displayFormat}</p>
                <p className="text-muted-foreground text-xs">
                  Probabilidade: {(config.individualProbability * 100).toFixed(4)}% por face
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export { DiceConfigSelector };
