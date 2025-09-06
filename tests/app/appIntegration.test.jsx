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

    test('displays results after a successful API call', async () => {
        const mockResult = {
            title: 'Top 3 Running Times for Test City',
            advice: 'Here are the top three recommended times...',
            details: 'Details HTML...',
        };
        api.fetchRunningAdvice.mockResolvedValue(mockResult);

        render(<App />);
        fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test City' } });
        fireEvent.click(screen.getByText(/Morning/i));
        fireEvent.click(screen.getByText(/Get My Running Advice/i));

        await waitFor(() => {
            // Check if the result display is present with the correct title.
            expect(screen.getByText(mockResult.title)).toBeInTheDocument();
            expect(screen.getByText(mockResult.advice)).toBeInTheDocument();
        });
    });
});
