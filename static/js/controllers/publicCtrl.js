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

    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $rootScope.scrollAnimationDucration = 8000;
    $rootScope.scrollStiffness = 10;
    $rootScope.scrollYFrom = 300;


    $scope.setFormScope= function(scope){
        this.contactUsForm = scope;
    }

    $scope.sendMail = function(info) {
        $rootScope.submitted = true;

        if(!this.contactUsForm.$valid){
            $rootScope.validateAll = true;
            return;
        }else{
            $rootScope.validateAll = false;
        }


        if(info.howCanWeHelp == undefined){
            info.howCanWeHelp = "";
        }

        if(info.email == undefined){
            info.emailToSent = "לא השאירו מייל";
        }else{
            info.emailToSent = info.email;
        }



        $rootScope.sendingMail = true;
        emailjs.init("user_Z8mRIlQBfdHB3FmQswOFC");
        emailjs.send("gmail","template_rhVwgmtA",{ name:  info.fullName , phone: info.phone , email: info.emailToSent , freeText:info.howCanWeHelp ,notes: "Check this out!" , to_email : "etayschur.dev@gmail.com"})
            .then(function(response) {
                $rootScope.sendingMail = false;
                console.log("Send mail true");
                $rootScope.mailSent = true;
                console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
            }, function(err) {
                $rootScope.sendingMail = false;
                console.log("FAILED. error=", err);
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

    $rootScope.showNav = true;
    $rootScope.imTopped = true;
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


publicApp.controller('publicCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' , 'CategoriesService' , '$window', '$timeout' ,  function($scope , $http , anchorSmoothScroll , $location , $rootScope , CategoriesService , $window , $timeout) {
    $window.scrollTo(0,0);
    $scope.justChecing = "just checking";
    $scope.scrollingSettings = {};
    $rootScope.mailSent = false;
    $scope.noWrapSlides = false;
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
          CategoriesService.setActiveCategory($scope.activeCategoryFilterId);
      }

    });

    $scope.setActiveCategoryFilter = function(category , nextCategoryIndex){
        // if($scope.currentCategoryIndex < nextCategoryIndex) {
        //     $scope.moveToLeft = true;
        //     $scope.fadeMeOutLeft = true;
        // }else{
        //     $scope.moveToLeft = false;
        //     $scope.fadeMeOutRight = true;
        // }
        $scope.zoomOut = true;
        $timeout(function() {
            // if($scope.moveToLeft){
                $scope.zoomOut = false;
                $scope.zoomIn = true;
            // }else{
            //     $scope.fadeMeOutRight = false;
            //     $scope.fadeMeInLeft = true;
            //     $scope.fadeMeInRight = false;
            // }

            $scope.activeCategoryFilterId = category.id;
            $scope.currentCategoryIndex = nextCategoryIndex;
        } , 300)
    }

    $timeout(function() {
      $scope.lazyHide = true;
    } , 500)


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






    $scope.botToTopDelayedAnimation = function(flagRight , flagLeft , rightElementId , leftElementId){
        if(!$scope.scrollingSettings[flagRight]){
            console.log("Flag Delayed ",flagRight);
            $scope.scrollingSettings[flagRight] = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: $rootScope.scrollYFrom },
                    to: { x: 0, y: 0 },
                    duration: $rootScope.scrollAnimationDucration,
                    stiffness: $rootScope.scrollStiffness
                }).applyTo(document.querySelectorAll("." + rightElementId));

                $timeout(function() {
                    console.log("Showing Left Ele");
                    bounce
                        .translate({
                            from: { x:0, y: $rootScope.scrollYFrom },
                            to: { x: 0, y: 0 },
                            duration: $rootScope.scrollAnimationDucration,
                            stiffness: $rootScope.scrollStiffness,
                        }).applyTo(document.querySelectorAll("." + leftElementId));
                    $scope.scrollingSettings[flagLeft] = true;
                } , 50)


        }


    }


    $scope.botToTopAnimation = function(flag , elementId){
        console.log("showing Flag ! ",flag);
        if(!$scope.scrollingSettings[flag]){
            $scope.scrollingSettings[flag] = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: $rootScope.scrollYFrom },
                    to: { x: 0, y: 0 },
                    duration: $rootScope.scrollAnimationDucration ,
                    stiffness: $rootScope.scrollStiffness
                }).applyTo(document.querySelectorAll("." + elementId));
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
        $scope.allCategories = {};
        if (success) {
            result.forEach(function(project){
                if(!$scope.allCategories.hasOwnProperty(project.categoryId)){
                    $scope.allCategories[project.categoryId] = [];
                }
                if(project.featured == 1){
                    $scope.allCategories[project.categoryId].push(project);
                }

            });

            var restCallManager = new RestCallManager();
            restCallManager.post(getCategories , $http, null , "getCategories");
            function getCategories(result , status , success) {
                if (success) {
                    $scope.categories = result;
                    if($scope.categories.length > 0){
                        if( CategoriesService.getActiveCategory() == null ){
                            $scope.activeCategoryFilterId = $scope.categories[0].id;
                            $scope.currentCategoryIndex = 0;
                        }else{
                            $scope.activeCategoryFilterId =  CategoriesService.getActiveCategory();
                        }
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

publicApp.controller('publicProjectViewCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' , '$routeParams' , '$window' , '$timeout',  function($scope , $http , anchorSmoothScroll , $location , $rootScope , $routeParams , $window , $timeout) {
    $rootScope.showSideProjects = false;
    $window.scrollTo(0,0)
    $rootScope.mailSent = false;
    $scope.minIndex = 0;
    $scope.sideBarLimitItems = 5;
    $scope.scrollingSettings = {};
    $rootScope.imProjected = true;
    console.log($rootScope.showSideProjects);

    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $rootScope.showNav = false;




    $scope.currentPage = 0;
    $scope.pageSize = 3;

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    $scope.hoverTesteminalIn = function(item){
       $scope.hoveredTestimonal = item;
    };

    $scope.hoverTesteminalOut = function(item){
        $scope.hoveredTestimonal = {};
    };

    $scope.navToProject = function(projectId){
        $location.path('/'+projectId);
    }


    var projectId = $routeParams.projectId;

    if(true){
        var restCallManager = new RestCallManager();
        restCallManager.post(getProject , $http, projectId , "getProject");
        function getProject(result , status , success) {
            if (success) {
                if(result.length > 0){
                    $scope.selectedProject = result[0];

                    var restMiniProjectCallManager = new RestCallManager();
                    restMiniProjectCallManager.post(getMiniProjects , $http, $scope.selectedProject.subCategoryId , "getMiniProjects");
                    function getMiniProjects(result , status , success) {
                        if (success) {

                            $rootScope.miniProjects = result;
                            for ( var i = 0 ; i < $rootScope.miniProjects.length ; i++){
                                if(i < $scope.pageSize){
                                    $rootScope.miniProjects[i].showMe = true;
                                }
                            }
                            console.log("My Mioni Projects ", $rootScope.miniProjects);
                        } else {

                        }
                    }


                    console.log("This is my Selected Project ",$scope.selectedProject);
                    var restCallManager = new RestCallManager();
                    restCallManager.post(getAllProjects , $http, null , "getProjects");
                    function getAllProjects(result1 , status , success) {
                        $scope.projects = result1;
                        console.log($scope.projects);
                        $rootScope.mySideProjects = [];
                        $rootScope.otherProjects = [];
                        if (success) {
                            var index = 0;
                            var counter = 0;
                            result1.forEach(function(project){
                               if(project.subCategoryId == $scope.selectedProject.subCategoryId){
                                   project.slides = getMiniCarousel(project);

                                   $rootScope.mySideProjects.push(project);
                                   counter++;
                               }

                                if(project.subCategoryId != $scope.selectedProject.subCategoryId){
                                    $rootScope.otherProjects.push(project);
                                    counter++;
                                }



                               $scope.slides = getMiniCarousel($scope.selectedProject);

                            });
                        } else {

                        }
                    }


                    var restCallManagerSubCategory = new RestCallManager();
                    restCallManagerSubCategory.post( cb , $http, $scope.selectedProject.subCategoryId , "getSubCategory");
                    function cb(result2 , status , success) {
                        if (success) {
                            $scope.subCategory = result2[0];
                            console.log("i have desc ? ",$scope.subCategoryDesc);
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


    $scope.botToTopDelayedAnimation = function(flagRight , flagLeft , rightElementId , leftElementId){
        if(!$scope.scrollingSettings[flagRight]){
            console.log("Flag Delayed ",flagRight);
            console.log("flagLefT ",flagLeft);
            $scope.scrollingSettings[flagRight] = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: $rootScope.scrollYFrom },
                    to: { x: 0, y: 0 },
                    duration: $rootScope.scrollAnimationDucration,
                    stiffness: $rootScope.scrollStiffness
                }).applyTo(document.querySelectorAll("." + rightElementId));

            $timeout(function() {
                console.log("Showing Left Ele");
                bounce
                    .translate({
                        from: { x:0, y: $rootScope.scrollYFrom },
                        to: { x: 0, y: 0 },
                        duration: $rootScope.scrollAnimationDucration,
                        stiffness: $rootScope.scrollStiffness,
                    }).applyTo(document.querySelectorAll("." + leftElementId));
                $scope.scrollingSettings[flagLeft] = true;
            } , 50)


        }


    }

    $scope.botToTopAnimationMiniProjects = function(flag,elementId){
        $scope.lazyHide = false;
        $scope.botToTopAnimation(flag,elementId);
    }


    $scope.botToTopAnimation = function(flag , elementId){
        console.log("showing Flag ! ",flag);
        if(!$scope.scrollingSettings[flag]){
            $scope.scrollingSettings[flag] = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: $rootScope.scrollYFrom },
                    to: { x: 0, y: 0 },
                    duration: $rootScope.scrollAnimationDucration,
                    stiffness: $rootScope.scrollStiffness
                }).applyTo(document.querySelectorAll("." + elementId));
        }
    }




}]);