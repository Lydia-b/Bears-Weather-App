//Date and Time element
let h3Element = document.querySelector("#current-date-time");
let now = new Date();
let hour = now.getHours();
let minutes = now.getMinutes();

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[now.getDay()];

h3Element.innerHTML = `${day} ${hour}:${minutes}`;

//Display current city temp and condition
function showCurrentTemperature(response) {
    let temperature = Math.round(response.data.main.temp);
    let condition = response.data.weather[0].description;
    let highTemp = Math.round(response.data.main.temp_max);
    let lowTemp = Math.round(response.data.main.temp_min);

    let currentTemperature = document.querySelector("#current-temperature");
    currentTemperature.innerHTML = `${temperature}˚C`;

    let currentCondition = document.querySelector("#condition");
    currentCondition.innerHTML = `${condition}`;

    let currentHighTemp = document.querySelector("#high-temp");
    currentHighTemp.innerHTML = `${highTemp}˚C`;

    let currentLowTemp = document.querySelector("#low-temp");
    currentLowTemp.innerHTML = `${lowTemp}˚C`;
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

let enterCityName = document.querySelector("#enter-city");
enterCityName.addEventListener("submit", getEntry);

//current location
function showPosition(response) {
    let latitude = response.coords.latitude;
    let longtidue = response.coords.longitude;
    //console.log(response)
    let units = "metric";
    let apiKey = "caa7b6ca0477e93f78dc6b9c7d7c0e95";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtidue}&units=${units}&appid=${apiKey}`;
    //console.log("showPosition called")

    axios.get(apiUrl).then(showCurrentTemperature);

    let h1 = document.querySelector("#city-name");
    h1.innerHTML = "Current location";
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

showStandardValue();
navigator.geolocation.getCurrentPosition(showPosition);