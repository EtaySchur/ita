/**
 * Created by EtaySchur on 25/11/2015.
 */

publicApp.controller('MainCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope'  , '$window',  function($scope , $http , anchorSmoothScroll , $location , $rootScope , $window) {
    $scope.gotoElement = function (eID){
        console.log("scroling to ",eID);
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(eID);

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);


    };

    var restCallManager = new RestCallManager();
    restCallManager.post(getMiniProjects , $http, null , "getMiniProjects");
    function getMiniProjects(result , status , success) {
        if (success) {
            $rootScope.miniProjects = result;
        } else {

        }
    }

    $scope.setFormScope= function(scope){
        this.contactUsForm = scope;
    }

    $scope.sendMail = function(info) {

        if(!this.contactUsForm.$valid){
            $rootScope.validateAll = true;
            return;
        }else{
            $rootScope.validateAll = false;
        }


        if(info.howCanWeHelp == undefined){
            info.howCanWeHelp = "";
        }
        console.log(info);
        var mailJSON = {
            "key": "uISeYrp55OvaS7WaxGuA3A",
            "message": {
                "text": "שם : "+info.fullName +
                "טלפון : "+info.phone +
                "אי מייל "+info.email +
                "איך אתה יכול לעזור "+info.howCanWeHelp,
                "subject": "שעאמיט יקר , מישהו השאיר את הפרטים שלו באתר",
                "from_email": "noreply@fooddelivery.com",
                "from_name": "New Order",
                "to": [
                    {
                        "email": "etayschur@gmail.com",
                        "name": "New Order",
                        "type": "to"
                    }
                ],
                "important": true
            }
        };
        var apiURL = "https://mandrillapp.com/api/1.0/messages/send.json";
        $http.post(apiURL, mailJSON).
        success(function (data, status, headers, config) {
            var restCallManager = new RestCallManager();
            restCallManager.post( insertContactUs, $http, info , "insertContactUs");
            function insertContactUs(result , status , success) {
                if (success) {
                    console.log("Contact Us Saved Success");
                } else {

                }
            }
            alert('successful email send.');
            $scope.form = {};
            console.log('successful email send.');
            console.log('status: ' + status);
            console.log('data: ' + data);
            console.log('headers: ' + headers);
            console.log('config: ' + config);
        }).error(function (data, status, headers, config) {
            console.log('error sending email.');
            console.log('status: ' + status);
        });
    }

    var restCallManager = new RestCallManager();
    restCallManager.post( getGeneralSettings, $http, null , "getGeneralSettings");
    function getGeneralSettings(result , status , success) {
        if (success) {
            $rootScope.generalSettings = result[0];
            $scope.myInterval = $rootScope.generalSettings.carouselInterval * 1000;
            console.log($rootScope.generalSettings);
        } else {

        }
    }

    $scope.$watch(function () {
        return $window.scrollY;
    }, function (scrollY) {
   $scope.scrollY = scrollY;
    });

    $rootScope.showNav = false;
    $rootScope.toggleNav = function (){
        console.log("Toggling ? ");
        $scope.showNav = !$scope.showNav;
    }

    $rootScope.navHoverIn = function(){
        console.log("Hover In");
        $rootScope.navHoverEdit = true;
    };

    $rootScope.navHoverOut = function(){
        console.log("Hover In");
       // $scope.navHoverEdit = false;
    };

    $rootScope.showSideProjects = false;
    $rootScope.toggleSideMenu = function(show){
        $rootScope.showSideProjects = show;
    }


    console.log($window.location);
}]);


publicApp.controller('publicCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' ,  function($scope , $http , anchorSmoothScroll , $location , $rootScope) {

    $scope.noWrapSlides = false;
    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $rootScope.imProjected = false;

    $scope.getImagePath = function(item){
        if($scope.selectedTestimonial.id == item.id){
            return item.imagePath;
        }else{
            return item.blackImagePath;
        }
    }

    $scope.gotoElement = function (eID){
        console.log("scroling to ",eID);
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash(eID);

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);

    };

    $scope.$watch('activeCategoryFilterId' , function(){
      if($scope.allCategories){
          $scope.projects = $scope.allCategories[$scope.activeCategoryFilterId];
      }

    });

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
        $scope.allCategories = {};
        if (success) {
            result.forEach(function(project){
                if(!$scope.allCategories.hasOwnProperty(project.categoryId)){
                    $scope.allCategories[project.categoryId] = [];
                }
                if(project.featured){
                    $scope.allCategories[project.categoryId].push(project);
                }

            });

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

            console.log("This is my projects original , " , $scope.allCategories);


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

publicApp.controller('publicProjectViewCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' , '$routeParams' , '$window',  function($scope , $http , anchorSmoothScroll , $location , $rootScope , $routeParams , $window) {
    $rootScope.showSideProjects = false;
    $scope.currentPage = 0;
    console.log($rootScope.showSideProjects);
    $window.scrollTo(0,0)
    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    $scope.hoverTesteminalIn = function(item){
       $scope.hoveredTestimonal = item;
    };

    $scope.hoverTesteminalOut = function(item){
        $scope.hoveredTestimonal = {};
    };


    var projectId = $routeParams.projectId;
    $rootScope.imProjected = true;
    if(true){
        var restCallManager = new RestCallManager();
        restCallManager.post(getProject , $http, projectId , "getProject");
        function getProject(result , status , success) {
            if (success) {
                if(result.length > 0){
                    $scope.selectedProject = result[0];
                    console.log("This is my Selected Project ",$scope.selectedProject);
                    var restCallManager = new RestCallManager();
                    restCallManager.post(getAllProjects , $http, null , "getProjects");
                    function getAllProjects(result1 , status , success) {
                        $scope.projects = result1;
                        console.log($scope.projects);
                        $scope.mySideProjects = [];
                        if (success) {
                            result1.forEach(function(project){
                                console.log(project.subCategoryId);
                                console.log($scope.selectedProject.subCategoryId);
                               if(project.subCategoryId == $scope.selectedProject.subCategoryId && project.id != $scope.selectedProject.id){
                                   console.log("Pushing !!!!!!!!!!!!!");
                                   project.slides = getMiniCarousel(project);
                                   $scope.mySideProjects.push(project);
                               }

                               $scope.slides = getMiniCarousel($scope.selectedProject);
                                console.log("This is my slides ",$scope.slides);

                            });
                            console.log("This is my projects original , " , $scope.mySideProjects);
                        } else {

                        }
                    }
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

    function getMiniCarousel(project){
        var array = [];
        if(project.miniCarouselImage1){
            array.push(project.miniCarouselImage1)
        }

        if(project.miniCarouselImage2){
            array.push(project.miniCarouselImage2)
        }

        if(project.miniCarouselImage3){
            array.push(project.miniCarouselImage3)
        }

        if(project.miniCarouselImage4){
            array.push(project.miniCarouselImage4)
        }

        if(project.miniCarouselImage5){
            array.push(project.miniCarouselImage5)
        }

        if(project.miniCarouselImage6){
            array.push(project.miniCarouselImage6)
        }

        return array;
    }






}]);