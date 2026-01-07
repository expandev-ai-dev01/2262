/**
 * @summary
 * Zustand store for Dice Configuration state management.
 * Handles session persistence with localStorage/sessionStorage fallback.
 *
 * @module domain/diceConfig/stores/diceConfigStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiceConfig, SessionConfig } from '../types/models';

interface DiceConfigStore {
  config: DiceConfig | null;
  sessionConfig: SessionConfig | null;
  storageType: 'localStorage' | 'sessionStorage' | 'unavailable';
  syncRetryCount: number;
  pollingActive: boolean;

  setConfig: (config: DiceConfig) => void;
  updateSessionConfig: (config: Partial<SessionConfig>) => void;
  setStorageType: (type: 'localStorage' | 'sessionStorage' | 'unavailable') => void;
  incrementSyncRetry: () => void;
  resetSyncRetry: () => void;
  setPollingActive: (active: boolean) => void;
  clearConfig: () => void;
}

const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const generateSyncKey = () => `dice-config-${Date.now()}-${Math.random()}`;

const isSessionExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > SESSION_EXPIRY_MS;
};

const getStorageType = (): 'localStorage' | 'sessionStorage' | 'unavailable' => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return 'localStorage';
  } catch {
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return 'sessionStorage';
    } catch {
      return 'unavailable';
    }
  }
};

export const useDiceConfigStore = create<DiceConfigStore>()(
  persist(
    (set, get) => ({
      config: null,
      sessionConfig: null,
      storageType: getStorageType(),
      syncRetryCount: 0,
      pollingActive: false,

      setConfig: (config) => {
        const timestamp = Date.now();
        const syncKey = generateSyncKey();

        set({
          config,
          sessionConfig: {
            diceSides: config.diceSides,
            selectionMethod: config.selectionMethod,
            timestamp,
            storageType: get().storageType,
            syncKey,
          },
        });
      },

      updateSessionConfig: (updates) => {
        const current = get().sessionConfig;
        if (!current) return;

        set({
          sessionConfig: {
            ...current,
            ...updates,
            timestamp: Date.now(),
          },
        });
      },

      setStorageType: (type) => set({ storageType: type }),

      incrementSyncRetry: () => {
        const count = get().syncRetryCount + 1;
        set({ syncRetryCount: count });

        if (count >= 3) {
          set({ pollingActive: true });
        }
      },

      resetSyncRetry: () => set({ syncRetryCount: 0, pollingActive: false }),

      setPollingActive: (active) => set({ pollingActive: active }),

      clearConfig: () =>
        set({
          config: null,
          sessionConfig: null,
          syncRetryCount: 0,
          pollingActive: false,
        }),
    }),
    {
      name: 'dice-config-store',
      partialize: (state) => ({
        config: state.config,
        sessionConfig: state.sessionConfig,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.sessionConfig) return;

        // Check session expiry
        if (isSessionExpired(state.sessionConfig.timestamp)) {
          state.clearConfig();
          return;
        }

        // Verify storage type consistency
        const actualStorageType = getStorageType();
        if (state.sessionConfig.storageType !== actualStorageType) {
          state.setStorageType(actualStorageType);
          state.updateSessionConfig({ storageType: actualStorageType });
        }
      },
    }
  )
);

// Storage event listener for cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'dice-config-store') {
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        const store = useDiceConfigStore.getState();

        if (newValue?.state?.sessionConfig) {
          const newTimestamp = newValue.state.sessionConfig.timestamp;
          const currentTimestamp = store.sessionConfig?.timestamp || 0;

          // Apply change if newer
          if (newTimestamp > currentTimestamp) {
            store.setConfig(newValue.state.config);
            store.resetSyncRetry();
          }
        }
      } catch (error) {
        console.error('Storage sync error:', error);
        useDiceConfigStore.getState().incrementSyncRetry();
      }
    }
  });

  // Polling fallback for sync failures
  let pollingInterval: NodeJS.Timeout | null = null;

  useDiceConfigStore.subscribe((state) => {
    if (state.pollingActive && !pollingInterval) {
      pollingInterval = setInterval(() => {
        try {
          const storageType = state.storageType;
          if (storageType === 'unavailable') return;

          const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
          const stored = storage.getItem('dice-config-store');

          if (stored) {
            const parsed = JSON.parse(stored);
            const newTimestamp = parsed.state?.sessionConfig?.timestamp || 0;
            const currentTimestamp = state.sessionConfig?.timestamp || 0;

            if (newTimestamp > currentTimestamp) {
              state.setConfig(parsed.state.config);
              state.resetSyncRetry();
            }
          }
        } catch (error) {
          console.error('Polling sync error:', error);
        }
      }, 2000);
    } else if (!state.pollingActive && pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  });
}
