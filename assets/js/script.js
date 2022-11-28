var cityList = document.querySelector('ul');
var dailyWeather = document.querySelector('.card');
var fetchButton = document.getElementById('fetch-button');
var APIKey = '394144fc80ac73b599b4202e469c4af9';
var city;
var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={394144fc80ac73b599b4202e469c4af9}&per_page=5';

// Autocomplete for US Capital cities
$(function () {
    var cityNames = [
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
      source: cityNames,
    });
  });

//getApi function is called when the fetchButton is clicked

function getApi() {

  fetch(requestUrl)
    .then(function (response) {
      console.log(response.status)
      return response.json();
    })
    .then(function (data) {
      //looping over the fetch response and inserting the URL of your repos into a list
      for (var i = 0; i < 5; i++) {
        console.log(response.data)
        //Create a list element
        var listItem = document.createElement('li'); // should have list elements created for cities that i've looked up
        //and cards created for the daily weather in each city

        //Set the text of the list element to the JSON response's .html_url property
        // listItem.textContent = data[i].html_url;

        //Append the li element to the id associated with the ul element.
        // repoList.appendChild(listItem);
      }
    });
}

fetchButton.addEventListener('click', getApi);