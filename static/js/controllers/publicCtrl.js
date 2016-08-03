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



    $scope.setFormScope= function(scope){
        this.contactUsForm = scope;
    }

    $scope.sendMail = function(info) {
        $rootScope.submitted = true;
        //var restCallManager = new RestCallManager();
        //restCallManager.post( getGeneralSettings, $http, null , "sendEmail");
        //function getGeneralSettings(result , status , success) {
        //    if (success) {
        //        $rootScope.mailSent = true;
        //    } else {
        //
        //    }
        //}
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



        //console.log(info);
        //var mailJSON = {
        //    "key": "uISeYrp55OvaS7WaxGuA3A",
        //    "message": {
        //        "text": "שם : "+info.fullName +
        //        "טלפון : "+info.phone +
        //        "אי מייל "+info.email +
        //        "איך אתה יכול לעזור "+info.howCanWeHelp,
        //        "subject": "שעאמיט יקר , מישהו השאיר את הפרטים שלו באתר",
        //        "from_email": "noreply@fooddelivery.com",
        //        "from_name": "New Order",
        //        "to": [
        //            {
        //                "email": "etayschur@gmail.com",
        //                "name": "New Order",
        //                "type": "to"
        //            }
        //        ],
        //        "important": true
        //    }
        //};
        //var apiURL = "https://mandrillapp.com/api/1.0/messages/send.json";
        //$http.post(apiURL, mailJSON).
        //success(function (data, status, headers, config) {
        //    var restCallManager = new RestCallManager();
        //    restCallManager.post( insertContactUs, $http, info , "insertContactUs");
        //    function insertContactUs(result , status , success) {
        //        if (success) {
        //            $rootScope.mailSent = true;
        //            console.log("Contact Us Saved Success");
        //        } else {
        //
        //        }
        //    }
        //    $scope.form = {};
        //    console.log('successful email send.');
        //    console.log('status: ' + status);
        //    console.log('data: ' + data);
        //    console.log('headers: ' + headers);
        //    console.log('config: ' + config);
        //}).error(function (data, status, headers, config) {
        //    console.log('error sending email.');
        //    console.log('status: ' + status);
        //});
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
    $rootScope.mailSent = false;
    $window.scrollTo(0,0)
    $scope.noWrapSlides = false;
    $rootScope.showRightSection = false;
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



    $rootScope.boxVisible = false;

    var whoWeAreBreakPoint = new Waypoint({
        element: document.getElementById('textScroll'),
        handler: function(direction) {
           $rootScope.whoWeAreAnimation();
            console.log("IM ON THAT DIV");
        },
        offset: 0
    })

    var projectsSectionWaypoint = new Waypoint({
        element: document.getElementById('projectSectionDiv'),
        handler: function(direction) {
            $rootScope.botToTopAnimation();
            console.log("IM ON THAT DIV");
        },
        offset: 0
    })


    $rootScope.botToTopAnimation = function(){
        if(!$scope.showProjectsSection){
            $scope.showProjectsSection = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: 200 },
                    to: { x: 0, y: 0 },
                    duration: 2000,
                    stiffness: 4
                }).applyTo(document.querySelectorAll(".projectSectionDiv"));
        }
    }

    $rootScope.whoWeAreAnimation = function () {
        console.log("Fire !");
        if(!$scope.showWhoWeAre){
            $scope.showWhoWeAre = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: 200 },
                    to: { x: 0, y: 0 },
                    duration: 3000,
                    stiffness: 4
                }).applyTo(document.querySelectorAll(".text-animation-target"));



            $rootScope.showRightSection = true;

            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: 200 },
                    to: { x: 0, y: 0 },
                    duration: 3000,
                    delay: 150,
                    stiffness: 4
                }).applyTo(document.querySelectorAll(".animation-right"));

            $rootScope.showLeftSection = true;

            var bounce = new Bounce();
            bounce
                .translate({
                    from: { x:0, y: 200 },
                    to: { x: 0, y: 0 },
                    duration: 3000,
                    delay: 250,
                    stiffness: 4
                }).applyTo(document.querySelectorAll(".animation-left"));
        }
    }



    $rootScope.showIt = function() {
        $rootScope.boxVisible = true;
        for(var i = 0 ; i < 2 ;i++){
            var bounce = new Bounce();
            if(i === 0){
                $rootScope.boxVisible0 = true; // show it, then apply anim
                bounce
                    .translate({
                        from: { x: 300, y: 0 },
                        to: { x: 0, y: 0 },
                        duration: 2000,
                        stiffness: 4
                    })
                    .scale({
                        from: { x: 1, y: 1 },
                        to: { x: 0.1, y: 2.3 },
                        easing: "sway",
                        duration: 2000,
                        delay: 500,
                        stiffness: 2
                    })
            }

            if(i === 1) {
                $rootScope.boxVisible1 = true; // show it, then apply anim
                    bounce
                        .translate({
                            from: { x: 0, y: -300 },
                            to: { x: 0, y: 0 },
                            delay: 100,
                            duration: 2000,
                            stiffness: 4
                        })
                        .scale({
                            from: { x: 1, y: 1 },
                            to: { x: 0.1, y: 2.3 },
                            easing: "sway",
                            duration: 2000,
                            delay: 500,
                            stiffness: 2
                        })
            }

            bounce.applyTo(document.querySelectorAll(".clickable" + i));
        }

    };




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
    $rootScope.mailSent = false;
    $scope.minIndex = 0;
    $scope.sideBarLimitItems = 5;

    $rootScope.imProjected = true;
    console.log($rootScope.showSideProjects);
    $window.scrollTo(0,0)
    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };




    $rootScope.showNav = false;
    $scope.nextPage = function(){
        // $scope.nextAnimation = true;
        // $rootScope.miniProjects[$scope.minIndex].animated = true;
        // $rootScope.miniProjects[$scope.minIndex].fadeOutLeft = true;
        //
        // //$rootScope.miniProjects[$scope.minIndex + 1].animated = true;
        // //$rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = true;
        // //$rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        // //$rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = true;
        //
        // $timeout(function() {
        //     $rootScope.miniProjects[$scope.minIndex].fadeOutLeft = false;
        //     $rootScope.miniProjects[$scope.minIndex].animated = false;
        //     $rootScope.miniProjects[$scope.minIndex].showMe = false;
        //
        //     $timeout(function() {
        //         $rootScope.miniProjects[$scope.minIndex + 1].animated = true;
        //         $rootScope.miniProjects[$scope.minIndex + 1].fadeIn = true;
        //         $rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = false;
        //
        //         $rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        //         $rootScope.miniProjects[$scope.minIndex + 2].fadeIn = true;
        //         $rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = false;
        //
        //
        //         $rootScope.miniProjects[$scope.minIndex + 3].fadeInRight = true;
        //         $rootScope.miniProjects[$scope.minIndex + 3].animated = true;
        //         $rootScope.miniProjects[$scope.minIndex + 3].showMe = true;
        //
        //         $rootScope.miniProjects[$scope.minIndex + 3].fadeInRight = false;
        //         $rootScope.miniProjects[$scope.minIndex + 3].animated = false;
        //         $scope.minIndex += 1;
        //     } , 600)
        //
        // }, 600);
    }

    $scope.prevPage = function(){
        // if( $scope.minIndex == 0){
        //     return;
        // }
        //
        //
        // $scope.nextAnimation = true;
        // $rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        // $rootScope.miniProjects[$scope.minIndex + 2].fadeOutRight = true;
        //
        // //$rootScope.miniProjects[$scope.minIndex + 1].animated = true;
        // //$rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = true;
        // //$rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        // //$rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = true;
        //
        // $timeout(function() {
        //     $rootScope.miniProjects[$scope.minIndex + 2].fadeOutRight = false;
        //     $rootScope.miniProjects[$scope.minIndex + 2].animated = false;
        //     $rootScope.miniProjects[$scope.minIndex + 2].showMe = false;
        //
        //     $timeout(function() {
        //         //$rootScope.miniProjects[$scope.minIndex + 1].animated = true;
        //         //$rootScope.miniProjects[$scope.minIndex + 1].fadeIn = true;
        //         //$rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = false;
        //         //
        //         //$rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        //         //$rootScope.miniProjects[$scope.minIndex + 2].fadeIn = true;
        //         //$rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = false;
        //
        //
        //         $rootScope.miniProjects[$scope.minIndex - 1].fadeInLeft = true;
        //         $rootScope.miniProjects[$scope.minIndex - 1].animated = true;
        //         $rootScope.miniProjects[$scope.minIndex - 1].showMe = true;
        //
        //         //$rootScope.miniProjects[$scope.minIndex + 3].fadeInRight = false;
        //         //$rootScope.miniProjects[$scope.minIndex + 3].animated = false;
        //         $scope.minIndex -= 1;
        //     } , 600)
        //
        // }, 600);

        //$scope.nextAnimation = false;
        //$scope.minIndex -= 1;
        //console.log($scope.minIndex);
        //$timeout(function() {
        //    $rootScope.miniProjects[$scope.minIndex + 3].showMe = false;
        //    $timeout(function() {
        //        $rootScope.miniProjects[$scope.minIndex].showMe = true;
        //    }, 300);
        //}, 800);
        //
        //$scope.currentPage -= 1;
    }


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
                                console.log(project.subCategoryId);
                                console.log($scope.selectedProject.subCategoryId);
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