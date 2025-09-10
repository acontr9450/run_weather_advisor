import React from 'react';

const timeOptions = [
    { label: 'Morning (5am-12pm)', value: 'morning' },
    { label: 'Afternoon (12pm-5pm)', value: 'afternoon' },
    { label: 'Evening (5pm-9pm)', value: 'evening' },
    { label: 'Night (9pm-4am)', value: 'night' },
];

export const InputForm = ({ location, setLocation, time, setTime, forecastDuration, setForecastDuration, isLoading, getRunningAdvice }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location (City, State/Country):</label>
            <input
                type="text"
                id="location"
                placeholder="e.g., Tyler, Texas"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
        </div>
        <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Preferred Run Time:</label>
            <div className="flex flex-wrap gap-2">
                {timeOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setTime(option.value)}
                        className={`
                            px-4 py-2 rounded-xl border-2 font-medium transition-colors duration-200
                            ${time === option.value
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }
                        `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
        <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Forecast Duration:</label>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setForecastDuration(1)}
                    className={`
                        px-4 py-2 rounded-xl border-2 font-medium transition-colors duration-200
                        ${forecastDuration === 1
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }
                    `}
                >
                    Today & Tomorrow
                </button>
                <button
                    onClick={() => setForecastDuration(3)}
                    className={`
                        px-4 py-2 rounded-xl border-2 font-medium transition-colors duration-200
                        ${forecastDuration === 3
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }
                    `}
                >
                    Next 3 Days
                </button>
            </div>
        </div>

        <button
            onClick={getRunningAdvice}
            disabled={isLoading}
            className={`w-full font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 ${
                isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:scale-105'
            }`}
        >
            {isLoading ? 'Getting Advice...' : 'Get My Running Advice'}
        </button>
    </div>
);

export default InputForm;