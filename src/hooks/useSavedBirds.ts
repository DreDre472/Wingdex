import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  addBirdObservation,
  addSavedBird,
  getBirdObservations,
  getSavedBirdIds,
  toggleSavedBird,
  type BirdObservation,
} from '../services/collection';
import type { IdentificationResult } from '../services/identification';

export function useSavedBirds() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [observations, setObservations] = useState<BirdObservation[]>([]);
  const [storageError, setStorageError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getSavedBirdIds(), getBirdObservations()])
        .then(([ids, savedObservations]) => {
          if (active) {
            setSavedIds(ids);
            setObservations(savedObservations);
            setStorageError(false);
          }
        })
        .catch(() => {
          if (active) setStorageError(true);
        });

      return () => {
        active = false;
      };
    }, [])
  );

  const toggle = async (id: string) => {
    try {
      setSavedIds(await toggleSavedBird(id));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };

  const add = async (id: string) => {
    try {
      setSavedIds(await addSavedBird(id));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };

  const addObservation = async (result: IdentificationResult, photoUri: string | null) => {
    try {
      const observation = await addBirdObservation(result, photoUri);
      setObservations((current) => [observation, ...current]);
      setStorageError(false);
      return observation;
    } catch (error) {
      setStorageError(true);
      throw error;
    }
  };

  return { savedIds, observations, storageError, toggle, add, addObservation };
}