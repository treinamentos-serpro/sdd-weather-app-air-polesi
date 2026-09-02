import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity || disabled) {
      return;
    }

    onSearch(trimmedCity);
  }

  return (
    <form
      aria-label="Buscar clima por cidade"
      className="flex min-w-0 flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-row sm:items-end"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium text-white" htmlFor="city-search">
          Buscar cidade
        </label>
        <input
          aria-describedby="city-search-hint"
          className="min-h-11 w-full rounded-lg border border-white/10 bg-night-800 px-3 py-2.5 text-white outline-none placeholder:text-white/60 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id="city-search"
          name="city"
          onChange={(event) => setCity(event.target.value)}
          placeholder="Ex.: São Paulo"
          type="search"
          value={city}
        />
        <span className="sr-only" id="city-search-hint">
          Informe o nome de uma cidade para consultar o clima.
        </span>
      </div>
      <button
        className="min-h-11 rounded-lg bg-accent-500 px-5 py-2.5 font-medium text-white transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60 sm:shrink-0"
        disabled={disabled}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;
