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
    'smoothScroll',
    'angularFileUpload']);

publicApp.config(function($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
});


publicApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'static/js/partials/mainPublicApp.html',
            controller: 'publicCtrl'
        }).
        when('/:projectId', {
            templateUrl: 'static/js/partials/publicProjectView.html',
            controller: 'publicProjectViewCtrl'
        }).
        otherwise({
            redirectTo: '/'
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

var $scope, $location;
publicApp.service('anchorSmoothScroll', function(){

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

publicApp.filter('isCategory', function() {
    return function(input, category) {
        console.log("SelectedCategory ",category);
        if(input != undefined){
            if(category == undefined){
                return input;
            }else{
                var out = [];
                for (var i = 0; i < input.length; i++){
                    if(input[i].categoryId == category)
                     console.log("PAGA ",input[i]);
                        out.push(input[i]);
                }
                return out;
            }
        }
    };
});

publicApp.directive("scroll", function ($window , $rootScope) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                $rootScope.imTopped = false;
                $rootScope.navHoverEdit = false;
            } else {
                $rootScope.imTopped = true;
            }
            $rootScope.$apply();
        });
    };
});

publicApp.service('CategoriesService', function() {
    var activeCategory = null;

    this.getActiveCategory = function() { return activeCategory};

    this.setActiveCategory = function(activeCategoryId) { activeCategory = activeCategoryId};

});


