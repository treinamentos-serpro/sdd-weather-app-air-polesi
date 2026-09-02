import type { Unit } from '../types/weather';

export function convertTemperature(valueCelsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? (valueCelsius * 9) / 5 + 32 : valueCelsius;
}

export function formatTemperature(valueCelsius: number, unit: Unit): string {
  const value = convertTemperature(valueCelsius, unit);
  const roundedValue = Math.round(value);
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';

  return `${roundedValue}${symbol}`;
}
