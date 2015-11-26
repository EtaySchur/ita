/**
 * Created by EtaySchur on 25/11/2015.
 */
/**
 * Created by EtaySchur on 23/11/2015.
 */


var publicApp = angular.module("publicApp", ['ui.bootstrap' ,
    'mgcrea.ngStrap' ,
    'ngRoute' ,
    'ngAnimate',
    'ngSanitize',
    'angularFileUpload']);

publicApp.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
});


publicApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/projects', {
            templateUrl: 'static/js/partials/projects.html',
            controller: 'ProjectsCtrl'
        }).
        when('/phones/:phoneId', {
            templateUrl: 'partials/phone-detail.html',
            controller: 'PhoneDetailCtrl'
        }).
        when('/general', {
            templateUrl: 'static/js/partials/general.html',
            controller: 'GeneralCtrl'
        }).
        when('/carousel', {
            templateUrl: 'static/js/partials/carousel.html',
            controller: 'CarouselCtrl'
        }).
        otherwise({
            redirectTo: '/projects'
        });
    }]);

publicApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

publicApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            })
            .error(function(){
            });
    }
}]);

publicApp.filter('startFrom', function() {
    return function(input, start) {
        if(input == undefined){
            return;
        }
        start = +start; //parse to int
        return input.slice(start);
    }
});