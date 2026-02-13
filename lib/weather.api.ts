import { WeatherApiResponse } from './weather.types';

export async function getWeather(city: string = 'Bujumbura'): Promise<WeatherApiResponse> {
    const response = await fetch(`http://192.168.1.21:8005/weather/${encodeURIComponent(city.toLowerCase())}`, {
        headers: {
            'accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Weather API failed: ${response.statusText}`);
    }

    return response.json();
}

