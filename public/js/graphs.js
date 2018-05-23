var Data = [];
// tell canvas what to do giving context 
var hours = [];
var color = "";
var air = 0;
var allergenValue = 0;
var dataset = [];
var pieTitle = "";

//**replace with data from the api**
var graphTriggers = ["temperature", "rain", "wind"];
var circleTriggers = ["airQuality", "grass", "UVIndex", "ragweed", "mold"];

$("#sign-in-btn").on("click", function (event) {
    console.log("sign in clicked");
    var user = $("#exampleInputEmail1").val().trim();
    console.log(user);
    $.ajax("/triggers/" + user, {
        type: "GET"
    }).then(function (result) {
        console.log(result);

        var emptyArray1 = [];
        var emptyArray2 = [];
        var allergenArray = ["pollen", "temperature", "wind", "rain", "airQuality", "ragWeed", "grass", "mold", "humidity", "uvIndex"];
        for (var index = 0; index < allergenArray.length; index++) {
            if (result[index] === true) {
                if (allergenArray[index] === "temperature" || allergenArray[index] === "wind" || allergenArray[index] === "rain" || allergenArray[index] === "humidity") {
                    emptyArray1.push(allergenArray[index]);
                } else if (allergenArray[index] === "airQuality" || allergenArray[index] === "ragWeed" || allergenArray[index] === "grass" || allergenArray[index] === "mold" || allergenArray[index] === "humidity" || allergenArray[index] === "uvIndex") {
                    emptyArray2.push(allergenArray[index]);
                }
            }
        }
        console.log(emptyArray1);
        console.log(emptyArray2);
        sessionStorage.setItem("triggerArray", emptyArray1.toString());
        sessionStorage.setItem("circleTriggerArray", emptyArray2.toString());
        window.location.href = "/index";
    });
});

function hourlyForcast() {
    var queryURL = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/335315?apikey=ADBLR0VCWoVNPXvAhO9vBXTtlAAU8sfM&language=en-us&details=true";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        getWeatherData(response);
    });
    getTime();
}

//get the next 24 hours for labels
function getTime() {
    var d = new Date();
    var currentHour = d.getHours();
    console.log(currentHour);

    //for loop 24 times
    for (var i = 0; i < 12; i++) {
        //millitary time hour
        var thisHour = currentHour + i;

        //if past midnight, turn it into next day
        if (thisHour > 24) {
            thisHour -= 24;
        }

        //if after noon turn it into us standard and add pm.  If not push it with am.
        if (thisHour > 12) {
            hours.push(thisHour - 12 + " pm");
        } else {
            hours.push(thisHour + " am");
        }
    }
    console.log(hours);
}

function getWeatherData(data) {

    var chartId = document.getElementById("myChart").getContext('2d');

    if (sessionStorage.getItem("triggerArray")) {
        graphTriggers = sessionStorage.getItem("triggerArray").split(",");
        console.log(graphTriggers);
    }

    for (var k = 0; k < graphTriggers.length; k++) {
        console.log(graphTriggers[k]);
        switch (graphTriggers[k]) {
            // case ("airPresure"):
            //     dataset[k] = {
            //         label: 'Air Presure',
            //         data: [20, 30, 20, 10],
            //         backgroundColor: "#ffe879",
            //         yAxisID: 'y-axis-1',
            //         xAsisID: 'x1',
            //         type: 'bar'
            //     };
            //     break;

            case ("temperature"):
                dataset[k] = {
                    label: 'Temperature',
                    data: createArray(data, 'Temperature.Value'),
                    yAxisID: 'y-axis-2',
                    // xAsisID: 'x2',
                    borderColor: '#ffe879',
                    fill: false,
                    type: 'line'
                };
                break;

            case ("wind"):
                dataset[k] = {
                    label: 'Wind Speed',
                    data: createArray(data, 'Wind.Speed.Value'),
                    yAxisID: "y-axis-1",
                    // xAsisID: 'x2',
                    borderColor: "#3498db",
                    fill: false,
                    type: "line"
                };
                break;

            case ("rain"):
                dataset[k] = {
                    label: 'Rain',
                    data: createArray(data, 'Rain.Value'),
                    backgroundColor: "#3498db",
                    yAxisID: "y-axis-2",
                    // xAsisID: 'x2',
                    type: 'bar'
                };
                break;

            case ("humidity"):
                dataset[k] = {
                    label: 'Humidity',
                    data: createArray(data, 'RelativeHumidity'),
                    yAxisID: "y-axis-2",
                    // xAsisID: 'x2',
                    borderColor: "#3498db",
                    fill: false,
                    type: "bar"
                };
                break;

            case ("uvForcast"):
                dataset[k] = {
                    label: 'UV Index',
                    data: createArray(data, 'UVIndex'),
                    yAxisID: "y-axis-2",
                    // xAsisID: 'x2',
                    borderColor: "#ffe879",
                    fill: false,
                    type: "line"
                };

        }
    }
    console.log(dataset);

    var weatherChart = new Chart(chartId, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: dataset,
        },
        options: {
            scales: {
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                    gridLines: {
                        drawOnChartArea: false,
                    },

                }, {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    gridLines: {
                        drawOnChartArea: false,
                    },
                }],
                xAxes: [{
                    //     id: "x1",
                    //     type: "catagory",
                    //     position: "bottom",
                    //     ticks: {
                    //         min: 0,
                    //         max: 12,
                    //         stepSize: 1
                    //     }
                    // },
                    // {
                    //     id: "x2",
                    //     type: "linear",
                    //     position: "top",
                    //     ticks: {
                    //         min: 0,
                    //         max: 12,
                    //         stepSize: 3
                    //     }
                }]
            }
        }
    });
}

