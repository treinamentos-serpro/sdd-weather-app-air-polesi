import { formatForecastDay } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

function ForecastCard({ day, unit }: ForecastCardProps) {
  const condition = getWeatherCondition(day.weatherCode, day.weatherDescription);
  const precipitation =
    day.precipitationProbability === undefined
      ? 'Não informada'
      : `${Math.round(day.precipitationProbability)}%`;

  return (
    <article className="flex min-h-48 flex-col rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition hover:border-accent-400/50 hover:bg-white/10">
      <p className="text-sm font-semibold capitalize text-white" title={day.date}>
        {day.dayLabel || formatForecastDay(day.date)}
      </p>
      <div className="mt-5 flex flex-1 flex-col items-center text-center">
        <span aria-hidden="true" className="text-4xl leading-none">
          {condition.icon}
        </span>
        <p className="mt-3 min-h-10 text-sm text-white/70">{condition.label}</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="font-semibold text-white">
            {formatTemperature(day.maxTemperatureC, unit)}
          </span>
          <span aria-hidden="true" className="text-white/40">
            /
          </span>
          <span className="text-white/60">{formatTemperature(day.minTemperatureC, unit)}</span>
        </div>
      </div>
      <p className="mt-4 border-t border-white/10 pt-3 text-center text-xs text-white/60">
        Chuva: <span className="font-semibold text-accent-400">{precipitation}</span>
      </p>
    </article>
  );
}

export default ForecastCard;
