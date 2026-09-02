interface WeatherCondition {
  label: string;
  icon: string;
}

const defaultCondition: WeatherCondition = {
  label: 'Condição desconhecida',
  icon: '☁',
};

export const weatherCodes: Record<number, WeatherCondition> = {
  0: { label: 'Céu limpo', icon: '☀' },
  1: { label: 'Predominantemente limpo', icon: '🌤' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁' },
  45: { label: 'Neblina', icon: '🌫' },
  48: { label: 'Neblina congelante', icon: '🌫' },
  51: { label: 'Chuvisco leve', icon: '🌦' },
  53: { label: 'Chuvisco moderado', icon: '🌦' },
  55: { label: 'Chuvisco intenso', icon: '🌧' },
  61: { label: 'Chuva fraca', icon: '🌧' },
  63: { label: 'Chuva moderada', icon: '🌧' },
  65: { label: 'Chuva intensa', icon: '🌧' },
  71: { label: 'Neve fraca', icon: '🌨' },
  73: { label: 'Neve moderada', icon: '🌨' },
  75: { label: 'Neve intensa', icon: '❄' },
  80: { label: 'Pancadas de chuva', icon: '🌦' },
  81: { label: 'Pancadas de chuva moderadas', icon: '🌧' },
  82: { label: 'Pancadas de chuva intensas', icon: '⛈' },
  95: { label: 'Trovoada', icon: '⛈' },
  96: { label: 'Trovoada com granizo leve', icon: '⛈' },
  99: { label: 'Trovoada com granizo intenso', icon: '⛈' },
};

export function getWeatherCondition(code: number, fallback?: string): WeatherCondition {
  return (
    weatherCodes[code] ?? {
      label: fallback ?? defaultCondition.label,
      icon: defaultCondition.icon,
    }
  );
}
