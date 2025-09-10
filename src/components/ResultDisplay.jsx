import React from 'react';

export const ResultDisplay = ({ result }) => {
    const subTitle = result.finalLocation + ` (` + result.preferredTimeBlock + `)`;
    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-fade-in shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    Top 3 Running Times for
                </h2>
                <h2 className="text-2xl font-bold text-blue-600 mb-2 tracking-tight">
                    {subTitle}
                </h2>
            </div>

            {result.advice && (
                <p className="text-center text-gray-600 mb-6 font-semibold">{result.advice}</p>
            )}

            {result.details.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                    {result.details.map((dayData, index) => (
                        <div key={index}>
                            {dayData.dayTitle && (
                                <h3 className="text-lg font-bold text-gray-700 mt-4 mb-2">{dayData.dayTitle}</h3>
                            )}
                            {dayData.times.map((timeData, timeIndex) => (
                                <div key={timeIndex} className="p-4 bg-white rounded-xl shadow-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:scale-105 my-1">
                                    <div className="absolute top-2 left-2 flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold text-lg">
                                        #{timeIndex + 1}
                                    </div>
                                    <div className="text-lg font-bold text-blue-500 mb-2">{timeData.time}</div>
                                    <div className="flex items-center text-gray-700">
                                        {/* Thermometer Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-red-500 mr-2"
                                            viewBox="0 0 17 17"
                                            fill="currentColor"
                                            stroke="currentColor"
                                            strokeWidth="0.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                            <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z"/>
                                        </svg>
                                        <span className="font-semibold"> Temp | Feels Like: {timeData.temperature}°F | {timeData.apparentTemperature}°F</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 mt-2">
                                        {/* Humidity Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-5 w-5 text-blue-500 mr-2" 
                                            viewBox="-1 0 18 18" 
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                        >
                                            <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267"/>
                                        </svg>
                                        <span className="font-semibold">Humidity | Dew Point: {timeData.humidity}% | {timeData.dewPoint}°F</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 mt-2">
                                        {/* Rain Icon */}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-5 w-5 text-blue-500 mr-2" 
                                            viewBox="-1 0 18 18" 
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973"/>                                        
                                        </svg>
                                        <span className="font-semibold">{timeData.precipitation}% chance of rain + {timeData.rainAmount}″ of rain</span>
                                    </div>
                                    <div className="flex items-center text-gray-700 mt-2">
                                        {/* Wind Icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-400 mr-2"
                                            viewBox="0 0 18 18"
                                            fill="currentColor"
                                            stroke="currentColor"
                                            strokeWidth="0.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                        <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5"/>
                                        </svg>
                                        <span className="font-semibold">Wind | Wind Gusts: {timeData.windSpeed} mph | {timeData.windGusts} mph </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 italic">No suitable running times found for your selection.</p>
            )}

            {result.specialAdvice && (
                <div className="mt-6 p-4 bg-yellow-100 rounded-xl border border-yellow-200 text-yellow-800 font-medium text-center">
                    <p>{result.specialAdvice}</p>
                </div>
            )}
        </div>
    );
};

export default ResultDisplay;
