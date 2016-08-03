/**
 * Created by EtaySchur on 27/03/2016.
 */
app.controller('publicProjectViewCtrl', ['$scope', '$http' , 'anchorSmoothScroll' , '$location' , '$rootScope' , '$routeParams' , '$window' , '$timeout',  function($scope , $http , anchorSmoothScroll , $location , $rootScope , $routeParams , $window , $timeout) {
    $rootScope.showSideProjects = false;
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
        $scope.nextAnimation = true;
        $rootScope.miniProjects[$scope.minIndex].animated = true;
        $rootScope.miniProjects[$scope.minIndex].fadeOutLeft = true;

        //$rootScope.miniProjects[$scope.minIndex + 1].animated = true;
        //$rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = true;
        //$rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        //$rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = true;

        $timeout(function() {
            $rootScope.miniProjects[$scope.minIndex].fadeOutLeft = false;
            $rootScope.miniProjects[$scope.minIndex].animated = false;
            $rootScope.miniProjects[$scope.minIndex].showMe = false;

            $timeout(function() {
                $rootScope.miniProjects[$scope.minIndex + 1].animated = true;
                $rootScope.miniProjects[$scope.minIndex + 1].fadeIn = true;
                $rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = false;

                $rootScope.miniProjects[$scope.minIndex + 2].animated = true;
                $rootScope.miniProjects[$scope.minIndex + 2].fadeIn = true;
                $rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = false;


                $rootScope.miniProjects[$scope.minIndex + 3].fadeInRight = true;
                $rootScope.miniProjects[$scope.minIndex + 3].animated = true;
                $rootScope.miniProjects[$scope.minIndex + 3].showMe = true;

                $rootScope.miniProjects[$scope.minIndex + 3].fadeInRight = false;
                $rootScope.miniProjects[$scope.minIndex + 3].animated = false;
                $scope.minIndex += 1;
            } , 600)

        }, 600);
    }

    $scope.prevPage = function(){
        if( $scope.minIndex == 0){
            return;
        }


        $scope.nextAnimation = true;
        $rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        $rootScope.miniProjects[$scope.minIndex + 2].fadeOutRight = true;

        //$rootScope.miniProjects[$scope.minIndex + 1].animated = true;
        //$rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = true;
        //$rootScope.miniProjects[$scope.minIndex + 2].animated = true;
        //$rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = true;

        $timeout(function() {
            $rootScope.miniProjects[$scope.minIndex + 2].fadeOutRight = false;
            $rootScope.miniProjects[$scope.minIndex + 2].animated = false;
            $rootScope.miniProjects[$scope.minIndex + 2].showMe = false;

            $timeout(function() {
                //$rootScope.miniProjects[$scope.minIndex + 1].animated = true;
                //$rootScope.miniProjects[$scope.minIndex + 1].fadeIn = true;
                //$rootScope.miniProjects[$scope.minIndex + 1].fadeOutLeft = false;
                //
                //$rootScope.miniProjects[$scope.minIndex + 2].animated = true;
                //$rootScope.miniProjects[$scope.minIndex + 2].fadeIn = true;
                //$rootScope.miniProjects[$scope.minIndex + 2].fadeOutLeft = false;


                $rootScope.miniProjects[$scope.minIndex - 1].fadeInLeft = true;
                $rootScope.miniProjects[$scope.minIndex - 1].animated = true;
                $rootScope.miniProjects[$scope.minIndex - 1].showMe = true;

                //$rootScope.miniProjects[$scope.minIndex + 3].fadeInRight = false;
                //$rootScope.miniProjects[$scope.minIndex + 3].animated = false;
                $scope.minIndex -= 1;
            } , 600)

        }, 600);

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