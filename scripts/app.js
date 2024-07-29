import WEATHER_API_KEY from "./apikey.js";

const apiKey = WEATHER_API_KEY;
let weatherConditions = {};

function getWeather() {
  const city = document.getElementById("city").value || "Pristina";
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&aqi=no&alerts=no`;

  fetch(apiUrl)
    .then((resp) => {
      if (!resp.ok) throw new Error("Was not a valid response!");
      return resp.json();
    })
    .then((data) => {
      console.log(data);
      currentInfo(
        data.location.name,
        data.current.temp_c,
        data.current.condition.icon
      );
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

function currentInfo(name, temp, icon) {
  const currentInfo = document.getElementById("currentInfo");
  currentInfo.innerHTML = `
 <div class="w-36 flex flex-col justify-between">
  <h1 class="text-white text-3xl font-semibold">
    ${name}
  </h1>
  <p class="text-white text-2xl font-medium" >${temp}°</p>
</div>
<div class="bg-cyan-300">
  <img src="${icon}" alt="Weather Icon" class='w-full h-full object-contain' />
</div>
  `;
}

getWeather();

document.getElementById("getWeather").addEventListener("click", getWeather);
