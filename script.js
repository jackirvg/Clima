const API_KEY = 'cc27b7d0eed964d650c5f07d4627cf08'; // Reemplaza con tu clave de OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

document.addEventListener('DOMContentLoaded', () => {
    // Detecta ubicación automáticamente al cargar la página
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, showError);
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  });
  
  document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    if (country) {
      fetchWeatherByCountry(country);
    } else {
      alert('Please enter a country!');
    }
  });
  
  async function fetchWeatherByCountry(country) {
    try {
      const response = await fetch(`${BASE_URL}?q=${country}&appid=${API_KEY}&units=metric`);
      if (!response.ok) throw new Error('Country not found');
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      alert(error.message);
    }
  }
  
  async function fetchWeatherByLocation(position) {
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
      if (!response.ok) throw new Error('Unable to fetch weather for your location');
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      alert(error.message);
    }
  }
  
  function showError(error) {
    alert(`Geolocation error: ${error.message}`);
  }
  
  function displayWeather(data) {
    const weatherBox = document.getElementById('weather-result');
    weatherBox.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Feels like: ${data.main.feels_like}°C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
  }
