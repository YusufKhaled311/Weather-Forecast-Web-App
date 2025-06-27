const searchInput = document.getElementById('searchInput');
const country = document.getElementById('country');
const currentTemp = document.getElementById('currentTemp');
const forecastIcon = document.getElementById('forecastIcon');
const weatherText = document.getElementById('weatherText');


let typingTimer;
const typingDelay = 700;

const API_KEY = '6734900969884676880110808252506';



(()=>{

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        error => {
            console.warn('Geolocation failed or was denied. Loading default city.');
            fetchWeather('Cairo');
        }
    );
} else {
    console.warn('Geolocation not supported. Loading default city.');
    fetchWeather('Cairo');
}})()

function fetchWeatherByCoords(lat, lon) {
    fetchWeather(`${lat},${lon}`);
}

//  Live search while typing
searchInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const city = searchInput.value.trim();
        if (city === '') {
            fetchWeather('Cairo');
        } else {
            fetchWeather(city);
        }
    }, typingDelay);
});


async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        displayTodayData(data);
        tomorrow(data);
        AfterTomorrow(data);

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        country.innerHTML = `<h2 class="location text-danger">Location not found</h2>`;
    }
}


function displayTodayData(data) {
    let temp = data.current.temp_c;
    let city = data.location.name;
    let countryName = data.location.country;

    let icon = data.current.condition.icon;
    let text = data.current.condition.text;

    displayCountry(city, countryName);
    TodayTemp(temp);
    todayForecastCondition(icon, text);
}

function displayCountry(locationName, countryName, localtime) {
    country.innerHTML = `
       <h2 class="location text-capitalize f-20 light-gray-color fw-400">${locationName}, ${countryName}</h2>
    `;

}

function TodayTemp(CurrentDegree) {
    currentTemp.innerHTML = `<h2 class="degree text-white f-90">${CurrentDegree}<sup class="f-68">o</sup>c</h2>`;
}

function todayForecastCondition(icon, Text) {
    forecastIcon.innerHTML = `
        <img src="${icon}" class="w-25" alt="weather condition icon">
    `;
    weatherText.innerHTML = `
        <h2 class="weather main-color f-14 fw-400 pt-1">${Text}</h2>
    `;
}


function tomorrow(data) {
   const tomorrowIndex =1
    let tomorrowMaxTemp = data.forecast.forecastday[tomorrowIndex].day.maxtemp_c;
    let tomorrowMinTemp = data.forecast.forecastday[tomorrowIndex].day.mintemp_c;
    let tomorrowTempIcon = data.forecast.forecastday[tomorrowIndex].day.condition.icon;
    let tomorrowCondition = data.forecast.forecastday[tomorrowIndex].day.condition.text;

    tomorrowTemp(tomorrowMaxTemp, tomorrowMinTemp, tomorrowTempIcon, tomorrowCondition)

}
function tomorrowTemp(maxTemp, minTemp, tempIcon, tempText) {


    const tomorrowTempIcon = document.getElementById('tomorrowTempIcon');
    const tomorrowMaxDegree = document.getElementById('tomorrowMaxDegree');
    const tomorrowMinDegree = document.getElementById('tomorrowMinDegree');
    const tomorrowCondition = document.getElementById('tomorrowCondition');

    tomorrowTempIcon.innerHTML = `
       <img src="${tempIcon}" class="w-100" alt="">
    `

    tomorrowMaxDegree.innerHTML =
        `
                                    <h2 class="degree text-white pt-4">${maxTemp}<sup class="f-18">o</sup>c</h2>
    `

    tomorrowMinDegree.innerHTML = `
                                <span class="degree light-gary-color pb-4 fw-400 f-18">${minTemp}<sup class="f-18">o</sup></span>

    `
    tomorrowCondition.innerHTML = `
                                <h2 class="weather main-color f-14 fw-400 pt-1"> ${tempText}</h2>
    `
}
function AfterTomorrow(data) {

    const afterTomorrowIndex = 2
    let afterTomorrowMaxTemp = data.forecast.forecastday[afterTomorrowIndex].day.maxtemp_c;
    let afterTomorrowMinTemp = data.forecast.forecastday[afterTomorrowIndex].day.mintemp_c;
    let afterTomorrowTempIcon = data.forecast.forecastday[afterTomorrowIndex].day.condition.icon;
    let afterTomorrowCondition = data.forecast.forecastday[afterTomorrowIndex].day.condition.text;
    afterTomorrowTemp(afterTomorrowMaxTemp, afterTomorrowMinTemp, afterTomorrowTempIcon, afterTomorrowCondition)
}
function afterTomorrowTemp(maxTemp, minTemp, tempIcon, tempText) {


    const afterTomorrowTempIcon = document.getElementById('afterTomorrowTempIcon');
    const afterTomorrowMaxDegree = document.getElementById('afterTomorrowMaxDegree');
    const afterTomorrowMinDegree = document.getElementById('afterTomorrowMinDegree');
    const afterTomorrowCondition = document.getElementById('afterTomorrowCondition');

    afterTomorrowTempIcon.innerHTML = `
       <img src="${tempIcon}" class="w-100" alt="">
    `

    afterTomorrowMaxDegree.innerHTML =
        `
                                    <h2 class="degree text-white pt-4">${maxTemp}<sup class="f-18">o</sup>c</h2>
    `

    afterTomorrowMinDegree.innerHTML = `
                                <span class="degree light-gary-color pb-4 fw-400 f-18">${minTemp}<sup class="f-18">o</sup></span>

    `
    afterTomorrowCondition.innerHTML = `
                                <h2 class="weather main-color f-14 fw-400 pt-1"> ${tempText}</h2>
    `
}


(function getFormattedDateInfo(dateObj = new Date()) {
    const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    const formattedDate = `${months[dateObj.getMonth()]} ${dateObj.getDate()} ${dateObj.getFullYear()}`;

    // Get current day index
    const dayIndex = dateObj.getDay();

    // Calculate today, tomorrow, after tomorrow
    const today = daysOfTheWeek[dayIndex];
    const tomorrow = daysOfTheWeek[(dayIndex + 1) % 7];
    const afterTomorrow = daysOfTheWeek[(dayIndex + 2) % 7];

    displayDates(today,formattedDate,tomorrow,afterTomorrow)

})() ;


function displayDates(today, date , tomorrow , afterTomorrow)
{

    const todayName= document.getElementById('todayName') ;
    const tomorrowName = document.getElementById('tomorrowName') ;
    const currentDate = document.getElementById('currentDate') ;
    const afterTomorrowName=document.getElementById('afterTomorrowName') ;


    todayName.innerHTML= ` <h2 class="day f-14 fw-400   ">${today}</h2>`
    currentDate.innerHTML=`<h2 class="date f-14 fw-400  ">${date}</h2>`
    tomorrowName.innerHTML=`  <h2 class="day f-14 fw-400 ">${tomorrow}</h2>`
    afterTomorrowName.innerHTML=`   <h2 class="day f-14 fw-400 ">${afterTomorrow}</h2>`

}
