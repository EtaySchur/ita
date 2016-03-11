/**
 * Created by EtaySchur on 25/11/2015.
 */

app.controller('AdminCtrl', ['$scope', '$http' ,function($scope , $http) {
    var restCallManager = new RestCallManager();
    restCallManager.post(getCategoriesCallback , $http, null , "getGeneralSettings");
    function getCategoriesCallback(result , status , success) {
        if (success) {
            $scope.general = result[0];
        } else {
        }
    }


  $scope.save = function(generalSettings){
      var restCallManager = new RestCallManager();
      restCallManager.post(getCategoriesCallback , $http, generalSettings , "saveGeneralSettings");
      function getCategoriesCallback(result , status , success) {
          if (success) {

          } else {
          }
      }
  }
}]);


app.controller('GeneralCtrl', ['$scope', '$log' , '$http' , '$uibModal' ,  function($scope , $log , $http , $uibModal) {
    $scope.hoverIn = function(){
        this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };

    $scope.deleteMiniProject = function(image){
        restCallManager.post(getFormsCallback , $http, image , "deleteCarouselImage");
        function getFormsCallback(result , status , success) {
            if (success) {

            } else {

            }
        }
    }

    $scope.openDeleteModal = function(item){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'deleteMiniProject.html',
            controller: 'DeleteModalInstanceCtrl',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            var restCallManager = new RestCallManager();
            selectedItem.isDeleted = true;
            restCallManager.post( cb , $http, selectedItem , "updateObject" , "miniProjects");
            function cb(result , status , success) {
                if (success) {
                    var index = $scope.miniProjects.indexOf(selectedItem);
                    $scope.miniProjects.splice( index , 1);
                    alertMe( "success" ,"Delete Mini Project Success");
                } else {
                    alertMe( "danger" ,"Delete Mini Project Fail");
                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    var restCallManager = new RestCallManager();
    restCallManager.post(getMiniProjects , $http, null , "getAdminMiniProjects");
    function getMiniProjects(result , status , success) {
        if (success) {
            $scope.miniProjects = result;
        } else {

        }
    }

    var restCallManager1 = new RestCallManager();
    restCallManager1.post(cb , $http, null , "getSubCategories");
    function cb(result1 , status , success) {
        if (success) {
            console.log("res" ,  result1);
            $scope.subCategories = result1;
        } else {

        }
    }



    $scope.animationsEnabled = true;

    $scope.open = function (size , miniProject) {
        var modalInstance = $uibModal.open({
            animation: true ,
            templateUrl: 'miniProject.html',
            controller: 'MiniProjectModalInstanceCtrl',
            resolve: {
                item: function () {
                    return miniProject;
                },
                subCategories : function(){
                    return   $scope.subCategories
                }
            }
        });

        modalInstance.result.then(function (newMiniProject) {
            // TODO - Reload Data ?
            if(miniProject == null){
                $scope.miniProjects.push(newMiniProject);
            }else{
                //miniProject.imagePath = newMiniProject.imagePath;
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

}]);


app.controller('MiniProjectModalInstanceCtrl', function ($scope, $uibModalInstance, item , $upload, $http ,   subCategories ) {

    $scope.uploadingImage = false;
    $scope.subCategories = subCategories;
    if(item != null){
        $scope.imageId = item.id;
        $scope.item = item;

    }else{
        $scope.imageId = null;
        $scope.item = {};
    }

    $scope.ok = function () {

        $scope.uploadingImage = true;
        if($scope.newMiniProjectImage == undefined){
            if($scope.item.id){
                var restCallManager = new RestCallManager();
                restCallManager.post(getMiniProjects , $http,  $scope.item , "editMiniProject");
                function getMiniProjects(result , status , success) {
                    if (success) {
                        alertMe( "success" ,"Create New Carousel Image Success");
                        var newImage = {
                            'id' : result.id
                        }
                        $scope.uploadingImage = false;
                        $uibModalInstance.close(newImage);
                    } else {

                    }
                }
            }else{

            }
            /*
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
            */

        }else{

            console.log("This is my uplaod item ",  $scope.item);
            $scope.upload = $upload.upload({
                url : 'server/UploadController.php',
                data : {
                    fname : $scope.newMiniProjectImage.name,
                    action : 'uploadNewMiniProjectImage',
                    image :  $scope.item
                },

                file : $scope.newMiniProjectImage
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
        console.log('picking image');
        $scope.url = URL.createObjectURL(file);
        $scope.newMiniProjectImage  = $files[0];
    }
});





