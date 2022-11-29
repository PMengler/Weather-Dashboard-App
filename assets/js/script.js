var APIkey = '6c2804129ff3cbd5d74a5aa5eb917a4c';
var searchBtn = $('#search-button');
var clearBtn = $('#clear-button');
var cityInputEl = $('#city-name');
var pastSearchedEl = $('#past-searched')
var currentCity;

// Autocomplete for US Capital cities + Portland :)
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
      var currentWeatherEmoji =  data.current.weather[0].icon;
      var currentWeatherEmojiEl = $('<img>');
      currentWeatherEmojiEl.attr('src', "http://openweathermap.org/img/wn/" + currentWeatherEmoji + ".png");
      cityNameEl.append(currentWeatherEmojiEl);

      // temperature
      var currentTemp = data.current.temp;
      var currentTempEl = $('<p>');
      currentTempEl.text(`Temp: ${currentTemp}°F`)
      currentWeatherEl.append(currentTempEl);

      // get current wind speed and display
      var currentWind = data.current.wind_speed;
      var currentWindEl = $('<p>')
      currentWindEl.text(`Wind: ${currentWind} mph`)
      currentWeatherEl.append(currentWindEl);

      // Humidity
      var currentHumidity = data.current.humidity;
      var currentHumidityEl = $('<p>');
      currentHumidityEl.text(`Humidity: ${currentHumidity}%`)
      currentWeatherEl.append(currentHumidityEl);

      // UV
      var currentUv = data.current.uvi;
      var currentUvEl = $('<p>');
      currentUvEl.text(`UV Index: ${currentUv}`)
      currentWeatherEl.append(currentUvEl);

      // 5 - Day Forecast
      // create 5 Day Forecast <h2> card headers
      var forecastHeaderEl = $('#forecastHeader');
      var fiveDaysHeader = $('<h3>');
      fiveDaysHeader.text('5-Day Forecast:');
      forecastHeaderEl.append(fiveDaysHeader);

      var fiveDays = $('#forecast');

      // get key weather info from API data for five day forecast and display
      for (var i = 1; i <=5; i++) {
        var date;
        var temp;
        var icon;
        var wind;
        var humidity;
        var uvi;
        
        // debugger
        date = data.daily[i].dt
        date = dayjs(date[i]).add(i, 'day').format("MM/DD/YYYY");

        temp = data.daily[i].temp.day;
        icon = data.daily[i].weather[0].icon;
        wind = data.daily[i].wind_speed;
        humidity = data.daily[i].humidity;
        uvi = data.daily[i].uvi;

        // create a card
        var card = document.createElement('div');
        card.classList.add('card', 'row-6', 'mb-3', 'bg-info', 'text-white');
        card.setAttribute("style", "margin: 1rem");

        // create card body and append
        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerHTML = `<h6>${date}</h6>
                              <img src= "http://openweathermap.org/img/wn/${icon}.png"> </><br>
                                Temp: ${temp}°F<br>
                                Wind: ${wind} mph <br>
                                Humidity: ${humidity}% <br>
                                UV Index: ${uvi}`
        
        card.appendChild(cardBody);
        fiveDays.append(card);
      }
    })
  return;
}

// Display search history as buttons
function displayHistory() {
  var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  var pastSearchedEl = $('#past-searched');

  pastSearchedEl.empty();

  for (i = 0; i < storedCities.length; i++) {
      
      var pastCityBtn = document.createElement("button");
      pastCityBtn.classList.add("btn", "btn-info", "my-2", "past-city");
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

      displayHistory();

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
  var pastSearchedEl = $('#past-searched');

  localStorage.removeItem("cities");
  pastSearchedEl.empty();

  return;
}

function clearCurrentWeather () {
  var currentWeatherEl = $("#current-weather");
  currentWeatherEl.empty();

  var forecastHeaderEl = $("#forecastHeader");
  forecastHeaderEl.empty();
  var forecastEl = $("#forecast");
  forecastEl.empty();

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

displayHistory();

searchBtn.on('click', submitSearch);

clearBtn.on('click', clearHistory);

pastSearchedEl.on('click', getPastCity);