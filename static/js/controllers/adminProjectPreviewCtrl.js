/**
 * Created by EtaySchur on 23/10/2016.
 */
app.controller('adminProjectViewCtrl', ['$scope', '$http', 'anchorSmoothScroll', '$location', '$rootScope', '$routeParams', '$window', '$timeout', function ($scope, $http, anchorSmoothScroll, $location, $rootScope, $routeParams, $window, $timeout) {
    $rootScope.showSideProjects = false;
    $window.scrollTo(0, 0)
    $rootScope.mailSent = false;
    $scope.minIndex = 0;
    $scope.sideBarLimitItems = 5;
    $scope.scrollingSettings = {};
    $rootScope.imProjected = true;
    console.log($rootScope.showSideProjects);

    $scope.hoverIn = function () {
        this.hoverEdit = true;
    };

    $rootScope.showNav = false;


    $timeout(function () {
        $scope.lazyHide = true;
    }, 500)

    $scope.currentPage = 0;
    $scope.pageSize = 3;

    $scope.hoverOut = function () {
        this.hoverEdit = false;
    };

    $scope.hoverTesteminalIn = function (item) {
        $scope.hoveredTestimonal = item;
    };

    $scope.hoverTesteminalOut = function (item) {
        $scope.hoveredTestimonal = {};
    };

    $scope.navToProject = function (projectId) {
        $location.path('/' + projectId);
    }


    var projectId = $routeParams.projectId;

    if (true) {
        var restCallManager = new RestCallManager();
        restCallManager.post(getProject, $http, projectId, "getProject");
        function getProject(result, status, success) {
            if (success) {
                if (result.length > 0) {
                    $scope.selectedProject = result[0];
                    console.log("SELECTED ? ",$scope.selectedProject)
                    var restMiniProjectCallManager = new RestCallManager();
                    restMiniProjectCallManager.post(getMiniProjects, $http, $scope.selectedProject.subCategoryId, "getMiniProjects");
                    function getMiniProjects(result, status, success) {
                        if (success) {

                            $rootScope.miniProjects = result;
                            for (var i = 0; i < $rootScope.miniProjects.length; i++) {
                                if (i < $scope.pageSize) {
                                    $rootScope.miniProjects[i].showMe = true;
                                }
                            }
                            console.log("My Mioni Projects ", $rootScope.miniProjects);
                        } else {

                        }
                    }


                    console.log("This is my Selected Project ", $scope.selectedProject);
                    var restCallManager = new RestCallManager();
                    restCallManager.post(getAllProjects, $http, null, "getProjects");
                    function getAllProjects(result1, status, success) {
                        $scope.projects = result1;
                        console.log($scope.projects);
                        $rootScope.mySideProjects = [];
                        $rootScope.otherProjects = [];
                        if (success) {
                            var index = 0;
                            var counter = 0;
                            $rootScope.mySideProjects.push($scope.selectedProject);
                            result1.forEach(function (project) {
                                if (project.subCategoryId == $scope.selectedProject.subCategoryId && project.id != $scope.selectedProject.id) {
                                    project.slides = getMiniCarousel(project);

                                    $rootScope.mySideProjects.push(project);
                                    counter++;
                                }

                                if (project.subCategoryId != $scope.selectedProject.subCategoryId) {
                                    $rootScope.otherProjects.push(project);
                                    counter++;
                                }
                                $scope.slides = getMiniCarousel($scope.selectedProject);
                            });
                        } else {

                        }
                    }


                    var restCallManagerSubCategory = new RestCallManager();
                    restCallManagerSubCategory.post(cb, $http, $scope.selectedProject.subCategoryId, "getSubCategory");
                    function cb(result2, status, success) {
                        if (success) {
                            $scope.subCategory = result2[0];
                            console.log("i have desc ? ", $scope.subCategoryDesc);
                        } else {

                        }
                    }
                } else {
                    $location.path('/');
                }
            } else {

            }
        }
    } else {

        console.log("This is my projects!!!!!!!!!!!!!!!!!!565656!!!!!!!!!", $rootScope.selectedProject);

    }


    function getSelectedProject(projectId) {
        for (var i = 0; i < $scope.projects.length; i++) {
            if ($scope.projects[i].id = projectId) {
                return $scope.projects[i];
                break;
            }
        }
        return null;
    }

    function getMiniCarousel(project) {
        var array = [];
        if (project.miniCarouselImage1) {
            array.push(project.miniCarouselImage1)
        }

        if (project.miniCarouselImage2) {
            array.push(project.miniCarouselImage2)
        }

        if (project.miniCarouselImage3) {
            array.push(project.miniCarouselImage3)
        }

        if (project.miniCarouselImage4) {
            array.push(project.miniCarouselImage4)
        }

        if (project.miniCarouselImage5) {
            array.push(project.miniCarouselImage5)
        }

        if (project.miniCarouselImage6) {
            array.push(project.miniCarouselImage6)
        }

        return array;
    }

    $scope.popInAnimation = function (flag, elemId) {
        if (!$scope.scrollingSettings[flag]) {
            $scope.scrollingSettings[flag] = true;
            var bounce = new Bounce();
            bounce
                .scale({
                    from: {x: 0.7, y: 1},
                    to: {x: 1, y: 1},
                    duration: 3000,
                    stiffness: 3,
                    bounces: 1
                }).applyTo(document.querySelectorAll("." + elemId));
        }
    }


    $scope.botToTopDelayedAnimation = function (flagRight, flagLeft, rightElementId, leftElementId, isImage) {
        if (!$scope.scrollingSettings[flagRight]) {
            // console.log("Flag Delayed ",flagRight);
            // console.log("flagLefT ",flagLeft);
            $scope.scrollingSettings[flagRight] = true;
            if (isImage) {
                var bounce = new Bounce();
                bounce
                    .scale({
                        from: {x: 0.5, y: 0.5},
                        to: {x: 1, y: 1},
                        duration: 3000,
                        bounces: 1,
                        stiffness: 3
                    }).applyTo(document.querySelectorAll("." + rightElementId));
            } else {
                var bounce = new Bounce();
                bounce
                    .translate({
                        from: {x: 0, y: $rootScope.scrollYFrom},
                        to: {x: 0, y: 0},
                        duration: $rootScope.scrollAnimationDucration,
                        stiffness: $rootScope.scrollStiffness
                    }).applyTo(document.querySelectorAll("." + rightElementId));
            }

            $timeout(function () {
                var bounce = new Bounce();
                console.log("Showing Left Ele");
                bounce
                    .translate({
                        from: {x: 0, y: $rootScope.scrollYFrom},
                        to: {x: 0, y: 0},
                        duration: $rootScope.scrollAnimationDucration,
                        stiffness: $rootScope.scrollStiffness,
                    }).applyTo(document.querySelectorAll("." + leftElementId));
                $scope.scrollingSettings[flagLeft] = true;
            }, 100)


        }


    }

    $scope.botToTopAnimationMiniProjects = function (flag, elementId) {
        if ($scope.lazyHide) {
            console.log("Minig Projects Images Raw");
            $scope.lazyHide = false;
            $scope.botToTopAnimation(flag, elementId);
        }

    }


    $scope.botToTopAnimation = function (flag, elementId) {
        // console.log("showing Flag ! ",flag);
        if (!$scope.scrollingSettings[flag]) {
            $scope.scrollingSettings[flag] = true;
            var bounce = new Bounce();
            bounce
                .translate({
                    from: {x: 0, y: $rootScope.scrollYFrom},
                    to: {x: 0, y: 0},
                    duration: $rootScope.scrollAnimationDucration,
                    stiffness: $rootScope.scrollStiffness
                }).applyTo(document.querySelectorAll("." + elementId));
        }
    }


}]);