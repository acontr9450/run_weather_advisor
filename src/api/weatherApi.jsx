const CACHE_DURATION_MS = 60 * 60 * 1000;

/**
 * Creates a unique key for the cache based on the location and forecast duration.
 * @param {string} location The user-provided location string.
 * @param {number} forecastDuration The number of days for the forecast.
 * @returns {string} The unique cache key.
 */
const getCacheKey = (location, forecastDuration) => {
    return `weather_cache_${location.toLowerCase().replace(/[^a-z0-9]/g, '')}_${forecastDuration}d`;
};

/**
 * Retrieves data from the cache if it is still valid.
 * @param {string} key The cache key to look up.
 * @returns {object|null} The cached data if valid, otherwise null.
 */
const getCachedData = (key) => {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) {
        return null;
    }

    const item = JSON.parse(cachedItem);
    const now = new Date().getTime();

    // Check if the cached data has expired.
    if (now - item.timestamp > CACHE_DURATION_MS) {
        console.log(`Cache expired for key: ${key}`);
        localStorage.removeItem(key); // Remove expired item
        return null;
    }

    console.log(`Using cached data for key: ${key}`);
    return item.data;
};

/**
 * Saves data to the cache with a timestamp.
 * @param {string} key The cache key.
 * @param {object} data The data to be cached.
 */
const setCachedData = (key, data) => {
    const now = new Date().getTime();
    const item = {
        data: data,
        timestamp: now,
    };
    try {
        localStorage.setItem(key, JSON.stringify(item));
        console.log(`Data cached successfully for key: ${key}`);
    } catch (e) {
        console.error("Failed to save to localStorage:", e);
    }
};

/**
 * Fetches the latitude and longitude for a given location using the Open-Meteo Geocoding API.
 * This function now handles multi-part location inputs (e.g., "Tyler, Texas") to improve accuracy.
 * @param {string} location The name of the city or place, optionally including a state/region.
 * @returns {Promise<object>} An object containing latitude and longitude or an error.
 */
export const getCoordinatesForLocation = async (location) => {
    try {
        // Split the input string to separate the city and state/region.
        const parts = location.split(',').map(part => part.trim());
        const city = parts[0];
        const stateOrRegion = parts.length > 1 ? parts[1].toUpperCase() : null;

        // Fetch geocoding data using the city name.
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return { error: "Could not find a location with that name. Please try again." };
        }

        let bestMatch = null;

        // If a state/region was provided, try to find a matching result.
        if (stateOrRegion) {
            bestMatch = geoData.results.find(result => {
                // Check if the admin1 code matches the provided state/region.
                return result.admin1?.toUpperCase() === stateOrRegion;
            });
        }

        // Fallback to the first result if no state/region was provided or no match was found.
        const finalLocation = bestMatch || geoData.results[0];
        const region = finalLocation.admin1

        if (!finalLocation) {
            return { error: "Could not find a location with that name. Please try again." };
        }

        const { latitude, longitude } = finalLocation;
        return { latitude, longitude, region };
    } catch (error) {
        console.error('Geocoding API call failed:', error);
        return { error: "An unexpected error occurred during location lookup." };
    }
};

/**
 * Fetches the hourly weather forecast for a given set of coordinates.
 * @param {number} latitude The latitude of the location.
 * @param {number} longitude The longitude of the location.
 * @param {number} foreCastDays The number of days to forecast
 * @returns {Promise<object>} An object containing weather data or an error.
 */
