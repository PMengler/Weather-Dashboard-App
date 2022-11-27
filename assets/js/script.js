var cityList = document.querySelector('ul');
var dailyWeather = document.querySelector('.card');
var fetchButton = document.getElementById('fetch-button');

// Autocomplete widget
$(function () {
    var cityNames = [
      'list of cities',
    ];
    $('#skill-name').autocomplete({
      source: cityNames,
    });
  });

//getApi function is called when the fetchButton is clicked

function getApi() {
  // Insert the API url to get a list of your repos
  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}&per_page=5';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //looping over the fetch response and inserting the URL of your repos into a list
      for (var i = 0; i < 5; i++) {
        //Create a list element
        var listItem = document.createElement('li'); // should have list elements created for cities that i've looked up
        //and cards created for the daily weather in each city

        //Set the text of the list element to the JSON response's .html_url property
        listItem.textContent = data[i].html_url;

        //Append the li element to the id associated with the ul element.
        repoList.appendChild(listItem);
      }
    });
}

fetchButton.addEventListener('click', getApi);