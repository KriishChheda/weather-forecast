const cityInput = document.querySelector(".city-input"); // selected input element
const searchButton = document.querySelector(".search-btn"); // selected search button element

const weatherCardsDiv = document.querySelector(".weather-cards");

const currentWeatherDiv = document.querySelector(".current-weather");
const API_KEY = "c3c2c03695bcd365b53712ded45f3fb6"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) =>{
    if(index === 0){ //HTML for the main weather card
            return ` <div class = "details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature: ${(weatherItem.main.temp  -273.15).toFixed(2)}°C</h2>
                        <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </div>

                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h4> ${weatherItem.weather[0].description}</h4>
                    </div>`;
    }
    else{ // HTML for the other 5 days forecast card
        return ` <li class="card">
        <h3> (${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>Temp: ${(weatherItem.main.temp  -273.15).toFixed(2)}°C</h2>
        <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;
    }
}

// this will be executed second
//toFixed(2) fixes the decimal points to 2

const getWeatherDetails=(cityName,lat,lon) => {
    const WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res =>res.json()).then(data =>{
    
     // Filter the forecast to get only one forecast per day
        const uniqueForecastDays=[]; // created an empty array
        const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate); 
            }
        });

        //Clearing prevous weather data
        cityInput.value = ""; 
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
 
       
        // Creating weather card and adding it to the DOM

        
        fiveDaysForecast.forEach(( weatherItem, index) =>{
               if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem,index));
               }
               // if statement is for the current weather
               else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
               }
               // else is for the 5 day weather data
        });

    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

// insertAdjacentHTML(position,text); 
// beforeend means inside the element after its last child
// on function calling createWeatherCard() a text will be returned which will be parsed at the position which we have specified as "beforeend"

// 1 st thing to execute

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // remove white spaces from user-entered city name
    if (!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates (latitude, longitude and name) from the API response

    // promise chaining 
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
           if(!data.length) return alert(`No coordinates found for ${cityName}`);
           const{name,lat,lon}=data[0];
           getWeatherDetails(name,lat,lon); // function call getWeatherDetails()
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

searchButton.addEventListener("click", getCityCoordinates);



