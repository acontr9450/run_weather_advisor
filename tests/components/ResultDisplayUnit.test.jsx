import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResultDisplay } from '../../src/components/ResultDisplay.jsx';

describe('ResultDisplay Component', () => {
    // Mock data that matches the new structure from weatherApi.jsx
    const mockResult = {
        finalLocation: 'San Francisco, CA',
        preferredTimeBlock: 'morning',
        advice: 'Here are the top three recommended times for your run.',
        specialAdvice: 'The top recommendation offers nearly perfect running conditions!',
        details: [
            {
                dayTitle: 'Today',
                times: [
                    {
                        time: '6:00 AM',
                        temperature: '50.0',
                        apparentTemperature: '49.0',
                        precipitation: '5',
                        rainAmount: '0.00',
                        windSpeed: '5.0',
                        humidity: '27',
                        dewPoint: '40.0',
                        windGusts: '6.7',
                    },
                    {
                        time: '7:00 AM',
                        temperature: '56.5',
                        apparentTemperature: '53.0',
                        precipitation: '6',
                        rainAmount: '0.01',
                        windSpeed: '6.0',
                        humidity: '29',
                        dewPoint: '43.0',
                        windGusts: '6.9',
                    },
                ],
            },
            {
                dayTitle: 'Tomorrow',
                times: [
                    {
                        time: '6:30 AM',
                        temperature: '59.5',
                        apparentTemperature: '57.0',
                        precipitation: '7',
                        rainAmount: '0.02',
                        windSpeed: '6.2',
                        humidity: '32',
                        dewPoint: '45.0',
                        windGusts: '7.4',
                    },
                ],
            },
        ],
    };

    test('renders the correct location and preferred time block', () => {
        render(<ResultDisplay result={mockResult} />);
        expect(screen.getByText('San Francisco, CA (morning)')).toBeInTheDocument();
    });

    test('renders the main advice and special advice', () => {
        render(<ResultDisplay result={mockResult} />);
        expect(screen.getByText('Here are the top three recommended times for your run.')).toBeInTheDocument();
        expect(screen.getByText('The top recommendation offers nearly perfect running conditions!')).toBeInTheDocument();
    });

    test('renders each day title', () => {
        render(<ResultDisplay result={mockResult} />);
        expect(screen.getByText('Today')).toBeInTheDocument();
        expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    });

    test('renders all time cards with correct details', () => {
        render(<ResultDisplay result={mockResult} />);

        // Check for the first card
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('6:00 AM')).toBeInTheDocument();
        expect(screen.getByText('Temp | Feels Like: 50.0°F | 49.0°F')).toBeInTheDocument();
        expect(screen.getByText('Humidity | Dew Point: 27% | 40.0°F')).toBeInTheDocument();
        expect(screen.getByText('5% chance of rain + 0.00″ of rain')).toBeInTheDocument();
        expect(screen.getByText('Wind | Wind Gusts: 5.0 mph | 6.7 mph')).toBeInTheDocument();

        // Check for the second card
        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('7:00 AM')).toBeInTheDocument();
        expect(screen.getByText('Temp | Feels Like: 56.5°F | 53.0°F')).toBeInTheDocument();
        expect(screen.getByText('Humidity | Dew Point: 29% | 43.0°F')).toBeInTheDocument();
        expect(screen.getByText('6% chance of rain + 0.01″ of rain')).toBeInTheDocument();
        expect(screen.getByText('Wind | Wind Gusts: 6.0 mph | 6.9 mph')).toBeInTheDocument();

        // Check for the third card
        expect(screen.getByText('#3')).toBeInTheDocument();
        expect(screen.getByText('6:30 AM')).toBeInTheDocument();
        expect(screen.getByText('Temp | Feels Like: 59.5°F | 57.0°F')).toBeInTheDocument();
        expect(screen.getByText('Humidity | Dew Point: 32% | 45.0°F')).toBeInTheDocument();
        expect(screen.getByText('7% chance of rain + 0.02″ of rain')).toBeInTheDocument();
        expect(screen.getByText('Wind | Wind Gusts: 6.2 mph | 7.4 mph')).toBeInTheDocument();
    });

    test('renders "No suitable times" when details array is empty', () => {
        const noResult = { ...mockResult, details: [] };
        render(<ResultDisplay result={noResult} />);
        expect(screen.getByText('No suitable running times found for your selection.')).toBeInTheDocument();
    });
});
