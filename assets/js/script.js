var APIkey = '6c2804129ff3cbd5d74a5aa5eb917a4c';
// var cityList = document.querySelector('ul');
// var dailyWeather = document.querySelector('.card');
// var fetchButton = document.getElementById('fetch-button');
var searchBtn = $('#search-button');
var clearBtn = $('#clear-button');
var cityInputEl = $('#city-name');
var pastSearchedEl = $('#past-searches')
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
    'Portland',
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

//getApi function is called when the searchBtn is clicked

function getApi(data) {
  
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&units=imperial&appid=${APIkey}`;
  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      
      // Create Current Weather card
      var currentWeatherEl = $('#current-weather');
      currentWeatherEl.addClass('card text-white bg-dark mb-3');

      // Current City name in current weather card
      var cityNameEl = $('<h3>');
      cityNameEl.text(currentCity);
      currentWeatherEl.append(cityNameEl);

      // Current date
      var currentCityDate = Date.dt
      currentCityDate = dayjs(currentCityDate).format('MM/DD/YYYY');
      var currentDateEl = $('<span>');
      currentDateEl.text(` (${currentCityDate}) `);
      cityNameEl.append(currentDateEl);

      // Add weather emoji for weather in current weather card
      var currentWeatherEmoji =  data.weather[0].icon;
      var currentWeatherEmojiEl = $('<img>');
      currentWeatherEmojiEl.attr('src', "http://openweathermap.org/img/wn/" + currentWeatherEmoji + ".png");
      cityNameEl.append(currentWeatherEmojiEl);

      // temperature
      var currentTemp = data.main.temp;
      var currentTempEl = $('<p>');
      currentTempEl.text(`Temp: ${currentTemp}°F`)
      currentWeatherEl.append(currentTempEl);

      // get current wind speed and display
      var currentWind = data.wind.speed;
      var currentWindEl = $('<p>')
      currentWindEl.text(`Wind: ${currentWind} mph`)
      currentWeatherEl.append(currentWindEl);

      // Humidity
      var currentHumidity = data.main.humidity;
      var currentHumidityEl = $('<p>');
      currentHumidityEl.text(`Humidity: ${currentHumidity}%`)
      currentWeatherEl.append(currentHumidityEl);

      // UV
      var currentUv = data.main.value;
      var currentUvEl = $('<p>');
      currentUvEl.text(`UV: ${currentUv}`)
      currentWeatherEl.append(currentUvEl);

      // 5 - Day Forecast
      // create 5 Day Forecast <h2> card headers
      var forecastHeaderEl = $('#forecastHeader');
      var fiveDayHeaderEl = $('<h3>');
      fiveDayHeaderEl.text('5-Day Forecast:');
      forecastHeaderEl.append(fiveDayHeaderEl);

      var fiveDayForecastEl = $('#forecast');

      // get key weather info from API data for five day forecast and display
      for (var i = 1; i <=5; i++) {
        var date;
        var temp;
        var icon;
        var wind;
        var humidity;
        
        // debugger
        date = data.daily[i].dt;
        date = dayjs().unix(date).format("MM/DD/YYYY");

        temp = data.daily[i].temp.day;
        icon = data.daily[i].weather[0].icon;
        wind = data.daily[i].wind.speed;
        humidity = data.daily[i].humidity;

        // create a card
        var card = document.createElement('div');
        card.classList.add('card', 'row-3', 'mb-3', 'bg-info', 'text-white');
        
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
}

// Display search history as buttons
function displaySearchHistory() {
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  var pastSearchesEl = $('#past-searches');

  pastSearchesEl.innerHTML ='';

  for (i = 0; i < storedCities.length; i++) {
      
      var pastCityBtn = document.createElement("button");
      pastCityBtn.classList.add("btn", "btn-primary", "my-2", "past-city");
      pastCityBtn.setAttribute("style", "width: 100%");
      pastCityBtn.textContent = `${storedCities[i].city}`;
      pastSearchedEl.append(pastCityBtn);
  }
  return;
}

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

      displaySearchHistory();

      return cityInfo;
    })
    .then(function (data) {
      getApi(data);
    })
    return;
}

// handle requst to clear past search history
function clearHistory (event) {
  event.preventDefault();
  var pastSearchesEl = $('#past-searches');

  localStorage.removeItem("cities");
  pastSearchesEl.innerHTML ='';

  return;
}

function clearCurrentWeather () {
  var currentWeatherEl = $("#current-weather");
  currentWeatherEl.innerHTML = '';

  var forecastHeaderEl = $("#forecastHeader");
  forecastHeaderEl.innerHTML = '';

  var forecastEl = $("#forecast");
  forecastEl.innerHTML = '';

  return;
}

function submitSearch (event) {
  event.preventDefault();
  currentCity = cityInputEl.val().trim();

  clearCurrentWeather();
  getCoordinates();

  return;
}

function getPastCity (event) {
  var element = event.target;

  if (element.matches(".past-city")) {
      currentCity = element.textContent;
      
      clearCurrentWeather();

      var requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${APIkey}`;
      
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
            return cityInfo;
          })
         .then(function (data) {
            getApi(data);
      })
  }
  return;
}

displaySearchHistory();

searchBtn.on('click', submitSearch);

clearBtn.on('click', clearHistory);

pastSearchedEl.on('click', getPastCity);