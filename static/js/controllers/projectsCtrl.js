/**
 * Created by EtaySchur on 23/11/2015.
 */

app.controller('ProjectsCtrl', ['$scope', '$http' ,  '$uibModal' , '$log' , function($scope , $http , $uibModal , $log) {
    $scope.animationsEnabled = true;

$scope.togglePublish = function (item){
    item.published = !item.published;
    var restCallManager = new RestCallManager();
    restCallManager.post( cb , $http, item , "updateObject" , "projects");
    function cb(result , status , success) {
        if (success) {
            if(item.published){
                alertMe( "success" ,"Publish  Project Success");
            }else{
                alertMe( "success" ,"Un publish  Project Success");
            }

        } else {
            alertMe( "danger" ,"Delete Mini Project Fail");
        }
    }


}

    var restCallManager = new RestCallManager();
    restCallManager.post(callback , $http, null , "getProjects");
    function callback(result , status , success) {
        if (success) {
            $scope.projects = result;
            var restCallManager = new RestCallManager();
            restCallManager.post(getCategoriesCallback , $http, null , "getCategories");
            function getCategoriesCallback(result , status , success) {
                if (success) {
                    $scope.categories = result;
                    for(var i = 0 ; i <  $scope.projects.length ; i++){
                        $scope.getTitles($scope.projects[i]);
                    }

                } else {
                }
            }

        }
    }

    $scope.getTitles = function(item){
       $scope.initCategoryName(item);
    }

    $scope.openEditProjectModal = function(size , project){
        if(project.id){
            var isNew = false;
        }else{
            var isNew = true;
        }
        console.log("Edit this project ", project);
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'editProjectModal.html',
            controller: 'EditProjectModalCtrl',
            size : 'lg',
            resolve: {
                item: function () {
                    return project;
                },
                categories : function(){
                    return $scope.categories
                }
            }
        });

        modalInstance.result.then(function (editedProject) {
            refreshProjects();
            function refreshProjects(){
                var restCallManager = new RestCallManager();
                restCallManager.post(callbackMe , $http, null , "getProjects");
                function callbackMe(result , status , success) {
                    if (success) {
                        console.log("Override PROJECTS ??");
                        $scope.projects = result;
                    }
                }
            }
        });
    }



    $scope.initCategoryName = function(item){
        if($scope.categories != undefined){
            for(var i = 0 ; i < $scope.categories.length ; i++){
                if($scope.categories[i].id == item.categoryId){
                    item.categoryTitle = $scope.categories[i].title;
                    for(var j = 0 ; j < $scope.categories[i].subCategories.length ; j++){
                        if($scope.categories[i].subCategories[j].id === item.subCategoryId){
                            item.subCategoryTitle = $scope.categories[i].subCategories[j].title;

                        }
                    }

                }
            }
        }else{
        }

    }

    $scope.getCategoryName = function(categoryId){
        if($scope.categories != undefined){
            for(var i = 0 ; i < $scope.categories.length ; i++){
                if($scope.categories[i].id === categoryId){
                    return $scope.categories[i].title;
                    break;
                }
            }
        }

    }

    $scope.addNewProject = function(){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addNewProjectModal.html',
            controller: 'ProjectModalCtrl',
            resolve: {
                item: function () {
                    return null;
                },
                categories : function(){
                    return $scope.categories
                }
            }
        });

        modalInstance.result.then(function (project) {
            $scope.projects.push(project);
        });
    }

    $scope.deleteProject = function (project){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteProject.html',
            controller: 'DeleteModalInstanceCtrl',
            resolve: {
                item: function () {
                    return project;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            var restCallManager = new RestCallManager();
            restCallManager.post(deleteCarouselImageCallback , $http, selectedItem , "deleteProject");
            function deleteCarouselImageCallback(result , status , success) {
                if (success) {
                    var index = $scope.projects.indexOf(selectedItem);
                    $scope.projects.splice( index , 1);
                    alertMe( "success" ,"Delete Projecte Success");
                } else {
                    alertMe( "danger" ,"Delete Project Fail");
                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }



}]);




app.controller('CategoriesCtrl', ['$scope',  '$http', '$uibModal' , '$log' ,function($scope , $http , $uibModal, $log) {
    $scope.animationsEnabled = true;
    var restCallManager = new RestCallManager();
    restCallManager.post(getCategoriesCallback , $http, null , "getCategories");
    function getCategoriesCallback(result , status , success) {
        if (success) {
            $scope.categories = result;
        } else {
        }
    }

    $scope.openDeleteCategoryModal = function(size , category){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteCategory.html',
            controller: 'addSubCategoryModalCtrl',
            resolve: {
                item: function () {
                    return category;
                }
            }
        });

        modalInstance.result.then(function (category) {
            var restCallManager = new RestCallManager();
            restCallManager.post(deleteCategoryCallback , $http, category , "deleteCategory");
            function deleteCategoryCallback(result , status , success) {
                if (success) {
                    var index = $scope.categories.indexOf(category);
                    $scope.categories.splice( index , 1);
                    alertMe( "success" ,"Delete Category Success");
                } else {
                    alertMe( "danger" ,"Delete Category Fail");
                }
            }

            category.title = category.title;

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openDeleteSubCategoryModal = function(size , subCategory , category){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteSubCategory.html',
            controller: 'addSubCategoryModalCtrl',
            resolve: {
                item: function () {
                    return subCategory;
                }
            }
        });

        modalInstance.result.then(function ( subCategory) {
            var restCallManager = new RestCallManager();
            restCallManager.post(deleteSubCategoryCallback , $http, subCategory , "deleteSubCategory");
            function deleteSubCategoryCallback(result , status , success) {
                if (success) {
                    var index = category.subCategories.indexOf(subCategory);
                    category.subCategories.splice(index , 1);
                    alertMe( "success" ,"Delete Sub Category Success");
                } else {
                    alertMe( "danger" ,"Delete Sub Category Fail");
                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openEditSubCategoryModal = function(size , subCategory){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'editSubCategory.html',
            controller: 'addSubCategoryModalCtrl',
            resolve: {
                item: function () {
                    return subCategory;
                }
            }
        });

        modalInstance.result.then(function (subCategory) {
            var restCallManager = new RestCallManager();
            restCallManager.post(editSubCategoryTitleCallback , $http, subCategory , "editSubCategoryTitle");
            function editSubCategoryTitleCallback(result , status , success) {
                if (success) {
                    alertMe( "success" ,"Save Category Success");
                } else {
                    alertMe( "danger" ,"Save Category Fail");
                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openEditCategoryModal = function(size , category){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'editCategory.html',
            controller: 'addSubCategoryModalCtrl',
            resolve: {
                item: function () {
                    return category;
                }
            }
        });

        modalInstance.result.then(function (category) {
            var restCallManager = new RestCallManager();
            restCallManager.post(addCategoryCallback , $http, category , "editCategoryTitle");
            function addCategoryCallback(result , status , success) {
                if (success) {

                    alertMe( "success" ,"Save Category Success");
                } else {
                    alertMe( "danger" ,"Save Category Fail");
                }
            }

                category.title = category.title;

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openAddSubCategoryModal = function (size , subCategory , category){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addSubCategory.html',
            controller: 'addSubCategoryModalCtrl',
            resolve: {
                item: function () {
                    return subCategory;
                }
            }
        });


        modalInstance.result.then(function (newSubCategory) {
            var data = {
                newSubCategoryTitle : newSubCategory ,
                category : category
            }
            var restCallManager = new RestCallManager();
            restCallManager.post(addCategoryCallback , $http, data , "addSubCategory");
            function addCategoryCallback(result , status , success) {
                if (success) {
                    newSubCategory.id = result.id;
                    if(category.subCategories == null) {
                        category.subCategories = [];
                    }
                        category.subCategories.push(newSubCategory);

                    alertMe( "success" ,"Add Category Success");
                } else {
                    alertMe( "danger" ,"Add Category Fail");
                }
            }


        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }


    $scope.open = function (size , category) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'addCategory.html',
            controller: 'DeleteModalInstanceCtrl',
            resolve: {
                item: function () {
                    return category;
                }
            }
        });

        modalInstance.result.then(function (newCategory) {
            var restCallManager = new RestCallManager();
            restCallManager.post(addCategoryCallback , $http, newCategory , "addCategory");
            function addCategoryCallback(result , status , success) {
                if (success) {
                    if(category == null){
                        newCategory.id = result.id;
                        $scope.categories.push(newCategory);
                    }else{
                        category.title = newCategory.title;
                    }
                    alertMe( "success" ,"Add Category Success");
                } else {
                    alertMe( "danger" ,"Add Category Fail");
                }
            }


        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);


app.controller('CarouselCtrl', ['$scope' , '$http', '$uibModal' , '$log', 'fileUpload' ,  function($scope , $http , $uibModal, $log , fileUpload) {

    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    $scope.deleteCarouseImage = function(image){
        restCallManager.post(getFormsCallback , $http, image , "deleteCarouselImage");
        function getFormsCallback(result , status , success) {
            if (success) {

            } else {

            }
        }
    }

    $scope.openDeleteModal = function(image){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteCarousel.html',
            controller: 'DeleteModalInstanceCtrl',
            resolve: {
                item: function () {
                    return image;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            var restCallManager = new RestCallManager();
            restCallManager.post(deleteCarouselImageCallback , $http, selectedItem , "deleteCarouselImage");
            function deleteCarouselImageCallback(result , status , success) {
                if (success) {
                  var index = $scope.carouselImages.indexOf(selectedItem);
                    $scope.carouselImages.splice( index , 1);
                    alertMe( "success" ,"Delete Carousel Image Success");
                } else {
                    alertMe( "danger" ,"Delete Carousel Image Fail");
                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




    var restCallManager = new RestCallManager();
    restCallManager.post(getFormsCallback , $http, null , "getCarouselImages");
    function getFormsCallback(result , status , success) {
        if (success) {
            $scope.carouselImages = result;
        } else {

        }
    }

    $scope.animationsEnabled = true;

    $scope.open = function (size , image) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'carousel.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                item: function () {
                    return image;
                }
            }
        });

        modalInstance.result.then(function (newImageItem) {

            if(image == null){
                $scope.carouselImages.push(newImageItem);
            }else{
                image.imagePath = newImageItem.imagePath;
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };



}]);



app.controller('addSubCategoryModalCtrl', function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
        $uibModalInstance.close($scope.item);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

app.controller('DeleteModalInstanceCtrl', function ($scope, $uibModalInstance, item , $http) {
    $scope.item = item;
    $scope.ok = function () {
        $uibModalInstance.close($scope.item);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, item , $upload, $http ) {

    $scope.uploadingImage = false;

    if(item != null){
        $scope.imageId = item.id;
        $scope.image = item;

    }else{
        $scope.imageId = null;
    }

    $scope.ok = function (item) {

        $scope.uploadingImage = true;
        if($scope.newCarouselImage == undefined){

            var restCallManager = new RestCallManager();
            restCallManager.post(callback , $http, item , "editCarouselImage");
            function callback(result , status , success) {
                if (success) {
                    $scope.uploadingImage = false;
                    $uibModalInstance.close(item);
                    alertMe( "success" ,"Edit Carousel Slide Success");
                } else {
                    $scope.uploadingImage = false;
                    alertMe( "danger" ,"Edit Carousel Slide Fail");
                }
            }
        }else{
            console.log("This is my uplaod item ",item);
            $scope.upload = $upload.upload({
                url : 'server/UploadController.php',
                data : {
                    fname : $scope.newCarouselImage.name,
                    action : 'uploadNewCarouselImage',
                    image : item
                },

                file : $scope.newCarouselImage
            }).success(function(data, status, headers, config) {

                // file is uploaded successfully
                var newImage = {
                    'id' : data.id ,
                    'imagePath' : data.imagePath
                }
                alertMe( "success" ,"Create New Carousel Image Success");
                $scope.uploadingImage = false;
                $uibModalInstance.close(newImage);
                return;
            }).error(function(data, status, headers, config){
                alertMe( "danger" ,"My Text");
                $scope.uploadingImage = false;
            });
        }


    };



    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.onCampaignMainImageSelect = function ($files){
        var file = $files[0];

        if (file.type.indexOf('image') == -1) {
            $scope.mainImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
            $scope.mainImageError = true;
            return false;
        }
        $scope.url = URL.createObjectURL(file);
        $scope.newCarouselImage  = $files[0];
    }
});

app.controller('EditProjectModalCtrl', function ($scope, $uibModalInstance, item , $upload , categories, $http ) {
    $scope.tabs = [
        {
            'title' : 'Texts',
            'active' : true
        },
        {
            'title' : 'Images',
            'active' : false
        },
        {
            'title' : 'Extras',
            'active' : false
        }
    ]
    $scope.item = item;
    $scope.categories = categories;
    $scope.uploadingImage = false;
    if(item != null){
        $scope.projectId = item.id;
        $scope.project = item;
    }else{
        $scope.project = null;
    }
    $scope.ok = function (item) {
        $scope.uploadingImage = true;
        if(!isNeedToUploadImages()){
            console.log("Editing project ",item);
            var restCallManager = new RestCallManager();

            restCallManager.post(callback , $http, item , "editProject");
            function callback(result , status , success) {
                if (success) {
                    $scope.uploadingImage = false;
                    $uibModalInstance.close(item);

                    alertMe( "success" ,"Edit Testimonial Success");
                } else {
                    $scope.uploadingImage = false;
                    alertMe( "danger" ,"Edit Testimonial Fail");
                }
            }
        }else{
            console.log("Ipload project");
            console.log("My Item " , item);
            var data = {
                action : 'uploadProjectImage',
                project : item
            }

            if($scope.newCarouselImage != undefined){
                data['file'] = $scope.newCarouselImage;
            }

            if($scope.newBigImage != undefined){
                console.log("Insert Big Image ",$scope.newBigImage);
                data['bigImage'] = $scope.newBigImage;
            }

            if($scope.bannarImage != undefined){
                data['bannarImage'] = $scope.bannarImage;
            }

            if($scope.newDetailedImageUrl1 != undefined){
                data['file1'] = $scope.newDetailedImageUrl1;
            }

            if($scope.newDetailedImageUrl2 != undefined){
                data['file2'] = $scope.newDetailedImageUrl2;
            }

            if($scope.newDetailedImageUrl3 != undefined){
                data['file3'] = $scope.newDetailedImageUrl3;
            }

            if($scope.newDetailedImageUrl4 != undefined){
                data['file4'] = $scope.newDetailedImageUrl4;
            }

            if($scope.newCircleImageUrl1 != undefined){
                data['file5'] = $scope.newCircleImageUrl1;
            }

            if($scope.newCircleImageUrl2 != undefined){
                data['file6'] = $scope.newCircleImageUrl2;
            }

            if($scope.newCircleImageUrl3 != undefined){
                data['file7'] = $scope.newCircleImageUrl3;
            }

            if($scope.newCircleImageUrl4 != undefined){
                data['file8'] = $scope.newCircleImageUrl4;
            }

            if($scope.scopeCarouselImage1 != undefined){
                data['file9'] = $scope.scopeCarouselImage1;
            }

            if($scope.scopeCarouselImage2 != undefined){
                data['file10'] = $scope.scopeCarouselImage2;
            }


            if($scope.scopeCarouselImage3 != undefined){
                data['file11'] = $scope.scopeCarouselImage3;
            }

            if($scope.scopeCarouselImage4 != undefined){
                data['file12'] = $scope.scopeCarouselImage4;
            }

            if($scope.scopeCarouselImage5 != undefined){
                data['file13'] = $scope.scopeCarouselImage5;
            }

            if($scope.scopeCarouselImage6 != undefined){
                data['file14'] = $scope.scopeCarouselImage6;
            }


            $scope.upload = $upload.upload({
                url : 'server/UploadController.php',
                data : data

            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                item.id = data.id;
                item.imagePath = data.imagePath;


                alertMe( "success" ,"Create New Project Success");
                $scope.uploadingImage = false;
                $uibModalInstance.close(item);


            }).error(function(data, status, headers, config){
                alertMe( "danger" ,"My Text");
                $scope.uploadingImage = false;
            });
        }





    };


    $scope.selectCategory = function(categoryId){
        for(var i = 0 ; i < $scope.categories.length ; i++){
            if($scope.categories[i].id === categoryId){
                $scope.selectedCategory = $scope.categories[i];
                break;
            }
        }
    }




    $scope.selectTab = function(tab){

        for(var i = 0 ; i < $scope.tabs.length ; i++){
            if($scope.tabs[i].title == tab){
                $scope.tabs[i].active = true;
            }
        }
        $scope.selectedTab = tab;
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.onCampaignMainImageSelect = function ($files){
        var file = $files[0];
        if(validImage(file)){
            $scope.url = URL.createObjectURL(file);
            $scope.newCarouselImage  = $files[0];
        }


    }

    $scope.onProjectBigImageSelect = function ($files){
        var file = $files[0];
        if(validImage(file)){
            $scope.bigImageurl = URL.createObjectURL(file);
            $scope.newBigImage  = $files[0];
        }


    }

    $scope.onProjectBannarImageSelect = function ($files){
        var file = $files[0];
        if(validImage(file)){
            $scope.bannarUrl = URL.createObjectURL(file);
            $scope.bannarImage  = $files[0];
        }
    }

    $scope.onDetailedCircleImage1Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageCircleUrl1 = URL.createObjectURL(file);
            $scope.newCircleImageUrl1  = $files[0];
        }

    }

    $scope.onDetailedCircleImage4Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageCircleUrl4 = URL.createObjectURL(file);
            $scope.newCircleImageUrl4  = $files[0];
        }

    }


    $scope.onDetailedCircleImage2Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageCircleUrl2 = URL.createObjectURL(file);
            $scope.newCircleImageUrl2  = $files[0];
        }

    }


    $scope.onDetailedCircleImage3Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageCircleUrl3 = URL.createObjectURL(file);
            $scope.newCircleImageUrl3  = $files[0];
        }

    }




    $scope.onDetailedImage1Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageUrl1 = URL.createObjectURL(file);
            $scope.newDetailedImageUrl1  = $files[0];
        }
    }

    $scope.onDetailedImage2Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageUrl2 = URL.createObjectURL(file);
            $scope.newDetailedImageUrl2  = $files[0];
        }
    }

    $scope.onDetailedImage3Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageUrl3 = URL.createObjectURL(file);
            $scope.newDetailedImageUrl3  = $files[0];
        }
    }

    $scope.onDetailedImage4Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageUrl4 = URL.createObjectURL(file);
            $scope.newDetailedImageUrl4  = $files[0];
        }
    }


    $scope.onMiniCarousel1Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.detailedImageUrl4 = URL.createObjectURL(file);
            $scope.newDetailedImageUrl4  = $files[0];
        }
    }

    $scope.onMiniCarousel1Select = function($files){
        console.log("Setting Fiest File");
        var file = $files[0];
        if(validImage){
            $scope.scopeCarouselImageUrl1 = URL.createObjectURL(file);
            $scope.scopeCarouselImage1  = $files[0];
        }
    }

    $scope.onMiniCarousel2Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.scopeCarouselImageUrl2 = URL.createObjectURL(file);
            $scope.scopeCarouselImage2  = $files[0];
        }
    }

    $scope.onMiniCarousel3Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.scopeCarouselImageUrl3 = URL.createObjectURL(file);
            $scope.scopeCarouselImage3  = $files[0];
        }
    }

    $scope.onMiniCarousel4Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.scopeCarouselImageUrl4 = URL.createObjectURL(file);
            $scope.scopeCarouselImage4  = $files[0];
        }
    }

    $scope.onMiniCarousel5Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.scopeCarouselImageUrl5 = URL.createObjectURL(file);
            $scope.scopeCarouselImage5  = $files[0];
        }
    }

    $scope.onMiniCarousel6Select = function($files){
        var file = $files[0];
        if(validImage){
            $scope.scopeCarouselImageUrl6 = URL.createObjectURL(file);
            $scope.scopeCarouselImage6  = $files[0];
        }
    }



    function validImage(file){
        if (file.type.indexOf('image') == -1) {
            $scope.mainImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
            $scope.mainImageError = true;
            return false;
        }else{
            return true;
        }
    }

    function isNeedToUploadImages(){
        if($scope.newCarouselImage == undefined
            && $scope.newDetailedImageUrl1 == undefined
            && $scope.newDetailedImageUrl2 == undefined
            && $scope.newDetailedImageUrl3 == undefined
            && $scope.newDetailedImageUrl4 == undefined
            && $scope.newCircleImageUrl1 == undefined
            && $scope.newCircleImageUrl2 == undefined
            && $scope.newCircleImageUrl3 == undefined
            && $scope.newCircleImageUrl4 == undefined
            && $scope.newBigImage == undefined
            && $scope.bannarImage == undefined
            && $scope.scopeCarouselImage1 == undefined
            && $scope.scopeCarouselImage2 == undefined
            && $scope.scopeCarouselImage3 == undefined
            && $scope.scopeCarouselImage4 == undefined
            && $scope.scopeCarouselImage5 == undefined
            && $scope.scopeCarouselImage6 == undefined
        ){
            return false;
        }else{
            return true;
        }
    }
});


