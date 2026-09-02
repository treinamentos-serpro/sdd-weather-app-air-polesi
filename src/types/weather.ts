export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  admin2?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  label: string;
}

export interface CurrentWeather {
  temperatureC: number;
  weatherCode: number;
  weatherDescription: string;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  precipitation?: number;
  observationTime: string;
}

export interface ForecastDay {
  date: string;
  dayLabel: string;
  weatherCode: number;
  weatherDescription: string;
  minTemperatureC: number;
  maxTemperatureC: number;
  precipitationProbability?: number;
  precipitationSum?: number;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
}
