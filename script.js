const API_KEY = 'cc27b7d0eed964d650c5f07d4627cf08';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const COUNTRY_URL = `${BASE_URL}weather`;
const FORECAST_URL = `${BASE_URL}forecast`;

document.getElementById('search-btn').addEventListener('click', () => {
  const country = document.getElementById('country-input').value.trim();
  if (country) {
    fetchWeatherByCountry(country);
  } else {
    alert('Please enter a country!');
  }
});

document.getElementById('search-coords-btn').addEventListener('click', () => {
  const lat = parseFloat(document.getElementById('latitude-input').value);
  const lon = parseFloat(document.getElementById('longitude-input').value);
  if (!isNaN(lat) && !isNaN(lon)) {
    fetchWeatherByCoords(lat, lon);
  } else {
    alert('Please enter valid coordinates!');
  }
});

async function fetchWeatherByCountry(country) {
  try {
    const response = await fetch(`${COUNTRY_URL}?q=${country}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayWeather(data);
    fetchForecast(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert('Error fetching weather data.');
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${COUNTRY_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayWeather(data);
    fetchForecast(lat, lon);
  } catch (error) {
    alert('Error fetching weather data.');
  }
}

async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    alert('Error fetching forecast data.');
  }
}

function displayWeather(data) {
  document.getElementById('location-name').innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById('current-weather').innerHTML = `
    ${data.weather[0].description} - ${data.main.temp}°C
    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
  `;
  document.getElementById('weather-result').classList.remove('hidden');
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; // Limpia resultados previos

  const uniqueDays = new Map(); // Para filtrar días únicos
  const chartLabels = [];
  const chartData = [];

  data.list.forEach((item) => {
    const date = new Date(item.dt_txt);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    if (!uniqueDays.has(dayName)) {
      uniqueDays.set(dayName, item);

      chartLabels.push(dayName);
      chartData.push(item.main.temp);

      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      forecastItem.innerHTML = `
        <p>${dayName}</p>
        <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
        <p>${item.main.temp.toFixed(2)}°C</p>
      `;
      forecastContainer.appendChild(forecastItem);
    }
  });

  renderChart(chartLabels, chartData);
  document.getElementById('forecast-result').classList.remove('hidden');
}

function renderChart(labels, data) {
  const ctx = document.getElementById('weather-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: data,
          borderColor: '#ffdb58',
          backgroundColor: 'rgba(255, 219, 88, 0.3)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}