app.controller('ProjectModalCtrl', function ($scope, $uibModalInstance, item , $upload , categories ) {
    $scope.categories = categories;
    $scope.uploadingImage = false;
    if(item != null){
        $scope.projectId = item.id;
        $scope.project = item;
    }else{
        $scope.project = null;
    }
    $scope.ok = function (item) {
        $scope.uploadingImage = true;
        if($scope.newCarouselImage == undefined){
            var restCallManager = new RestCallManager();
            restCallManager.post(callback , $http, item , "editProject");
            function callback(result , status , success) {
                if (success) {
                    $scope.uploadingImage = false;
                    $uibModalInstance.close(item);
                    alertMe( "success" ,"Edit Testimonial Success");
                } else {
                    $scope.uploadingImage = false;
                    alertMe( "danger" ,"Edit Testimonial Fail");
                }
            }
        }else{
            $scope.initCategoryName(item);
            $scope.upload = $upload.upload({
                url : 'server/UploadController.php',
                data : {
                    fname : $scope.newCarouselImage.name,
                    action : 'uploadProjectImage',
                    project : item
                },

                file : $scope.newCarouselImage
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                item.id = data.id;
                item.imagePath = data.imagePath;


                alertMe( "success" ,"Create New Project Success");
                $scope.uploadingImage = false;
                $uibModalInstance.close(item);
                return;
            }).error(function(data, status, headers, config){
                alertMe( "danger" ,"My Text");
                $scope.uploadingImage = false;
            });
        }


    };

    $scope.initCategoryName = function(item){
        if($scope.categories != undefined){
            for(var i = 0 ; i < $scope.categories.length ; i++){
                if($scope.categories[i].id == item.categoryId){
                    item.categoryTitle = $scope.categories[i].title;
                    for(var j = 0 ; j < $scope.categories[i].subCategories.length ; j++){
                        if($scope.categories[i].subCategories[j].id === item.subCategoryId){
                            item.subCategoryTitle = $scope.categories[i].subCategories[j].title;

                        }
                    }

                }
            }
        }else{
        }

    }


    $scope.selectCategory = function(categoryId){
        for(var i = 0 ; i < $scope.categories.length ; i++){
            if($scope.categories[i].id === categoryId){
                $scope.selectedCategory = $scope.categories[i];
                break;
            }
        }
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.onCampaignMainImageSelect = function ($files){
        var file = $files[0];

        if (file.type.indexOf('image') == -1) {
            $scope.mainImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
            $scope.mainImageError = true;
            return false;
        }
        $scope.url = URL.createObjectURL(file);
        $scope.newCarouselImage  = $files[0];
    }
});