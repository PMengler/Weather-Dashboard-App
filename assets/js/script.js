// var cityList = document.querySelector('ul');
// var dailyWeather = document.querySelector('.card');
// var fetchButton = document.getElementById('fetch-button');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-button');
var APIkey = '394144fc80ac73b599b4202e469c4af9';
var cityInputEl = $('city-name');
var currentCity;

// Autocomplete for US Capital cities
$(function () {
  var capitalCityNames = [
    'Montgomery',
    'Juneau',
    'Phoenix',
    'Little Rock',
    'Sacramento',
    'Denver',
    'Hartford',
    'Dover',
    'Tallahassee',
    'Atlanta',
    'Honolulu',
    'Boise',
    'Springfield',
    'Indianapolis',
    'Des Moines',
    'Topeka',
    'Frankfort',
    'Baton Rouge',
    'Augusta',
    'Annapolis',
    'Boston',
    'Lansing',
    'St. Paul',
    'Jackson',
    'Jefferson City',
    'Helena',
    'Lincoln',
    'Carson City',
    'Concord',
    'Trenton',
    'Santa Fe',
    'Albany',
    'Raleigh',
    'Bismarck',
    'Columbus',
    'Oklahoma City',
    'Salem',
    'Harrisburg',
    'Providence',
    'Columbia',
    'Pierre',
    'Nashville',
    'Austin',
    'Salt Lake City',
    'Montpellier',
    'Richmond',
    'Olympia',
    'Charleston',
    'Madison',
    'Cheyenne',
  ];
  $('#city-name').autocomplete({
    source: capitalCityNames,
  });
});

//getApi function is called when the fetchButton is clicked

function getApi(data) {
  
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIkey}`;
  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      
      // Create Current Weather card
      var currentWeatherEl = $('#current-weather');
      currentWeatherEl.addClass('card text-dark bg-light mb-3');

      // Current City name in current weather card
      var cityNameEl = $('<h3>');
      cityNameEl.text(currentCity);
      currentWeatherEl.append(cityNameEl);

      // Current date
      var currentCityDate = data.current.dt;
      currentCityDate = dayjs().unix(currentCityDate).format('MM/DD/YYYY');
      var currentDateEl = $('<span>');
      currentDateEl.text(' (${currentCityDate}) ');
      cityNameEl.append(currentDateEl);

      // Add weather emoji for weather in current weather card
      var currentWeatherEmoji =  data.current.weather[0].icon;
      var currentWeatherEmojiEl = $('<img>');
      currentWeatherEmojiEl.attr('src', "http://openweathermap.org/img/wn/" + currentWeatherEmoji + ".png");
      cityWeatherEl.append(currentWeatherEmojiEl);

      // temperature
      var currentTemp = data.current.temp;
      var currentTempEl = $('<p>');
      currentTempEl.text(`Temp: ${currentTemp}°F`)
      currentWeatherEl.append(currentTempEl);

      // Humidity
      var currentHumidity = data.current.humidity;
      var currentHumidityEl = $('<p>');
      currentHumidityEl.text(`Humidity: ${currentHumidity}%`)
      currentWeatherEl.append(currentHumidityEl);

      // UV
      var currentUv = data.current.uvi;
      var currentUvEl = $('<p>');
      currentUvEl.text(`UV: ${currentUv}`)
      currentWeatherEl.append(currentUvEl);

      // 5 - Day Forecast
      // create 5 Day Forecast <h2> card headers
      var fiveDayForecastHeaderEl = $('#forecastHeader');
      var fiveDayHeaderEl = $('<h3>');
      fiveDayHeaderEl.text('5-Day Forecast:');
      fiveDayForecastHeaderEl.append(fiveDayHeaderEl);

      var fiveDayForecastEl = $('#forecast');

      // get key weather info from API data for five day forecast and display
      for (var i = 1; i <=5; i++) {
          var date;
          var temp;
          var icon;
          var wind;
          var humidity;

          date = data.daily[i].dt;
          date = dayjs().unix(date).format("MM/DD/YYYY");

          temp = data.daily[i].temp.day;
          icon = data.daily[i].weather[0].icon;
          wind = data.daily[i].wind_speed;
          humidity = data.daily[i].humidity;

          // create a card
          var card = document.createElement('div');
          card.classList.add('card', 'row-3', 'm-1', 'bg-info', 'text-white');
          
          // create card body and append
          var cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
          cardBody.innerHTML = `<h6>${date}</h6>
                                <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                  ${temp}°F<br>
                                  ${wind} mph <br>
                                  ${humidity}%`
          
          card.appendChild(cardBody);
          fiveDayForecastEl.append(card);
        }
    })
  return;
};

// get city coordinates from Open Weather current weather data and send to One Call API
function getCoordinates () {
  var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  fetch(requestUrl)
    .then(function (response) {
      if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
    })
    .then(function(data) {

      var cityInfo = {
          city: currentCity,
          lon: data.coord.lon,
          lat: data.coord.lat
      }

      storedCities.push(cityInfo);
      localStorage.setItem("cities", JSON.stringify(storedCities));

      // displaySearchHistory();

      return cityInfo;
    })
    .then(function (data) {
      getApi(data);
    })
    return;
};

function submitSearch (event) {
  event.preventDefault();
  currentCity = cityInputEl.val();

  // clearCurrentCityWeather();
  getCoordinates();

  return;
}

searchBtn.on('click', submitSearch);