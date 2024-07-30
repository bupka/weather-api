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
      currentInfo(
        data.location.name,
        data.current.temp_c,
        data.current.condition.icon
      );
      weeklyInfo(data);
      hourlyData(data);
    })
    .catch(console.err);
}

function currentInfo(name, temp, icon) {
  const currentInfo = document.getElementById("currentInfo");
  currentInfo.innerHTML = `
  <div class="w-80 flex flex-col justify-between">
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
  const weeklyForecast = document.getElementById("row");

  const weeklyData = data.forecast.forecastday;
  weeklyForecast.innerHTML = weeklyData
    .map((day) => {
      let date = new Date(day.date_epoch * 1000);
      return `
          <div class='p-4 flex justify-between border-b-2 border-blue-500 border-opacity-50'>
            <div class='flex'>
              <img class='w-28 object-contain' src="${
                day.day.condition.icon
              }" alt="${day.day.condition.text}" />
              <p class='text-white text-1xl place-self-center'>${
                day.day.condition.text
              }</p>
            </div>
            <div class='flex flex-col justify-around '>
              <p class='text-white text-1xl place-self-center'>${
                day.day.maxtemp_c
              }° / ${day.day.mintemp_c}°</p>
              <date class="text-white text-1xl place-self-center">${date.toDateString()}</date>
            </div>
          </div>`;
    })
    .join("");
}

function hourlyData(data) {
  const hourly = document.getElementById("hourly");

  let hours = data.forecast.forecastday[0].hour;
  let currentDate = new Date();
  let currentHour = currentDate.getHours();

  let filteredHours = hours.filter((hour) => {
    let timestamp = hour.time_epoch * 1000;
    let date = new Date(timestamp);
    let hourOnly = date.getHours();

    return currentHour <= hourOnly && hourOnly < currentHour + 6;
  });

  hourly.innerHTML = filteredHours
    .map((hour) => {
      let timestamp = hour.time_epoch * 1000;
      let date = new Date(timestamp);
      let hourOnly = date.getHours();

      return `
        <div class='flex flex-col items-center p-4'>
          <p class='text-white text-1xl'>${formatHour(hourOnly)}</p>
          <img src="${hour.condition.icon}" alt="${hour.condition.text}" />
          <p class='text-white text-1xl '>${hour.temp_c}°C</p>
        </div>
       `;
    })
    .join("");
}

function formatHour(hour) {
  let ampm = hour >= 12 ? "PM" : "AM";
  let formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}

getWeather();

document.getElementById("getWeather").addEventListener("click", getWeather);
