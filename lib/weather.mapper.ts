import { WeatherApiResponse, WeatherUIModel } from './weather.types';

export function mapWeatherApiToUI(raw: WeatherApiResponse): WeatherUIModel {
    return {
        location: raw.name || 'Bujumbura',
        country: raw.sys?.country || 'Burundi',
        temperature: Math.round(raw.main?.temp ?? 0),
        condition: raw.weather?.[0]?.main || 'Gicunsi',
        humidity: `${raw.main?.humidity ?? 0}%`,
        windSpeed: `${raw.wind?.speed ?? 0} km/h`,
    };
}
