'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$http', function($http) {

    var vc2 = this;
    vc2.foo = "1";

    vc2.users = [];
    vc2.message = "";

    vc2.getData = function () {
        loadFromPlaceholder()
    };



    var loadFromPlaceholder = function () {
        $http({
            method: 'GET',
            url: 'http://jsonplaceholder.typicode.com/users/'
        }).then(function successCallback(response) {
            vc2.users = response.data;
            vc2.message = "All good";
        }, function errorCallback(response) {
            vc2.message = "Error happened: " + response;
        });
    };

}]);