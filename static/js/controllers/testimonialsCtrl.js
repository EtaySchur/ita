/**
 * Created by EtaySchur on 25/11/2015.
 */

app.controller('TestimonialsCtrl', ['$scope', '$http' ,  '$uibModal' , '$log' ,function($scope , $http , $uibModal , $log) {
    $scope.animationsEnabled = true;


    $scope.getData = function(){
        var restCallManager = new RestCallManager();
        restCallManager.post(getCategoriesCallback , $http, null , "getTestimonials");
        function getCategoriesCallback(result , status , success) {
            if (success) {
                $scope.testimonials = result;
            } else {
            }
        }
    }

    $scope.getData();

    $scope.moved = function(index) {
        $scope.testimonials.splice(index, 1);
         for(var i = 0 ; i < $scope.testimonials.length ; i++) {
             $scope.testimonials[i].itemOrder = i;
         };

        var restCallManager = new RestCallManager();
        restCallManager.post(saveTestimonials , $http, $scope.testimonials , "saveTestimonials");
        function saveTestimonials(result , status , success) {
            if (success) {
                alertMe("Testimonials Order Saved Success");
               // $scope.testimonials = result;
            } else {
            }
        }
    }


    $scope.addNewTestimonial = function(item){
        if(item == null){
            var templateId = 'addNewTestimonial.html';
        }else{
            var templateId = 'editTestimonial.html';
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: templateId,
            backdrop : 'static'  ,
            controller: 'addTestimonialCtrl',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (testimonial) {
            $scope.getData();
        });
    }

    $scope.deleteTestimonial = function (testimonial){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteTestimonial.html',
            backdrop : 'static'  ,
            controller: 'DeleteModalInstanceCtrl',
            resolve: {
                item: function () {
                    return testimonial;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            var restCallManager = new RestCallManager();
            restCallManager.post(deleteCarouselImageCallback , $http, selectedItem , "deleteTestimonial");
            function deleteCarouselImageCallback(result , status , success) {
                if (success) {
                    var index = $scope.testimonials.indexOf(selectedItem);
                    $scope.testimonials.splice( index , 1);
                    alertMe( "success" ,"Delete Testimonial Success");
                } else {
                    dangerMe( "danger" ,"Delete Testimonial Fail");
                }
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
}]);



app.controller('addTestimonialCtrl', function ($scope, $uibModalInstance, item , $upload , $http ) {
    $scope.item = item;
    $scope.uploadingImage = false;
    if(item != null){
        $scope.testimonialId = item.id;
        $scope.testimonial = item;
    }else{
        $scope.testimonial = null;
    }
    $scope.ok = function (item) {
        $scope.uploadingImage = true;
        if($scope.image == undefined && $scope.blackImageFile == undefined){
            var restCallManager = new RestCallManager();
            restCallManager.post(callback , $http, item , "editTestimonial");
            function callback(result , status , success) {
                if (success) {

                    $scope.uploadingImage = false;
                    $uibModalInstance.close(item);
                    alertMe( "success" ,"Edit Testimonial Success");
                } else {
                    $scope.uploadingImage = false;
                    dangerMe( "danger" ,"Edit Testimonial Fail");
                }
            }
        }else{
            var data = {
                action : 'uploadTestimonialImage',
                testimonial : item
            }

            if($scope.image != undefined){
                data['file'] = $scope.image;
            }

            if($scope.blackImageFile != undefined){
                data['blackImage'] = $scope.blackImageFile;
            }

            $scope.upload = $upload.upload({
                url : 'server/UploadController.php',
                data : data
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                item.id = data.id;
                item.imagePath = data.imagePath;
                console.log("This is the result ",data);

                alertMe( "success" ,"Create New Testimonials Success");
                $scope.uploadingImage = false;
                $uibModalInstance.close(item);
                return;
            }).error(function(data, status, headers, config){
                dangerMe( "danger" ,"My Text");
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.onBlackImageSelected = function($files){
        var file = $files[0];
        if(validImage){
            $scope.blackImage = URL.createObjectURL(file);
            $scope.blackImageFile  = $files[0];
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

    $scope.onCampaignMainImageSelect = function ($files){
        var file = $files[0];

        if (file.type.indexOf('image') == -1) {
            $scope.mainImageErrorText = 'image extension not allowed, please choose a JPEG or PNG file.'
            $scope.mainImageError = true;
            return false;
        }
        $scope.url = URL.createObjectURL(file);
        $scope.image  = $files[0];
    }
});
