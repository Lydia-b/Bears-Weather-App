//Date and Time element
function formatDate(timestamp) {

    let date = new Date(timestamp);
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hour}:${minutes}`

}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}

function getWeatherForCurrentLocation() {

    navigator.geolocation.getCurrentPosition(function (response) {

        let latitude = response.coords.latitude;
        let longitude = response.coords.longitude;

        updateAllHtmlForCity(longitude, latitude);
    });

}

//Execute city search
function showWeatherForSearchedCity(event) {

    event.preventDefault();

    let cityInput = document.querySelector("#current-city");
    if (cityInput.value.trim() !== "") {

        showWeatherForCity(cityInput.value.trim())
    }
}

function showWeatherForCity(cityName) {

    let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.trim()}&units=metric&appid=${apiKey}`;

    axios.get(apiUrl).then(function (response) {
        console.log("found lon: " + response.data.coord.lon);
        console.log("found lon: " + response.data.coord.lat);

        updateAllHtmlForCity(response.data.coord.lon, response.data.coord.lat);

    });

}

// get the weather and display it all (weather and forecast)
function updateAllHtmlForCity(longitude, latitude) {

    let units = "metric";
    let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

    axios.get(apiUrl).then(function (response) {
        let h1 = document.querySelector("#city-name");
        h1.innerHTML = `${response.data.name}`;
    });
    axios.get(apiUrl).then(updateCurrentWeather);
    axios.get(apiUrl).then(updateForecast);

}

//Display current city, temp and condition
function updateCurrentWeather(response) {

    let condition = response.data.weather[0].description;
    let highTemp = Math.round(response.data.main.temp_max);
    let lowTemp = Math.round(response.data.main.temp_min);

    temperatureCelsius = Math.round(response.data.main.temp);
    let currentTemperature = document.querySelector("#current-temperature");
    currentTemperature.innerHTML = `${temperatureCelsius}`;

    let currentCondition = document.querySelector("#condition");
    currentCondition.innerHTML = `${condition}`;

    let currentHighTemp = document.querySelector("#high-temp");
    currentHighTemp.innerHTML = `Hi:${highTemp}˚C`;

    let currentLowTemp = document.querySelector("#low-temp");
    currentLowTemp.innerHTML = `Lo:${lowTemp}˚C`;

    let h3Element = document.querySelector("#current-date-time");
    h3Element.innerHTML = formatDate(response.data.dt * 1000);

    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);

}

//4 day forecast
function updateForecast(response) {

    let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";

    let latitude = response.data.coord.lat;
    let longitude = response.data.coord.lon;

    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(function (response) {

        let forecast = response.data.daily;
        let forecastElement = document.querySelector("#forecast");
        let forecastHTML = `<div class="row">`;

        forecast.forEach(function (forecastDay, index) {
            if (index > 0 && index < 5) {
                forecastHTML = forecastHTML +
                    `
                    <div class="col-3 text-center">
                        ${formatDay(forecastDay.dt)}
                        <br />
                        <img 
                            src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                            alt="" class="forecastIcon m-auto"
                        />
                        <br />
                            ${Math.round(forecastDay.temp.max)}˚ |
                        <span class="min-temperature"> ${Math.round(forecastDay.temp.min)}˚ </span>
                    </div>
                    `;
            }
        });

        forecastHTML = forecastHTML + `</div>`;
        forecastElement.innerHTML = forecastHTML;

    });

}

function showFahrenheitTemp(event) {
    event.preventDefault();
    let fahrenheitTemperature = (temperatureCelsius * 9) / 5 + 32;
    let currentTemperature = document.querySelector("#current-temperature");
    currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
    linkCelsius.classList.remove("active");
    linkFahrenheit.classList.add("active");
}

function showCelsiusTemp(event) {
    event.preventDefault();
    let currentTemperature = document.querySelector("#current-temperature");
    currentTemperature.innerHTML = temperatureCelsius;
    linkCelsius.classList.add("active");
    linkFahrenheit.classList.remove("active");
}

let temperatureCelsius = null

let linkFahrenheit = document.querySelector("#link-fahrenheit");
linkFahrenheit.addEventListener("click", showFahrenheitTemp);

let linkCelsius = document.querySelector("#link-celsius");
linkCelsius.addEventListener("click", showCelsiusTemp);

showWeatherForCity("Stuttgart");

let enterCityName = document.querySelector("#enter-city");
enterCityName.addEventListener("submit", showWeatherForSearchedCity);

let currentLocation = document.querySelector("#location-button");
currentLocation.addEventListener("click", getWeatherForCurrentLocation);