//global variable

var locationKey = "";
var city = $('#userInput').val();

//check if location key already exits in session storage
if (sessionStorage.getItem("noNavigator")) {
    if (window.location.href !== "/index") {
        window.location.href = "/index";
    }
}
//save location key in sessions storage and then load index page
else if (sessionStorage.getItem("locationKey")) {
    locationKey = sessionStorage.getItem("locationKey");
    //clear the data
    clear();
    //load the next page to display data with the current location cords
    dailyTemp();
} else {
    // prompt user to use current gelocation
    window.onload = (function () {


        if ("geolocation" in navigator) {
            navigator.permissions.query({
                name: 'geolocation'
            }).then(function (result) {

                if (result.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
                } else if (result.state === 'prompt') {
                    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
                } else if (result.state === 'denied') {
                    handleError();
                }

            });

        } else {
            // geolocation is not supported
            // get your location some other way
            console.log('geolocation is not enabled on this browser');
            alert("Please enter your location");
            //load the default data
            if ($('body').is('.reLoad')) {
                sessionStorage.setItem("noNavigator", "");
                setTimeout(function () {
                    window.location.href = "/index";
                }, 1250);
            }
            clear();
            defaultPage();
        }

    });
}

$(document).ready(function () {
    clear();
    $("#city-search").on("click", function (e) {
        e.preventDefault();
        city = $('#userInput').val();
        getCityLocation(city);
        //reset the form
    });
});

function handleSuccess(position) {
    // for when getting location is a success
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
    getCordsLocation(position.coords.latitude + "," + position.coords.longitude);

}

function handleError(error_message) {
    // for when getting location results in an error
    //console.error('An error has occured while retrieving location', error_message);
    // defaultPage();
    var defaultLocationKey = 347627;
    sessionStorage.setItem("locationKey", defaultLocationKey);
    if ($('body').is('.reLoad')) {
        //     setTimeout(function () {
        window.location.href = "/index";
        //     }, 1250);
    }

}

//function that uses current location cords to generate location key api
function getCordsLocation(currentCords) {
    // var currentLat = position.coords.latitude;
    // var currentLong = position.coords.longitude;
    var apikey = "ADBLR0VCWoVNPXvAhO9vBXTtlAAU8sfM";
    var queryURL = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + apikey + "&q=" + currentCords + "&language=en-us&details=true";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        locationKey = response.Key;
        console.log(locationKey);
        sessionStorage.setItem("locationKey", locationKey);
        if ($('body').is('.reLoad')) {
            //     setTimeout(function () {
            window.location.href = "/index";
            //     }, 1250);
        }
    });

}

//default results for sacramento upon loading of index page
function defaultPage() {
    // var defaultcity = Sacramento;
    dafaultLocationKey = 347627;
    var apikey = "ADBLR0VCWoVNPXvAhO9vBXTtlAAU8sfM";
    var queryURL = "http://dataservice.accuweather.com/currentconditions/v1/347627?apikey=" + apikey + "&language=en-us&details=true";
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "jasonp",
        cache: true, //for better response time
    }).then(function (response) {
        console.log(response);

        $("#temperature").html("<p>" + response[0].ApparentTemperature.Imperial.Value + " " + response[0].ApparentTemperature.Imperial.Unit + "</p>");
        $("#iconName").html("<p>" + response[0].WeatherText + "</p>");
        var iconName = response[0].WeatherText;
        console.log(response[0].WeatherText);
        //create conditions to display icons for weather
        if (iconName === "Sunny" || iconName === "Mostly Sunny" || iconName === "Partly Sunny" || iconName === "Hazy Sunshine") {
            $("#icon").html('<img src="/assets/sunny-y.png">');
        } else if (iconName === "Mostly Cloudy" || iconName === "Cloudy" || iconName === "Dreary (Overcast)" || iconName === "Fog") {
            $("#icon").html('<img src="/assets/cloudy-y.png">');
        } else if (iconName === "Partly Sunny w/ T-Storms" || iconName === "Mostly Cloudy w/ Showers" || iconName === "T-Storms") {
            $("#icon").html('<img src="/assets/thunderstorm-y.png">');
        } else if (iconName === "Rain" || iconName === "Showers") {
            $("#icon").html('<img src="/assets/rain-y.png">');
        } else if (iconName === "Hot" || iconName === "Cold") {
            $("#icon").html('<img src="/assets/temperature-y.png">');
        } else if (iconName === "Windy") {
            $("#icon").html('<img src="/assets/windy-y.png">');
        } else if (iconName === "Clear" || iconName === "Mostly Clear") {
            $("#icon").html('<img src="/assets/windy-y.png">');
        }
        $("#cityName").html(SACRAMENTO);
        // $("#weather").append(response.DailyForecasts[0].AirAndPollen[0].Name + "<br>" + response.DailyForecasts[0].AirAndPollen[0].Value + "<br>" + response.DailyForecasts[0].AirAndPollen[0].Category + response.DailyForecasts[0].Day.Icon);
    });
}

