// Unit tests for the core API functions in weatherApi.jsx
import { vi, describe, expect, test } from 'vitest';
import { getCoordinatesForLocation, getWeatherForCoordinates } from '../../src/api/weatherApi.jsx';

// Mock the global 'fetch' function for isolated testing.
global.fetch = vi.fn();

describe('API Functions', () => {
    // A sample mock response for a successful geocoding API call.
    const mockGeoResponse = {
        results: [
            {
                latitude: 40.7128,
                longitude: -74.0060,
                admin1: 'New York',
                admin1_code: 'NY',
            },
        ],
    };

    // A sample mock response for a successful weather API call.
    const mockWeatherResponse = {
        hourly: {
            time: ['2023-10-27T00:00', '2023-10-27T01:00'],
            temperature_2m: [60, 59],
            apparent_temperature: [62, 61],
            precipitation_probability: [0, 5],
            precipitation: [0, 0.01],
            rain: [0, 0],
            wind_speed_10m: [5.2, 6.8],
        },
    };

    // Test for getCoordinatesForLocation function
    test('getCoordinatesForLocation fetches and returns correct coordinates', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockGeoResponse),
        });

        const result = await getCoordinatesForLocation('New York, NY');
        expect(result).toEqual({ latitude: 40.7128, longitude: -74.0060, region: "New York" });
    });

    test('getCoordinatesForLocation returns error on fetch failure', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));
        const result = await getCoordinatesForLocation('London, UK');
        expect(result).toEqual({ error: expect.any(String) });
    });

    test('getCoordinatesForLocation returns error for not found location', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ results: [] }),
        });
        const result = await getCoordinatesForLocation('NonExistentCity');
        expect(result).toEqual({ error: expect.any(String) });
    });

    // Test for getWeatherForCoordinates function
    test('getWeatherForCoordinates fetches and returns weather data', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockWeatherResponse),
        });

        const result = await getWeatherForCoordinates(40.71, -74.00, 3);
        expect(result).toEqual(mockWeatherResponse);
    });

    test('getWeatherForCoordinates returns error on fetch failure', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));
        const result = await getWeatherForCoordinates(40.71, -74.00, 3);
        expect(result).toEqual({ error: expect.any(String) });
    });
});
