import { formatTemperature } from '../lib/temperature';
import { getWeatherCondition } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-white/55">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const condition = getWeatherCondition(current.weatherCode, current.weatherDescription);
  const metrics: Array<MetricProps | null> = [
    current.humidity === undefined
      ? null
      : { label: 'Umidade', value: `${Math.round(current.humidity)}%` },
    current.windSpeed === undefined ? null : { label: 'Vento', value: `${current.windSpeed} km/h` },
    current.precipitation === undefined
      ? null
      : { label: 'Precipitação', value: `${current.precipitation} mm` },
    current.pressure === undefined ? null : { label: 'Pressão', value: `${current.pressure} hPa` },
  ];

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md sm:p-7"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent-400">Clima atual</p>
          <h1 className="mt-1 text-2xl font-semibold text-white" id="current-weather-title">
            {city.name}
          </h1>
          <p className="mt-1 text-sm text-white/60">{city.label}</p>
        </div>
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="text-5xl leading-none">
            {condition.icon}
          </span>
          <div>
            <p className="text-5xl font-bold tracking-tight text-white">
              {formatTemperature(current.temperatureC, unit)}
            </p>
            <p className="mt-1 text-sm text-white/70">{condition.label}</p>
          </div>
        </div>
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics
          .filter((metric): metric is MetricProps => metric !== null)
          .map((metric) => (
            <Metric key={metric.label} label={metric.label} value={metric.value} />
          ))}
      </dl>
    </section>
  );
}

export default CurrentWeather;
