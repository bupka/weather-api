import WEATHER_API_KEY from "./apikey.js";

function getWeather() {
  const apiKey = WEATHER_API_KEY;
  const city = document.getElementById("city").value || "Pristina";
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&aqi=no&alerts=no&lang=en`;

  fetch(apiUrl)
    .then((resp) => {
      if (!resp.ok) throw new Error(resp.statusText);
      return resp.json();
    })
    .then((data) => {
      console.log(data);
      currentInfo(
        data.location.name,
        data.current.temp_c,
        data.current.condition.icon
      );
      weeklyInfo(data);
    })
    .catch(console.err);
}

function currentInfo(name, temp, icon) {
  const currentInfo = document.getElementById("currentInfo");
  currentInfo.innerHTML = `
  <div class="w-24 flex flex-col justify-between">
    <h1 class="text-white text-5xl font-semibold">
      ${name}
    </h1>
    <p class="text-white text-3xl font-medium" >${temp}°</p>
  </div>
  <div class="w-32 h-32">
    <img src="${icon}" alt="Weather Icon" class='w-full h-full object-contain' />
  </div>
  `;
}

function weeklyInfo(data) {
  let weeklyForecast = document.getElementById("row");

  const weeklyData = data.forecast.forecastday;
  console.log(weeklyData);
  weeklyForecast.innerHTML = weeklyData
    .map((day, idx) => {
      console.log(day, idx);
      return `
          <div class='p-4 flex justify-between border-b-2 border-blue-500 border-opacity-50'>
            <div class='flex'>
              <img class='w-28 object-contain' src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p class='text-white text-1xl place-self-center'>${day.day.condition.text}</p>
            </div>
            <div class='flex flex-col justify-around '>
              <p class='text-white text-1xl place-self-center'>${day.day.maxtemp_c}°/${day.day.mintemp_c}°</p>
              <date class="text-white text-1xl place-self-center">${day.date}</date>
            </div>
          </div>`;
    })
    .join("");
}

getWeather();

document.getElementById("getWeather").addEventListener("click", getWeather);
