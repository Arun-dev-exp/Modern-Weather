import React, { useRef, useEffect, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
  const inputRef = useRef();
  const [weather, setWeather] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const getAdvice = (temp) => {
    if (temp > 20) return "It's a hot day, drink water and stay hydrated";
    if (temp <= 10) return "It's a cold day, wear a jacket";
    return "It's a pleasant day, enjoy!";
  };

  const search = async (city) => {
    if (city === '') return alert('Please enter a city name');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=af305dece548f8b3a8292ca559be8666`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        throw new Error(data.message);
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeather({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });

    } catch (error) {
      setWeather(false);
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    search('London');
  }, []);

  return (
    <div className='weather'>
      <div className='search-box'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search...'
          onKeyDown={(e) => {
            if (e.key === 'Enter') search(inputRef.current.value);
          }}
        />
        <img
          src={search_icon}
          alt="search bar"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weather ? (
        <>
          <div className='location-box'>
            <img src={weather.icon} alt="weather icon" className='weather-icon' />
            <p className='temperature'>{weather.temperature}°C</p>
            <p className='location'>{weather.location}</p>
          </div>

          <div className='weather-data'>
            <div className="col">
              <img src={humidity_icon} alt="humidity icon" />
              <div>
                <p>{weather.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind icon" />
              <div>
                <p>{weather.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>

          <div className="Advice">
            <p>Advice: {getAdvice(weather.temperature)}</p>
          </div>
        </>
      ) : (
        <div className="error-message">
          <p>⚠️ Unable to fetch weather data. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
