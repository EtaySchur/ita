/**
 * Created by EtaySchur on 23/11/2015.
 */


var app = angular.module("mainApp", ['ui.bootstrap' ,
    'mgcrea.ngStrap' ,
    'ngRoute' ,
    'ngAnimate',
    'ngSanitize',
    'angularFileUpload',
    'ui.tree']);

app.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
});


app.config(['$routeProvider',
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
        when('/categories', {
            templateUrl: 'static/js/partials/categories.html',
            controller: 'CategoriesCtrl'
        }).
        when('/admin', {
            templateUrl: 'static/js/partials/admin.html',
            controller: 'AdminCtrl'
        }).
        when('/testimonials', {
            templateUrl: 'static/js/partials/testimonials.html',
            controller: 'TestimonialsCtrl'
        }).
        otherwise({
            redirectTo: '/projects'
        });
    }]);

app.directive('fileModel', ['$parse', function ($parse) {
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

app.service('fileUpload', ['$http', function ($http) {
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

app.filter('isCategory', function() {
    return function(input, category) {
        if(input != undefined){
            if(category == undefined){
                return input;
            }else{
                var out = [];
                for (var i = 0; i < input.length; i++){
                    if(input[i].categoryId == category)
                        out.push(input[i]);
                }
                return out;
            }
        }
    };
});