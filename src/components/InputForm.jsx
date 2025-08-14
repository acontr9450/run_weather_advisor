import React from 'react';

const InputForm = ({ location, setLocation, time, setTime, isLoading, getRunningAdvice }) => (
    <div className="space-y-6">
        <div>
            <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location (City, State/Country):</label>
            <input
                type="text"
                id="location"
                placeholder="e.g., New York, NY"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="time" className="block text-gray-700 text-sm font-semibold mb-2">Preferred Run Time:</label>
            <input
                type="time"
                id="time"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
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