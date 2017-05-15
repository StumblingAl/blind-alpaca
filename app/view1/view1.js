'use strict';

angular.module('myApp.view1', ['ngRoute', 'angularSpinner'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$http', 'usSpinnerService', function ($http, usSpinnerService) {

        var vc = this; //Avoid using scope to ensure compartmentalisation

        vc.city = ""; //Used to contain the user input of place - taken from the form on button submit

        var apiKey = "e440a3382cdaeb94f672fc105a201d2a"; //API key from openweathermap to bypass "not authorised"

        //Populate http parameters and URLs for POST based on user form selections
        var url = "";
        var param = {};
        vc.dayOrFive = "";

        vc.selectType = function () {

            if (vc.dayOrFive == "") {
                vc.errors = "Please select either a 5 day forecast or today's weather";
                return;
            }

            if (vc.dayOrFive == '1') { //Request current days weather for city/place
                url = 'http://api.openweathermap.org/data/2.5/weather?';
                param = {
                    q: vc.city,
                    APPID: apiKey,
                    units: 'metric',
                }
                //requestWeather(url, param, '1');
            }
            else if (vc.dayOrFive == '5') { //Request 5 day forecast for city/place
                url = 'http://api.openweathermap.org/data/2.5/forecast?'
                param = {
                    q: vc.city,
                    mode: 'json',
                    APPID: apiKey,
                    units: 'metric',
                }
                //requestWeather(url, param, '5');
            }
            requestWeather(url, param, vc.dayOrFive);
        } //end vc.selectType


        var requestWeather = function (url, param, days) {

            vc.weathers = null;
            vc.errors = null;
            vc.forecast = null;

            spinCheck(true);

            $http({
                method: 'POST',
                url: url,
                params: param,

            }).then(function successCallback(response) {

                if (response) {
                    spinCheck(false);
                }

                if (days == '1') {
                    vc.weathers = response.data;

                    vc.weathers.sys.sunrise = moment.unix(vc.weathers.sys.sunrise).format("HH:mm:ss");
                    vc.weathers.sys.sunset = moment.unix(vc.weathers.sys.sunset).format("HH:mm:ss");


                }
                else if (days == '5') {

                    var i;
                    var toSplit;
                    var time ;//= [];
                    var timeArray = [];
                    var day;
                    var dayArray = [];
                    var foreArray = [];

                    vc.forecast = response.data;
                    // for (i in vc.forecast.list) {
                    //
                    //
                    //     vc.forecast.list[i].dt_txt = moment(vc.forecast.list[i].dt_txt).format("dddd, MMMM Do YYYY;h:mm:ss");
                    //     toSplit = vc.forecast.list[i].dt_txt.split(";");
                    //     time = toSplit[1];
                    //     day = toSplit[0];
                    //
                    //
                    //     vc.forecast.list[i].time = (time);
                    //     vc.forecast.list[i].day = (day);
                    //
                    //     timeArray.push(time);
                    //
                    //     if (dayArray.indexOf(day) == -1){ //Only add each date once
                    //         dayArray.push(day);
                    //     }
                    //
                    //
                    // }

                    // vc.testData = [
                    //     {
                    //         day: 'monday',
                    //         forecast: {
                    //             midnight: {
                    //                 desc: 'very dark',
                    //                 wind: '5',
                    //                 temp: '5'
                    //             },
                    //             three: {
                    //                 desc: 'sunny',
                    //                 wind: '5',
                    //                 temp: '10'
                    //             },
                    //             six: {
                    //                 desc: 'rain',
                    //                 wind: '10',
                    //                 temp: '10'
                    //             },
                    //             nine: {
                    //                 desc: 'thunder',
                    //                 wind: '15',
                    //                 temp: '10'
                    //             },
                    //         },
                    //     },
                    //     {
                    //         day: 'tuesday',
                    //         forecast: {
                    //             midnight: {
                    //                 desc: 'very dark',
                    //                 wind: '5',
                    //                 temp: '5'
                    //             },
                    //             three: {
                    //                 desc: 'sunny',
                    //                 wind: '5',
                    //                 temp: '10'
                    //             },
                    //             six: {
                    //                 desc: 'rain',
                    //                 wind: '10',
                    //                 temp: '10'
                    //             },
                    //             nine: {
                    //                 desc: 'thunder',
                    //                 wind: '15',
                    //                 temp: '10'
                    //             },
                    //         },
                    //
                    //     },
                    // ];

                    // var realData =  [{
                    //     "dt": 1494817200,
                    //     "main": {
                    //         "temp": 5.66,
                    //         "temp_min": 5.66,
                    //         "temp_max": 7.22,
                    //         "pressure": 1030.61,
                    //         "sea_level": 1038.31,
                    //         "grnd_level": 1030.61,
                    //         "humidity": 97,
                    //         "temp_kf": -1.56
                    //     },
                    //     "weather": [
                    //         {
                    //             "id": 802,
                    //             "main": "Clouds",
                    //             "description": "scattered clouds",
                    //             "icon": "03n"
                    //         }
                    //     ],
                    //     "clouds": {
                    //         "all": 48
                    //     },
                    //     "wind": {
                    //         "speed": 1.91,
                    //         "deg": 155.51
                    //     },
                    //     "rain": {},
                    //     "sys": {
                    //         "pod": "n"
                    //     },
                    //     "dt_txt": "2017-05-15 03:00:00"
                    // }]

                    vc.fiveDayForecast = [];
                    var currentDay = null;

                    angular.forEach(vc.forecast.list, function(timeForecast, key){
                        console.log("I'm doing a thing", timeForecast);
                        //moment needs in milliseconds
                        var timestamp = moment(timeForecast.dt * 1000);

                        console.log('check', timestamp.hour());
                        //if there is a current day and it's midnight add the day to the forecast
                        if(currentDay &&  timestamp.hour() <= 1){
                            console.log('pushin', currentDay);
                            vc.fiveDayForecast.push(currentDay);
                        }

                        //if there is no current day or it's midnight make a new day
                        if(!currentDay || timestamp.hour() <= 1){
                            console.log('creatin');
                            currentDay = {
                                'day': timestamp.format('dddd'),
                                'forecast': []
                            }
                        }

                        //add forecast to the day
                        currentDay.forecast.push(
                            {
                                time: timestamp.format('HH:mm'),
                                desc: timeForecast.weather[0].main,
                                wind: timeForecast.wind.speed,
                                temp: timeForecast.main.temp
                            }
                        )
                    });

//                     var l;
//                     for (var j=0; j<=dayArray.length;j++) {
//                        // for (l in vc.forecast.list) {
//
//                             foreArray.push(
//                                 {
//                                     date: dayArray[j],
//                                     forecast: {
//                                         tim1: {
//                                             time: vc.forecast.list[j].time,
//                                             temp: vc.forecast.list[j].main.temp,
//                                             wind: vc.forecast.list[j].wind.speed,
//                                         },
//                                         tim2: {
//                                              time: vc.forecast.list[j+1].time,
//                                              temp: vc.forecast.list[j+1].main.temp,
//                                              wind: vc.forecast.list[j+1].wind.speed,
//                                         },
//
//
//                                     }
//
//                                 }
//                             );
//                         //}
//                     }
//
// console.log(foreArray);
                }


            }, function errorCallback(response) {

                spinCheck(false);

                if (response.status === "404") {
                    vc.errors = "Could not find place, please try another";
                } else {
                    vc.errors = "Oops! Something went wrong. Please try again, but if this error is persistent, try another weather site."
                }


            });

        }

        var spinCheck = function (check) {
            if (check == true) {
                usSpinnerService.spin('spinner-1');
            }
            else {
                usSpinnerService.stop('spinner-1');

            }


        };


    }]);