function createArray(info, key) {
    console.log(info);
    console.log(key);
    var array = [];
    for (var h = 0; h < 12; h++) {

        console.log(Object.byString(info[h], key));
        array.push(Object.byString(info[h], key));

    }
    console.log(array);
    return array;
}

//code by alnitak
Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
};




//pie chart functions

function dailyForcast() {
    var queryURL = "http://dataservice.accuweather.com/forecasts/v1/daily/1day/335315?apikey=ADBLR0VCWoVNPXvAhO9vBXTtlAAU8sfM&details=true";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response.DailyForecasts[0].AirAndPollen[0]);
        createCircles(response.DailyForecasts[0].AirAndPollen);
    });
}

function createCircles(airData) {

    if (sessionStorage.getItem("circleTriggerArray")) {
        circleTriggers = sessionStorage.getItem("circleTriggerArray").split(",");
        console.log(circleTriggers);
    }
    for (var j = 0; j < circleTriggers.length; j++) {
        var container = $("<div>");
        var containerID = '"container' + j + '"';
        var canvas = $("<canvas>");
        var canvasID = '"circle' + j + '"';

        container.addClass("circleContainer");

        canvas.attr("id", canvasID);
        console.log(canvasID);
        canvas.attr("width", "400");
        canvas.attr("height", "400");

        container.append(canvas);

        $("#circles").append(container);
        addCircleData(j, canvasID, airData);
    }
}

function addCircleData(index, chartId, data) {

    console.log(circleTriggers[index]);
    switch (circleTriggers[index]) {
        case "airQuality":
            allergen = "airQuality";
            allergenValue = getValue(0, data);
            console.log(allergenValue);
            pieTitle = "Air Quality";
            break;
        case "grass":
            allergen = "grass";
            allergenValue = getValue(1, data);
            console.log(allergenValue);
            pieTitle = "Grass Pollen";
            break;
        case "mold":
            allergen = "mold";
            allergenValue = getValue(2, data);
            console.log(allergenValue);
            pieTitle = "Mold";
            break;
        case "tree":
            allergen = "tree";
            allergenValue = getValue(3, data);
            console.log(allergenValue);
            pieTitle = "Tree Pollen";
            break;
        case "ragweed":
            allergen = "ragweed";
            allergenValue = getValue(4, data);
            console.log(allergenValue);
            pieTitle = "Ragweed Pollen";
            break;
        case "uvIndex":
            allergen = "uvIndex";
            allergenValue = getValue(5, data);
            console.log(allergenValue);
            pieTitle = "UV Index";
            break;

        default:
            break;
    }

    //get value to create circle graph
    air = 6 - allergenValue;

    pieDisplay();

    // console.log(allergenValue);
    // console.log(air);

    var ctx = document.getElementById(chartId).getContext('2d');

    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Good Air", "Bad Air"],
            datasets: [{
                backgroundColor: [
                    "#0F1112",
                    color
                ],
                data: [air, allergenValue]
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: pieTitle
            }
        }
    });
}

function pieDisplay() {
    //change color based on value
    switch (allergenValue) {
        case 1:
            color = "#00a86b";
            break;
        case 2:
            color = "#4fa134";
            break;
        case 3:
            color = "#7d9500";
            break;
        case 4:
            color = "#F7BD00";
            break;
        case 5:
            color = "#d76000";
            break;
        case 6:
            color = "#FF0000";
            break;
    }
    console.log(color);
}

function getValue(item, info) {
    console.log(info[item]);
    return info[item].CategoryValue;
}

hourlyForcast();
dailyForcast();