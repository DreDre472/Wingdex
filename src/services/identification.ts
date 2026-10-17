import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import { birdRegions, type BirdRegion } from '../data/regions';

export type IdentificationResult = {
  commonName: string | null;
  scientificName: string | null;
  confidence: number;
  regions: BirdRegion[];
};

export const minimumConfidence = 0.68;

export function isIdentificationConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_WINGDEX_API_URL);
}

export async function identifyBird(
  uri: string,
  fileName: string | null,
  mimeType: string | null
): Promise<IdentificationResult> {
  const baseUrl = process.env.EXPO_PUBLIC_WINGDEX_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('Bird identification is not connected yet.');
  }

  const formData = new FormData();
  const photoFile = new File(uri);
  formData.append('photo', photoFile, fileName ?? photoFile.name);

  const response = await fetch(`${baseUrl}/identify`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Identification could not be completed. Try again later.');
  }

  const result: unknown = await response.json();
  const isBirdRegion = (region: unknown): region is BirdRegion =>
    typeof region === 'string' && birdRegions.some((knownRegion) => knownRegion === region);

  if (
    typeof result !== 'object' ||
    result === null ||
    !('commonName' in result) ||
    (typeof result.commonName !== 'string' && result.commonName !== null) ||
    !('scientificName' in result) ||
    (typeof result.scientificName !== 'string' && result.scientificName !== null) ||
    !('confidence' in result) ||
    typeof result.confidence !== 'number' ||
    !Number.isFinite(result.confidence) ||
    result.confidence < 0 ||
    result.confidence > 1 ||
    !('regions' in result) ||
    !Array.isArray(result.regions) ||
    !result.regions.every(isBirdRegion)
  ) {
    throw new Error('The identification service returned an invalid result.');
  }

  return {
    commonName: result.commonName,
    scientificName: result.scientificName,
    confidence: result.confidence,
    regions: result.regions,
  };
}