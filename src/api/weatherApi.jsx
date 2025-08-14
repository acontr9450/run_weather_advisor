/**
 * Fetches the latitude and longitude for a given location using the Open-Meteo Geocoding API.
 * @param {string} location The name of the city or place.
 * @returns {Promise<object>} An object containing latitude and longitude or an error.
 */
export const getCoordinatesForLocation = async (location) => {
    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return { error: "Could not find a location with that name. Please try again." };
        }

        const { latitude, longitude } = geoData.results[0];
        return { latitude, longitude };
    } catch (error) {
        console.error('Geocoding API call failed:', error);
        return { error: "An unexpected error occurred during location lookup." };
    }
};

/**
 * Fetches the hourly weather forecast for a given set of coordinates.
 * @param {number} latitude The latitude of the location.
 * @param {number} longitude The longitude of the location.
 * @returns {Promise<object>} An object containing weather data or an error.
 */
export const getWeatherForCoordinates = async (latitude, longitude) => {
    try {
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,wind_speed_10m&timezone=auto`);
        const weatherData = await weatherResponse.json();
        return weatherData;
    } catch (error) {
        console.error('Weather API call failed:', error);
        return { error: "An unexpected error occurred while fetching weather data." };
    }
};

/**
 * Fetches the running advice by orchestrating the geocoding and weather APIs.
 * @param {string} location The location provided by the user.
 * @param {string} time The preferred run time provided by the user (e.g., "14:00").
 * @returns {Promise<object>} An object containing the running advice or an error.
 */
export const fetchRunningAdvice = async (location, time) => {
    // Step 1: Get coordinates
    const geoResult = await getCoordinatesForLocation(location);
    if (geoResult.error) {
        return geoResult;
    }
    const { latitude, longitude } = geoResult;

    // Step 2: Get weather data
    const weatherData = await getWeatherForCoordinates(latitude, longitude);
    if (weatherData.error) {
        return weatherData;
    }

    // Extract the hour from the user's input (e.g., "14:00" -> 14)
    const requestedHour = time.split(':')[0];
    const now = new Date();

    // Find the index in the hourly array that corresponds to the requested time.
    const timeIndex = weatherData.hourly.time.findIndex(hourlyTime => {
        const date = new Date(hourlyTime);
        // Check if it's the same day and the same hour as the requested time
        return date.getDate() === now.getDate() && date.getHours() === parseInt(requestedHour);
    });

    if (timeIndex === -1) {
        return { error: "Could not find a forecast for the requested time today. The API provides hourly data for the next few days, but not all hours for today may be available depending on the time of the request." };
    }
    
    // Get the specific weather data for the requested time.
    const temperature = weatherData.hourly.temperature_2m[timeIndex];
    const precipitation = weatherData.hourly.precipitation_probability[timeIndex];
    const windSpeed = weatherData.hourly.wind_speed_10m[timeIndex];

    // Determine the weather condition based on precipitation probability
    const condition = precipitation > 50 ? "Rainy" : "Clear";

    let adviceTitle;
    let adviceText;
    let emoji;

    // Logic for giving running advice.
    if (temperature >= 10 && temperature <= 20 && precipitation <= 10 && windSpeed < 20) {
        adviceTitle = "Perfect Running Weather!";
        adviceText = "The conditions are ideal for a run. Enjoy your workout!";
        emoji = "✅";
    } else if (temperature > 20 || temperature < 10) {
        adviceTitle = "Run with Caution";
        adviceText = "The temperature is a bit extreme. Be sure to dress appropriately and stay hydrated.";
        emoji = "⚠️";
    } else if (precipitation > 10) {
        adviceTitle = "Maybe a Treadmill Day";
        adviceText = "There's a chance of rain. Consider running indoors or dressing for the rain.";
        emoji = "🌧️";
    } else if (windSpeed >= 20) {
        adviceTitle = "Watch Out for Wind";
        adviceText = "It's a bit windy out there. Be aware of the wind resistance and potential gusts.";
        emoji = "🌬️";
    } else {
        adviceTitle = "Good to Go!";
        adviceText = "The weather looks favorable for your run. Have fun!";
        emoji = "👍";
    }

    // Return the final advice object.
    return {
        title: `${emoji} ${adviceTitle}`,
        advice: adviceText,
        details: `
            **Details for ${location} at ${time}:**<br>
            Temperature: ${temperature}°C<br>
            Condition: ${condition}<br>
            Wind Speed: ${windSpeed} km/h<br>
            Precipitation Chance: ${precipitation}%
        `
    };
};
