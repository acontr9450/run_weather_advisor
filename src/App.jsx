import React, { useState } from 'react';

import InputForm from './components/InputForm/InputForm'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import ResultDisplay from './components/ResultDisplay/ResultDisplay';
import CustomModal from './components/CustomModal/CustomModal';

const App = () => {
    // State variables for managing user input, UI elements, and API results.
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null); // Stores the advice and weather details
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
        setResult(null);
        
        try {
            // Simulate an API call to a weather service.
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock data for the weather forecast.
            const mockWeatherData = {
                location: location,
                time: time,
                forecast: {
                    temperature: 70, // Farenheit
                    condition: "Clear",
                    windSpeed: 6, // mi/h
                    precipitation: 0 // mm
                }
            };

            const { temperature, condition, windSpeed, precipitation } = mockWeatherData.forecast;

            let adviceTitle;
            let adviceText;
            let emoji;

            // Logic for giving running advice.
            if (temperature >= 60 && temperature <= 80 && precipitation === 0 && windSpeed < 10) {
                adviceTitle = "Perfect Running Weather!";
                adviceText = "The conditions are ideal for a run. Enjoy your workout!";
                emoji = "✅";
            } else if (temperature > 80 || temperature < 60) {
                adviceTitle = "Run with Caution";
                adviceText = "The temperature is a bit extreme. Be sure to dress appropriately and stay hydrated.";
                emoji = "⚠️";
            } else if (precipitation > 0) {
                adviceTitle = "Maybe a Treadmill Day";
                adviceText = "There's precipitation expected. Consider running indoors or dressing for the rain.";
                emoji = "🌧️";
            } else if (windSpeed >= 10) {
                adviceTitle = "Watch Out for Wind";
                adviceText = "It's a bit windy out there. Be aware of the wind resistance and potential gusts.";
                emoji = "🌬️";
            } else {
                adviceTitle = "Good to Go!";
                adviceText = "The weather looks favorable for your run. Have fun!";
                emoji = "👍";
            }

            // Set the result state with the calculated advice.
            setResult({
                title: `${emoji} ${adviceTitle}`,
                advice: adviceText,
                details: `
                    **Details for ${location} at ${time}:**<br>
                    Temperature: ${temperature}°C<br>
                    Condition: ${condition}<br>
                    Wind Speed: ${windSpeed} km/h<br>
                    Precipitation: ${precipitation} mm
                `
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showMessage("Error", "Failed to get weather data. Please try again later.");
        } finally {
            setIsLoading(false); // Hide the loading indicator
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">🏃‍♂️ Running Weather Advisor</h1>
                <p className="text-center text-gray-600 mb-8">Tell me where you are and when you'd like to run, and I'll tell you if the weather is good!</p>
                
                {/* Input Form component */}
                <InputForm
                    location={location}
                    setLocation={setLocation}
                    time={time}
                    setTime={setTime}
                    isLoading={isLoading}
                    getRunningAdvice={getRunningAdvice}
                />

                {/* Loading Spinner component */}
                {isLoading && <LoadingSpinner />}

                {/* Result Display component */}
                {result && <ResultDisplay result={result} />}
            </div>

            {/* Custom Modal component */}
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