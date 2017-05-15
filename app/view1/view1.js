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
                    //Better display, include imgs for the sunrise and sunset (glphicons etc instead of text in the html


                }
                else if (days == '5') {

                    vc.forecast = response.data;

                    vc.fiveDayForecast = [];
                    var currentDay = null;

                    angular.forEach(vc.forecast.list, function(timeForecast, key){ //for every obj in forecast list
                        //console.log("I'm doing a thing", timeForecast);
                        //moment needs in milliseconds
                        var timestamp = moment(timeForecast.dt * 1000); //without in milliseconds, starts from wrong point - 1970

                        //console.log('check', timestamp.hour());
                        //if there is a current day and it's midnight add the day to the forecast
                        if(currentDay &&  timestamp.hour() <= 1){ //BST/GMT issue. Further research needed into handing timezones with momentJS
                            //console.log('pushin', currentDay);
                            vc.fiveDayForecast.push(currentDay);
                        }

                        //if there is no current day or it's midnight make a new day
                        if(!currentDay || timestamp.hour() <= 1){
                            //console.log('creatin');
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

            //for ref: https://github.com/urish/angular-spinner spinner used and imported as per link


        };


    }]);

