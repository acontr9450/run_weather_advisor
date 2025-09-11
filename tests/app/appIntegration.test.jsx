// Integration tests for the main application components
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import App from '../../src/App';
import * as api from '../../src/api/weatherApi.jsx';

// Mock the entire api.js module
vi.mock('../../src/api/weatherApi.jsx', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        fetchRunningAdvice: vi.fn(),
    };
});

// A small mock for the ResizeObserver since it's not present in JSDOM
// This prevents an error when a component tries to use it.
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('App Integration', () => {
    // Mock data that the mocked API function will return
    const mockResult = {
        finalLocation: 'Test City',
        preferredTimeBlock: 'morning',
        advice: 'Here is some advice.',
        specialAdvice: 'This is special advice.',
        details: [
            {
                dayTitle: 'Today',
                times: [
                    {
                        time: '6:00 AM',
                        temperature: '60.0',
                        apparentTemperature: '58.0',
                        precipitation: '5',
                        rainAmount: '0.00',
                        windSpeed: '5.0',
                        humidity: '27',
                        dewPoint: '40.0',
                        windGusts: '6.7',
                    },
                ],
            },
        ],
    };

    beforeEach(() => {
        // Clear all mocks before each test to ensure a clean slate.
        vi.clearAllMocks();
    });

    test('renders the main components on initial load', () => {
        render(<App />);
        expect(screen.getByText(/Running Weather Advisor/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
        expect(screen.getByText(/Get My Running Advice/i)).toBeInTheDocument();
    });

    test('shows a modal if form is submitted with missing input', async () => {
        render(<App />);
        fireEvent.click(screen.getByText(/Get My Running Advice/i));

        // Use waitFor to wait for the modal to appear in the DOM
        await waitFor(() => {
            expect(screen.getByText(/Input Required/i)).toBeInTheDocument();
            expect(screen.getByText(/Please enter both a location and a preferred run time/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Close/i));
        await waitFor(() => {
            expect(screen.queryByText(/Input Required/i)).not.toBeInTheDocument();
        });
    });

    test('shows loading spinner when fetching data', async () => {
        // Mock the API call to return a promise that never resolves,
        // so we can test the loading state.
        api.fetchRunningAdvice.mockReturnValue(new Promise(() => {}));
        
        render(<App />);
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test City' } });
        fireEvent.click(screen.getByText(/Morning/i));
        fireEvent.click(screen.getByText(/Get My Running Advice/i));

        await waitFor(() => {
            expect(screen.getByText(/Checking the forecast.../i)).toBeInTheDocument();
            // The button should be disabled during loading.
            expect(screen.getByText(/Getting Advice.../i)).toBeInTheDocument();
        });
    });

    test('submitting the form displays the result with correct data', async () => {
        // Mock the API call to resolve with our mock data
        api.fetchRunningAdvice.mockResolvedValue(mockResult);

        render(<App />);

        // 1. Find and fill in the form inputs
        const locationInput = screen.getByLabelText(/Location/i);
        const timeButton = screen.getByText(/Morning/i);
        const submitButton = screen.getByRole('button', { name: /Get My Running Advice/i });

        fireEvent.change(locationInput, { target: { value: 'Test City' } });
        fireEvent.click(timeButton);
        fireEvent.click(submitButton);

        // 2. Assert that the loading spinner appears
        expect(screen.getByText('Checking the forecast...')).toBeInTheDocument();

        // 3. Wait for the API call to complete and the result to appear
        await waitFor(() => {
            expect(screen.queryByText('Checking the forecast...')).not.toBeInTheDocument();
        });

        // 4. Assert that the ResultDisplay component renders with the correct content
        expect(screen.getByText('Top 3 Running Times for')).toBeInTheDocument();
        expect(screen.getByText('Test City (morning)')).toBeInTheDocument();
        expect(screen.getByText('Here is some advice.')).toBeInTheDocument();
        expect(screen.getByText('This is special advice.')).toBeInTheDocument();
        
        // Assert that the cards and their contents are present
        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('6:00 AM')).toBeInTheDocument();
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('Temp | Feels Like: 60.0°F | 58.0°F')).toBeInTheDocument();
        expect(screen.getByText('5% chance of rain + 0.00″ of rain')).toBeInTheDocument();
        expect(screen.getByText('Wind | Wind Gusts: 5.0 mph | 6.7 mph')).toBeInTheDocument();
    });
});
