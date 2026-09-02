import { type KeyboardEvent, useRef } from 'react';
import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const units: Array<{ label: string; value: Unit }> = [
  { label: '°C', value: 'celsius' },
  { label: '°F', value: 'fahrenheit' },
];

function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % units.length;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + units.length) % units.length;
    }

    if (event.key === 'Home') {
      nextIndex = 0;
    }

    if (event.key === 'End') {
      nextIndex = units.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    buttonRefs.current[nextIndex]?.focus();
    onChange(units[nextIndex].value);
  }

  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-md"
      role="group"
    >
      {units.map((option, index) => {
        const isActive = option.value === unit;

        return (
          <button
            aria-label={`Usar ${option.label}`}
            aria-pressed={isActive}
            className={`min-h-11 min-w-12 rounded-md px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 ${
              isActive
                ? 'bg-accent-500 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default UnitToggle;
