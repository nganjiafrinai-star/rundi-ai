import { WeatherApiResponse } from './weather.types';

export async function getWeather(city: string = 'Bujumbura'): Promise<WeatherApiResponse> {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        headers: {
            'accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Weather API failed: ${response.statusText}`);
    }

    return response.json();
}

