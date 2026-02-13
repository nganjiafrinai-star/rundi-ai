export interface WeatherApiResponse {
    name: string;
    coord: {
        [key: string]: any;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    clouds: {
        all: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    dt: number;
}

export interface WeatherUIModel {
    location: string;
    country: string;
    temperature: number;
    condition: string;
    humidity: string;
    windSpeed: string;
}