//if user blocks use location key to let them add their location
function getCityLocation(city) {
    // var city = ('#userInput').value;
    // var locationKey = "";
    // var city = document.getElementById('#userInput').value;
    var apikey = "ADBLR0VCWoVNPXvAhO9vBXTtlAAU8sfM";
    var queryURL = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apikey + "&q=" + city + "&language=en-us&details=true&alias=Always";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        locationKey = response[0].Key;
        console.log(locationKey);
        dailyTemp();
        // currentCondition();
    });

}

// function get dailyforecast for temperature
function dailyTemp() {

    var apikey = "ADBLR0VCWoVNPXvAhO9vBXTtlAAU8sfM";
    var queryURL = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + apikey + "&language=en-us&details=true";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        //clear the location key from seassion storage
        sessionStorage.removeItem("locationKey");
        console.log(response);

        $("#temperature").html("<p>" + response[0].ApparentTemperature.Imperial.Value + " " + response[0].ApparentTemperature.Imperial.Unit + "</p>");
        $("#iconName").html("<p>" + response[0].WeatherText + "</p>");
        var iconName = response[0].WeatherText;
        console.log(response[0].WeatherText);
        //create conditions to display icons for weather
        if (iconName === "Sunny" || iconName === "Mostly Sunny" || iconName === "Partly Sunny" || iconName === "Hazy Sunshine") {
            $("#icon").html('<img src="/assets/sunny-y.png">');
        } else if (iconName === "Mostly Cloudy" || iconName === "Cloudy" || iconName === "Dreary (Overcast)" || iconName === "Fog") {
            $("#icon").html('<img src="/assets/cloudy-y.png">');
        } else if (iconName === "Partly Sunny w/ T-Storms" || iconName === "Mostly Cloudy w/ Showers" || iconName === "T-Storms") {
            $("#icon").html('<img src="/assets/thunderstorm-y.png">');
        } else if (iconName === "Rain" || iconName === "Showers") {
            $("#icon").html('<img src="/assets/rain-y.png">');
        } else if (iconName === "Hot" || iconName === "Cold") {
            $("#icon").html('<img src="/assets/temperature-y.png">');
        } else if (iconName === "Windy") {
            $("#icon").html('<img src="/assets/windy-y.png">');
        } else if (iconName === "Clear" || iconName === "Mostly Clear") {
            $("#icon").html('<img src="/assets/windy-y.png">');
        }
        //display city name
        $("#cityName").html(city);
        console.log(city);
        // $("#pollen").append(response.DailyForecasts[0].AirAndPollen[0].Name + "<br>" + response.DailyForecasts[0].AirAndPollen[0].Value + "<br>" + response.DailyForecasts[0].AirAndPollen[0].Category + response.DailyForecasts[0].Day.Icon);
    });
}
//write a clear function
function clear() {
    $("#userInput").empty();
    $("#temperature").empty();
    $("#iconName").empty();
    $("#icon").empty();
    $("#cityName").empty();
}