export const getWeatherForCoordinates = async (latitude, longitude, forecastDays) => {
    try {
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=${forecastDays}`);
        const weatherData = await weatherResponse.json();
        return weatherData;
    } catch (error) {
        console.error('Weather API call failed:', error);
        return { error: "An unexpected error occurred while fetching weather data." };
    }
};

/**
 * Fetches the running advice by orchestrating the geocoding and weather APIs,
 * and now ranks the top 3 times based on "apparent_temperature". 
 * @param {string} location The location provided by the user.
 * @param {string} time The preferred run time provided by the user (e.g., "morning", "afternoon").
 * @param {number} foreCastDuration The number of days to forecast (1 or 3)
 * @returns {Promise<object>} An object containing the running advice or an error.
 */
export const fetchRunningAdvice = async (location, preferredTimeBlock, forecastDuration) => {

    // Step 1: Check the cache first to see if we have valid, recent data.
    const cacheKey = getCacheKey(location, forecastDuration);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        console.log("Using cached data instead of new API call.");
        // If cached data is available, process it directly.
        return processWeatherData(cachedData, preferredTimeBlock, forecastDuration);
    }

    // Step 2: Get coordinates if not in cache
    const geoResult = await getCoordinatesForLocation(location);
    if (geoResult.error) {
        return geoResult;
    }
    const { latitude, longitude, region } = geoResult;
    const containsComma = location.includes(",");
    let finalLocation = location;
    if (!containsComma) {
        finalLocation += ", " + region;
    }

    // Step 3: Get weather data for the next 3 days to cover all time blocks.
    const weatherData = await getWeatherForCoordinates(latitude, longitude, 3);
    if (weatherData.error) {
        return weatherData;
    }

    if (!weatherData.hourly || !weatherData.hourly.time) {
        return { error: "Failed to get weather forecast. The weather API returned an unexpected or incomplete response." };
    }

    // Step 4: Cache the weather data
    setCachedData(cacheKey, weatherData);

    // Step 5: Process the weather data and return the result
    return processWeatherData(weatherData, preferredTimeBlock, forecastDuration, finalLocation);
};

/**
 * A new function to handle all the data processing logic, allowing it to be called from both
 * the cached data and the new API response.
 * @param {object} weatherData The raw weather data object.
 * @param {string} preferredTimeBlock The preferred run time block string.
 * @param {number} forecastDuration The number of days to forecast.
 * @returns {object} The formatted running advice result.
 */
const processWeatherData = (weatherData, preferredTimeBlock, forecastDuration, location) => {
    const timeToHourRange = {
        'morning': { start: 5, end: 12 },
        'afternoon': { start: 12, end: 17 },
        'evening': { start: 17, end: 21 },
        'night': { start: 21, end: 4 }, // Note: This range wraps around midnight
    };

    // Refine date filtering logic
    const now = new Date();
    let startDate, endDate;

    if (forecastDuration === 1) {
        startDate = now;
        endDate = new Date(now);
        endDate.setDate(now.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);
    } else if (forecastDuration === 3) {
        startDate = new Date(now);
        startDate.setDate(now.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(now);
        endDate.setDate(now.getDate() + 3);
        endDate.setHours(23, 59, 59, 999);
    }

    const filteredWeather = weatherData.hourly.time
        .map((time, index) => {
            const date = new Date(time);
            const inTimeRange = (date >= startDate && date <= endDate);
            const timeRange = timeToHourRange[preferredTimeBlock];
            if (!timeRange) {
                return null;
            }

            let inTimeBlock = false;
            const { start, end } = timeRange;
            if (start > end) {
                inTimeBlock = date.getHours() >= start || date.getHours() < end;
            } else {
                inTimeBlock = date.getHours() >= start && date.getHours() < end;
            }

            if (inTimeRange && inTimeBlock) {
                const apparentTemp = weatherData.hourly.apparent_temperature[index];
                const tempF = weatherData.hourly.temperature_2m[index];
                const windMph = weatherData.hourly.wind_speed_10m[index];
                const rainIn = weatherData.hourly.rain[index];
                const precipitationChance = weatherData.hourly.precipitation_probability[index];

                return {
                    time: date,
                    temperature: tempF,
                    apparentTemperature: apparentTemp,
                    precipitation: precipitationChance,
                    rainAmount: rainIn,
                    windSpeed: windMph,
                };
            }
            return null;
        })
        .filter(item => item !== null);

    if (filteredWeather.length === 0) {
        return { error: "No forecast data found for the selected time block and duration." };
    }

    // Rank the top 3 times
    filteredWeather.sort((a, b) => {
        const aTempDiff = Math.abs(a.apparentTemperature - 59);
        const bTempDiff = Math.abs(b.apparentTemperature - 59);
        if (aTempDiff !== bTempDiff) {
            return aTempDiff - bTempDiff;
        }

        if (a.rainAmount !== b.rainAmount) {
            return a.rainAmount - b.rainAmount;
        }
        if (a.precipitation !== b.precipitation) {
            return a.precipitation - b.precipitation;
        }

        return a.windSpeed - b.windSpeed;
    });

    const top3Times = filteredWeather.slice(0, 3);

    // Format the final output
    const title = `Top 3 Running Times for ${location} (${preferredTimeBlock})`;
    const advice = "Here are the top three recommended times for your run based on the weather forecast:";

    let details = top3Times.map((item, index) => {
        const timeString = item.time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        const dateString = item.time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
        return `
            **#${index + 1} Best Time: ${dateString} at ${timeString}**
            * **Apparent Temperature:** ${item.apparentTemperature.toFixed(1)}°F
            * **Temperature:** ${item.temperature.toFixed(1)}°F
            * **Precipitation Chance:** ${item.precipitation}%
            * **Rain Amount:** ${item.rainAmount.toFixed(2)} inches
            * **Wind Speed:** ${item.windSpeed.toFixed(1)} mph
        `;
    }).join('<br><br>');

    const bestResult = top3Times[0];
    if (bestResult.apparentTemperature >= 50 && bestResult.apparentTemperature <= 68 && bestResult.precipitation <= 10 && bestResult.windSpeed < 12) {
        details += `<br><br>The top recommendation offers nearly perfect running conditions!`;
    } else {
        details += `<br><br>Check the details for each time to choose the best option for your comfort level.`;
    }

    return {
        title,
        advice,
        details,
    };
};


