/**
 * Created by EtaySchur on 25/11/2015.
 */

publicApp.controller('publicCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' ,  function($scope , $http , anchorSmoothScroll , $location , $rootScope) {
    $scope.myInterval = 6000;
    $scope.noWrapSlides = false;
    $scope.currentPage = 0;
    $scope.pageSize = 3;


    $scope.gotoElement = function (eID){
        console.log("scroling to ",eID);
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(eID);

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);

    };

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

    $scope.projectSelected = function(project){
        $rootScope.selectedProject = project;

        $location.path('/' + project.id);
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
            console.log("This is my projects original , " , $scope.projects);
            console.log($scope.projects);
        } else {

        }
    }

    var restCallManager = new RestCallManager();
    restCallManager.post(getCategories , $http, null , "getCategories");
    function getCategories(result , status , success) {
        if (success) {
            $scope.categories = result;
            if($scope.categories.length > 0){
                $scope.activeCategoryFilterId = $scope.categories[2].id;
            }
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

publicApp.controller('publicProjectViewCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' , '$routeParams' ,  function($scope , $http , anchorSmoothScroll , $location , $rootScope , $routeParams) {
    var projectId = $routeParams.projectId;
    if($rootScope.selectedProject == undefined){
        var restCallManager = new RestCallManager();
        restCallManager.post(getProjects , $http, projectId , "getProject");
        function getProjects(result , status , success) {
            if (success) {
                if(result.length > 0){
                    $scope.selectedProject = result[0];
                }else{
                    $location.path('/');
                }

            } else {

            }
        }
    }else{

        console.log("This is my projects!!!!!!!!!!!!!!!!!!565656!!!!!!!!!" , $rootScope.selectedProject);

    }

     function getSelectedProject (projectId){
        for(var i = 0 ; i < $scope.projects.length ; i++){
            if($scope.projects[i].id = projectId ){
                console.log("OAGA ",$scope.projects);
                return $scope.projects[i];
                break;
            }
        }
        return null;
    }




}]);