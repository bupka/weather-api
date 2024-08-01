import WEATHER_API_KEY from "./apikey.js";

function getWeather() {
  const apiKey = WEATHER_API_KEY;
  const city = document.getElementById("city").value || "Pristina";
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&lang=en`;

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
      hourlyData(data);
      airConditions(data);
    })
    .catch(console.err);
}

function currentInfo(name, temp, icon) {
  const currentInfo = document.getElementById("currentInfo");
  currentInfo.innerHTML = `
  <div class="w-80 flex flex-col justify-between">
    <h1 class="text-white text-2xl sm:text-3xl md:text-5xl font-semibold">
      ${name}
    </h1>
    <p class="text-white text-3xl font-medium" >${temp}°</p>
  </div>
  <div class='my-auto'>
    <img src="${icon}" alt="Weather Icon" class='object-contain w-32 h-32 md:w-36 md:h-36  ' />
  </div>
  `;
}

function weeklyInfo(data) {
  const weeklyForecast = document.getElementById("row");

  const weeklyData = data.forecast.forecastday;
  weeklyForecast.innerHTML = weeklyData
    .map((day) => {
      let date = new Date(day.date_epoch * 1000);
      let options = { weekday: "long" };
      let dayName = date.toLocaleDateString("en-US", options);

      let maxTemp = day.day.maxtemp_c;
      let wholeMaxTemp = Math.floor(maxTemp);
      let minTemp = day.day.mintemp_c;
      let wholeMinTem = Math.floor(minTemp);

      return `
          <div class='py-4 flex justify-between '>
            <div class='flex pr-2'>
              <img class='object-contain' src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
              <p class='text-white text-base md:text-xl  text-opacity-70 place-self-center'>${day.day.condition.text}</p>
            </div>
            <div class='place-content-center'>
              <span class='text-white text-base md:text-xl text-opacity-80 place-self-center'>${wholeMaxTemp}°</span><span class='text-white text-base md:text-xl text-opacity-50 place-self-center'> /${wholeMinTem}°</span>
              <p class="text-white text-base md:text-xl text-opacity-50 place-self-center">${dayName}</p>
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
        <div class='flex flex-col items-center p-2'>
          <p class='text-white text-base md:text-xl text-opacity-50 text-center '>${formatHour(
            hourOnly
          )}</p>
          <img src="${hour.condition.icon}" alt="${hour.condition.text}" />
          <p class='text-white text-base md:text-xl text-opacity-90 text-center'>${
            hour.temp_c
          }°</p>
        </div>
       `;
    })
    .join("");
}

function airConditions(data) {
  const airConditions = document.getElementById("airConditions");
  const airData = data.current;

  airConditions.innerHTML = `
  <div class="flex flex-col items-center">
    <span class="text-white text-base text-opacity-50 flex items-center">
      <i class="fa-solid fa-temperature-half mr-2"></i>
      Real Feel
    </span>
    <h2 class="text-base md:text-xl pt-2">${airData.heatindex_c}°C</h2>
  </div>
  <div class="flex flex-col items-center ">
    <span class="text-white text-base md:text-xl text-opacity-50 flex items-center text-nowrap ">
      <i class="fa-solid fa-cloud-showers-heavy mr-2"></i>
      Chance of rain
    </span>
    <h2 class="text-base md:text-xl pt-2">${airData.precip_mm} mm</h2>
  </div>
  <div class="flex flex-col items-center">
    <span class="text-white text-base md:text-xl text-opacity-50 flex items-center">
      <i class="fa-solid fa-sun mr-2"></i>
      UV Index
    </span>
    <h2 class="text-base md:text-xl pt-2">${airData.uv}</h2>
  </div>
  <div class="flex flex-col items-center">
    <span class="text-white text-base md:text-xl text-opacity-50 flex items-center">
      <i class="fa-solid fa-wind mr-2"></i>
      Wind
    </span>
    <h2 class="text-base md:text-xl pt-2">${airData.wind_kph} km/h</h2>
  </div>
`;
}

function formatHour(hour) {
  let ampm = hour >= 12 ? "PM" : "AM";
  let formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}

getWeather();

document.getElementById("getWeather").addEventListener("click", getWeather);
