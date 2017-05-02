'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$http', function($http) {

    var vc = this;
    vc.foo = "1";

    vc.users = [];
    vc.message = "";

    vc.getData = function () {
        loadFromPlaceholder()
    };

    console.log(moment());

    var loadFromPlaceholder = function () {
        $http({
            method: 'GET',
            url: 'http://jsonplaceholder.typicode.com/users/'
        }).then(function successCallback(response) {
            vc.users = response.data;
            vc.message = "All good";
        }, function errorCallback(response) {
            vc.message = "Error happened: " + response;
        });
    };

    //START OF THE WEATHERS

    vc.city = "";

    var apiKey = "e440a3382cdaeb94f672fc105a201d2a";

    var url = "";
    var param = {};
    vc.dayOrFive = "";

    vc.selectType = function () {

        if (vc.dayOrFive == '1') {
             url = 'http://api.openweathermap.org/data/2.5/weather?';
             param = {
                 q: vc.city,
                 APPID: apiKey,
                 units: 'metric',
             }
             requestWeather(url, param, '1');

        }
        else if (vc.dayOrFive =='5'){
            url = 'http://api.openweathermap.org/data/2.5/forecast?'
            param = {
                q: vc.city,
                mode:'json',
                APPID:apiKey,
                units:'metric',
            }
            requestWeather(url, param, '5');

        }
        else {
            //console.log("something went really wrong with the selectionybob");
            vc.errors = "Select radio button douche";
        }


    }

  //  vc.forecast = [];


     var requestWeather = function (url, param, days) {

        vc.weathers = null;
        vc.errors = null;
        vc.forecast = null;


        $http({
            method: 'POST',
            url: url,
            params: param,

        }).then(function successCallback(response) {

            if (days == '1') {
                vc.weathers = response.data;
            }
            else if (days =='5') {
                vc.forecast = response.data;
                console.log(vc.forecast);
            }



        }, function errorCallback(response){
            //console.log("ERRROOOORRRS");

            if(response.status === "404"){
                vc.errors = "Could not find city you fucktard";
            }else{
                vc.errors = "Something else dun fucked up"
            }



        });

    }


}]);

