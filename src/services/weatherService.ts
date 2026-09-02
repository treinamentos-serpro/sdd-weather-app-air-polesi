import { formatForecastDay } from '../lib/format';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;
const REQUEST_TIMEOUT_MS = 10_000;

export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.');
    }
    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
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

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar cidades. Tente novamente mais tarde.');
  }

  const data = (await response.json()) as GeocodingResponse;

  return (data.results ?? []).map(mapResultToCity);
}

interface ForecastCurrent {
  time: string;
  temperature_2m: number;
  weather_code: number;
  relative_humidity_2m?: number;
  wind_speed_10m?: number;
  surface_pressure?: number;
  precipitation?: number;
}

interface ForecastDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  precipitation_probability_max?: number[];
  precipitation_sum?: number[];
}

interface ForecastResponse {
  current?: ForecastCurrent;
  daily?: ForecastDaily;
}

function mapCurrentWeather(current: ForecastCurrent): CurrentWeather {
  return {
    temperatureC: current.temperature_2m,
    weatherCode: current.weather_code,
    weatherDescription: getWeatherCondition(current.weather_code).label,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    pressure: current.surface_pressure,
    precipitation: current.precipitation,
    observationTime: current.time,
  };
}

function mapForecastDays(daily: ForecastDaily): ForecastDay[] {
  return daily.time.slice(0, FORECAST_DAYS).map((date, index) => ({
    date,
    dayLabel: formatForecastDay(date),
    weatherCode: daily.weather_code[index],
    weatherDescription: getWeatherCondition(daily.weather_code[index]).label,
    minTemperatureC: daily.temperature_2m_min[index],
    maxTemperatureC: daily.temperature_2m_max[index],
    precipitationProbability: daily.precipitation_probability_max?.[index],
    precipitationSum: daily.precipitation_sum?.[index],
  }));
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    timezone: city.timezone,
    current:
      'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,surface_pressure,precipitation',
    daily:
      'weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,precipitation_sum',
    forecast_days: String(FORECAST_DAYS),
  });

  const url = `${FORECAST_URL}?${params.toString()}`;

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Falha ao buscar a previsão. Tente novamente mais tarde.');
  }

  const data = (await response.json()) as ForecastResponse;

  if (!data.current || !data.daily) {
    throw new WeatherServiceError('Resposta incompleta do serviço de previsão.');
  }

  return {
    city,
    current: mapCurrentWeather(data.current),
    forecast: mapForecastDays(data.daily),
  };
}
