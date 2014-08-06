'use strict';

angular.module('angular-client-side-auth', ['ngCookies', 'ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        var access = routingConfig.accessLevels;

        // Public routes
        $stateProvider
            .state('public', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.public
                }
            })
            .state('public.404', {
                url: '/404',
                template: '<h1>404</h1><h3>Not found</h3>'
            });

        // Anonymous routes
        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.anon
                }
            })
            .state('anon.login', {
                url: '/login',
                templateUrl: 'app/modules/admin/login/tpl/login.tpl.html',
                controller: 'LoginCtrl'
            })
            .state('anon.register', {
                url: '/register/',
                templateUrl: 'register',
                controller: 'RegisterCtrl'
            });

        // Regular user routes
        $stateProvider
            .state('user', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.user
                }
            })
            .state('user.home', {
                url: '/',
                templateUrl: 'app/modules/admin/home/tpl/home.tpl.html'
            })
            .state('user.private', {
                abstract: true,
                url: '/private/',
                templateUrl: 'private/layout'
            })
            .state('user.private.home', {
                url: '',
                templateUrl: 'private/home'
            })
            .state('user.private.nested', {
                url: 'nested/',
                templateUrl: 'private/nested'
            })
            .state('user.private.admin', {
                url: 'admin/',
                templateUrl: 'private/nestedAdmin',
                data: {
                    access: access.admin
                }
            });

        // Admin routes
        $stateProvider
            .state('admin', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.admin
                }
            })
            .state('admin.admin', {
                url: '/admin/',
                templateUrl: 'admin',
                controller: 'AdminCtrl'
            });


        $urlRouterProvider.otherwise('/404');
    }])

    .run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!Auth.authorize(toState.data.access)) {
                $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
                event.preventDefault();

                if(fromState.url === '^') {
                    if(Auth.isLoggedIn()) {
                        $state.go('user.home');
                    } else {
                        $rootScope.error = null;
                        $state.go('anon.login');
                    }
                }
            }
        });

    }]);
