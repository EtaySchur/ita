/**
 * Created by EtaySchur on 25/11/2015.
 */

publicApp.controller('publicCtrl', ['$scope', '$http' , function($scope , $http) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.currentPage = 0;
    $scope.pageSize = 3;

    $scope.setActiveCategoryFilter = function(category){
        console.log('setting category');
        $scope.activeCategoryFilterId = category.id;
    }

    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    $scope.setTestimonial = function(item){
        $scope.selectedTestimonial = item;
    }


    var restCallManager = new RestCallManager();
    restCallManager.post( getGeneralSettings, $http, null , "getGeneralSettings");
    function getGeneralSettings(result , status , success) {
        if (success) {
            $scope.generalSettings = result[0];
            console.log($scope.generalSettings);
        } else {

        }
    }

    var restCallManager = new RestCallManager();
    restCallManager.post(getCarouselImages , $http, null , "getCarouselImages");
    function getCarouselImages(result , status , success) {
        if (success) {
            $scope.carouselImages = result;
            console.log($scope.carouselImages);
        } else {

        }
    }

    var restCallManager = new RestCallManager();
    restCallManager.post(getProjects , $http, null , "getProjects");
    function getProjects(result , status , success) {
        if (success) {
            $scope.projects = result;
        } else {

        }
    }

    var restCallManager = new RestCallManager();
    restCallManager.post(getCategories , $http, null , "getCategories");
    function getCategories(result , status , success) {
        if (success) {
            $scope.categories = result;
        } else {

        }
    }

    var restCallManager = new RestCallManager();
    restCallManager.post(getTestimonials , $http, null , "getTestimonials");
    function getTestimonials(result , status , success) {
        if (success) {
            $scope.testimonials = result;
            if($scope.testimonials.length > 0){
                $scope.selectedTestimonial = $scope.testimonials[0];
                console.log($scope.selectedTestimonial);
            }
        } else {

        }
    }



}]);