/**
 * Created by EtaySchur on 23/11/2015.
 */


var app = angular.module("mainApp", ['ui.bootstrap' ,
    'mgcrea.ngStrap' ,
    'ngRoute' ,
    'ngAnimate',
    'ngSanitize',
    'angularFileUpload',
     'ui.bootstrap',
    'ui.tree']);

app.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
});


app.config(['$routeProvider', '$locationProvider' ,
    function($routeProvider , $locationProvider) {
        // use the HTML5 History API
       // $locationProvider.html5Mode(true);


        $routeProvider.
        when('/projects', {
            templateUrl: 'static/js/partials/projects.html',
            controller: 'ProjectsCtrl'
        }).
        when('/projects/:projectId', {
            templateUrl: 'static/js/partials/publicProjectView.html',
            controller: 'publicProjectViewCtrl'
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


app.filter('isSubCategory', function() {
    return function(input, category) {
        if(input != undefined){
            if(category == undefined){
                return input;
            }else{
                var out = [];
                for (var i = 0; i < input.length; i++){
                    if(input[i].subCategoryId == category)
                        out.push(input[i]);
                }
                return out;
            }
        }
    };
});

app.service('anchorSmoothScroll', function(){

    this.scrollTo = function(eID) {
        console.log("Scorling");
        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+(leapY-62)+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+(leapY-62)+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };

});