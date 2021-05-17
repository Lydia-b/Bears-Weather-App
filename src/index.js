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

//5 day forecast
function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;

    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
        forecastHTML = forecastHTML +
            `
        <div class="col-2 text-center">
            ${formatDay(forecastDay.dt)}
             <br />
            <img 
                src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                alt="" 
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
}

//Display current city temp and condition
function showCurrentTemperature(response) {
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

//Enter city search
function getEntry(event) {
    event.preventDefault();
    let cityInput = document.querySelector("#current-city");
    if (cityInput.value.trim() !== "") {
        let h1 = document.querySelector("#city-name");
        h1.innerHTML = `${cityInput.value}`;

        let units = "metric";
        let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value.trim()}&units=${units}&appid=${apiKey}`;

        axios.get(apiUrl).then(showCurrentTemperature);
    }
}

//current location
function showPosition(response) {
    let latitude = response.coords.latitude;
    let longitude = response.coords.longitude;
    let units = "metric";
    let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
    //console.log("showPosition called")

    axios.get(apiUrl).then(showCurrentTemperature);

    let h1 = document.querySelector("#city-name");
    h1.innerHTML = "Current location";

    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function showStandardValue() {
    let units = "metric";
    let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Stuttgart&units=${units}&appid=${apiKey}`;
    //console.log("showStandardValue called")

    let h1 = document.querySelector("#city-name");
    h1.innerHTML = "Stuttgart";

    axios.get(apiUrl).then(showCurrentTemperature);
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

showStandardValue();
navigator.geolocation.getCurrentPosition(showPosition);


let temperatureCelsius = null

let linkFahrenheit = document.querySelector("#link-fahrenheit");
linkFahrenheit.addEventListener("click", showFahrenheitTemp);

let linkCelsius = document.querySelector("#link-celsius");
linkCelsius.addEventListener("click", showCelsiusTemp);

let enterCityName = document.querySelector("#enter-city");
enterCityName.addEventListener("submit", getEntry);