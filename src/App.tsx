import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import type { Unit, WeatherData } from './types/weather';
import { mockWeatherData } from './types/weather.mock';

type Status = 'idle' | 'loading' | 'empty' | 'error' | 'success';

// Simulação local até o service da Open-Meteo existir: "vazio" e "erro" exercitam os estados.
const SIMULATED_DELAY_MS = 800;

function App() {
  const [status, setStatus] = useState<Status>('idle');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<Unit>('celsius');
  const lastQueryRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleSearch(city: string) {
    lastQueryRef.current = city;
    setStatus('loading');

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const normalized = city.toLocaleLowerCase('pt-BR');

      if (normalized.includes('vazio')) {
        setWeather(null);
        setStatus('empty');
        return;
      }

      if (normalized.includes('erro')) {
        setWeather(null);
        setStatus('error');
        return;
      }

      setWeather({
        ...mockWeatherData,
        city: { ...mockWeatherData.city, name: city, label: `${city}, Brasil` },
      });
      setStatus('success');
    }, SIMULATED_DELAY_MS);
  }

  function handleRetry() {
    if (lastQueryRef.current) {
      handleSearch(lastQueryRef.current);
    }
  }

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xl font-bold tracking-tight">
              <span aria-hidden="true">⛅ </span>SDD Weather
            </p>
            <UnitToggle onChange={setUnit} unit={unit} />
          </div>
          <SearchBar disabled={status === 'loading'} onSearch={handleSearch} />
        </header>

        <main className="flex flex-1 flex-col gap-6">
          {status === 'idle' && (
            <EmptyState
              hint="Digite o nome de uma cidade acima para ver o clima atual e a previsão."
              title="Comece buscando uma cidade"
            />
          )}
          {status === 'loading' && <LoadingState />}
          {status === 'empty' && <EmptyState />}
          {status === 'error' && <ErrorState onRetry={handleRetry} />}
          {status === 'success' && weather && (
            <>
              <CurrentWeather city={weather.city} current={weather.current} unit={unit} />
              <ForecastList forecast={weather.forecast} unit={unit} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
