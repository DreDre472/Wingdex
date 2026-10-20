import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import type { BirdRegion } from '../data/regions';
import type { IdentificationResult } from './identification';

const COLLECTION_KEY = 'wingdex.collection.v1';
const OBSERVATIONS_KEY = 'wingdex.observations.v1';

export type BirdObservation = IdentificationResult & {
  id: string;
  identifiedAt: string;
  photoUri: string | null;
};

export async function getSavedBirdIds(): Promise<string[]> {
  const stored = await AsyncStorage.getItem(COLLECTION_KEY);
  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export async function toggleSavedBird(id: string): Promise<string[]> {
  const current = await getSavedBirdIds();
  const next = current.includes(id)
    ? current.filter((savedId) => savedId !== id)
    : [...current, id];

  await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(next));
  return next;
}

export async function addSavedBird(id: string): Promise<string[]> {
  const current = await getSavedBirdIds();
  if (current.includes(id)) return current;

  const next = [...current, id];
  await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(next));
  return next;
}

export async function getBirdObservations(): Promise<BirdObservation[]> {
  const stored = await AsyncStorage.getItem(OBSERVATIONS_KEY);
  if (!stored) return [];

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter(isBirdObservation).map((observation) => ({ ...observation, description: observation.description ?? null }))
      : [];
  } catch {
    return [];
  }
}

export async function addBirdObservation(
  result: IdentificationResult,
  selectedPhotoUri: string | null
): Promise<BirdObservation> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const identified = Boolean(result.commonName && result.scientificName && result.confidence >= 0.68);
  let photoUri: string | null = null;

  if (identified && selectedPhotoUri) {
    const source = new File(selectedPhotoUri);
    const directory = new Directory(Paths.document, 'bird-observations');
    directory.create({ idempotent: true, intermediates: true });
    const extension = source.extension || '.jpg';
    const destination = new File(directory, `${id}${extension}`);
    await source.copy(destination);
    photoUri = destination.uri;
  }

  const observation: BirdObservation = {
    id,
    commonName: identified ? result.commonName : null,
    scientificName: identified ? result.scientificName : null,
    description: identified ? result.description : null,
    confidence: identified ? result.confidence : 0,
    regions: identified && result.regions.length > 0 ? result.regions : ['Unknown'],
    identifiedAt: new Date().toISOString(),
    photoUri,
  };
  const observations = await getBirdObservations();
  await AsyncStorage.setItem(OBSERVATIONS_KEY, JSON.stringify([observation, ...observations]));
  return observation;
}

function isBirdObservation(value: unknown): value is BirdObservation {
  if (typeof value !== 'object' || value === null) return false;
  if (!('id' in value) || typeof value.id !== 'string') return false;
  if (!('identifiedAt' in value) || typeof value.identifiedAt !== 'string') return false;
  if (!('confidence' in value) || typeof value.confidence !== 'number') return false;
  if (!('commonName' in value) || (typeof value.commonName !== 'string' && value.commonName !== null)) return false;
  if (!('scientificName' in value) || (typeof value.scientificName !== 'string' && value.scientificName !== null)) return false;
  if ('description' in value && typeof value.description !== 'string' && value.description !== null) return false;
  if (!('photoUri' in value) || (typeof value.photoUri !== 'string' && value.photoUri !== null)) return false;
  if (!('regions' in value) || !Array.isArray(value.regions)) return false;

  const regions: BirdRegion[] = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica', 'Unknown'];
  return value.regions.every((region) => typeof region === 'string' && regions.includes(region as BirdRegion));
}