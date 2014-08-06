'use strict';

var adminApp = angular.module('adminApp', [
    // Home
    'adminApp.controllers.home',

    // Here another modules ...

    'ngRoute',
    'ngResource',
    'pascalprecht.translate'
]);


var adminAppPath = 'app/modules/admin';


adminApp.config(function ($routeProvider) {
    $routeProvider
        .when('/start', {
            templateUrl: adminAppPath + '/home/tpl/home.tpl.html',
            controller: 'HomeCtrl'
        })
        .when('/translations', {
            templateUrl: adminAppPath + '/common/translate/tpl/translations.tpl.html',
            controller: 'TranslationsCtrl'
        })
        .otherwise({
            redirectTo: '/start'
        });
});