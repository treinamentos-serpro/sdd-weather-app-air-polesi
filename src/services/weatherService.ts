import type { City } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

function buildLabel(result: GeocodingResult): string {
  return [result.name, result.admin1, result.country].filter(Boolean).join(', ');
}

function mapResultToCity(result: GeocodingResult): City {
  return {
    id: result.id,
    name: result.name,
    country: result.country,
    countryCode: result.country_code,
    admin1: result.admin1,
    admin2: result.admin2,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    label: buildLabel(result),
  };
}

export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmedName)}&count=5&language=pt&format=json`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherServiceError('Não foi possível buscar cidades. Verifique sua conexão.');
  }

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar cidades. Tente novamente mais tarde.');
  }

  const data = (await response.json()) as GeocodingResponse;

  return (data.results ?? []).map(mapResultToCity);
}
