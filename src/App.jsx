import React, { useState } from 'react';

import InputForm from './components/InputForm'
import LoadingSpinner from './components/LoadingSpinner'
import ResultDisplay from './components/ResultDisplay';
import CustomModal from './components/CustomModal';
import { fetchRunningAdvice } from './api/weatherApi';

const App = () => {
    // State variables for managing user input, UI elements, and API results.
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [forecastDuration, setForecastDuration] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    // Function to show a custom message modal.
    const showMessage = (title, message) => {
        setModalContent({ title, message });
        setIsModalOpen(true);
    };

    // Function to hide the custom message modal.
    const hideMessage = () => {
        setIsModalOpen(false);
    };

    // Main function to handle the button click and get advice.
    const getRunningAdvice = async () => {
        if (!location || !time) {
            showMessage("Input Required", "Please enter both a location and a preferred run time.");
            return;
        }

        setIsLoading(true);
        setResult(null); // Clear previous results
        
        try {
            // Pass the new forecastDuration state to the API function
            const adviceData = await fetchRunningAdvice(location, time, forecastDuration);
            
            // Check for errors returned by the API function
            if (adviceData.error) {
                showMessage("Error", adviceData.error);
            } else {
                setResult(adviceData);
            }

        } catch (error) {
            console.error('Error fetching running advice:', error);
            showMessage("Error", "Failed to get weather data. Please check your network connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Running Weather Advisor 🏃‍♂️</h1>
                <p className="text-center text-gray-600 mb-8">Tell me where you are and when you'd like to run, and I'll tell you if the weather is good!</p>
                
                <InputForm
                    location={location}
                    setLocation={setLocation}
                    time={time}
                    setTime={setTime}
                    forecastDuration={forecastDuration}
                    setForecastDuration={setForecastDuration} 
                    isLoading={isLoading}
                    getRunningAdvice={getRunningAdvice}
                />

                {isLoading && <LoadingSpinner />}
                {result && <ResultDisplay result={result} />}
            </div>

            <CustomModal
                isOpen={isModalOpen}
                title={modalContent.title}
                message={modalContent.message}
                onClose={hideMessage}
            />
        </div>
    );
};

export default App;