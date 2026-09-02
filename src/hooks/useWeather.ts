import { useCallback, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

type LastOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City } | null;

function getErrorMessage(error: unknown): string {
  if (error instanceof WeatherServiceError) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const lastOperationRef = useRef<LastOperation>(null);

  const loadWeather = useCallback(async (city: City) => {
    setData(await getWeather(city));
    setStatus('success');
  }, []);

  const search = useCallback(
    async (name: string) => {
      lastOperationRef.current = { type: 'search', name };
      setQuery(name);
      setStatus('loading');
      setError(null);

      try {
        const results = await searchCities(name);
        setCities(results);

        if (results.length === 0) {
          setStatus('empty');
          return;
        }

        await loadWeather(results[0]);
      } catch (err) {
        setError(getErrorMessage(err));
        setStatus('error');
      }
    },
    [loadWeather],
  );

  const selectCity = useCallback(
    async (city: City) => {
      lastOperationRef.current = { type: 'selectCity', city };
      setStatus('loading');
      setError(null);

      try {
        await loadWeather(city);
      } catch (err) {
        setError(getErrorMessage(err));
        setStatus('error');
      }
    },
    [loadWeather],
  );

  const retry = useCallback(async () => {
    const lastOperation = lastOperationRef.current;

    if (!lastOperation) {
      return;
    }

    if (lastOperation.type === 'search') {
      await search(lastOperation.name);
    } else {
      await selectCity(lastOperation.city);
    }
  }, [search, selectCity]);

  return { status, data, cities, error, query, search, selectCity, retry };
}
