/**
 * Created by EtaySchur on 25/11/2015.
 */

app.controller('TestimonialsCtrl', ['$scope', '$http' ,  '$uibModal' , '$log' ,function($scope , $http , $uibModal , $log) {
    $scope.animationsEnabled = true;

    var restCallManager = new RestCallManager();
    restCallManager.post(getCategoriesCallback , $http, null , "getTestimonials");
    function getCategoriesCallback(result , status , success) {
        if (success) {
            $scope.testimonials = result;
        } else {
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
            controller: 'addTestimonialCtrl',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (testimonial) {
            $scope.testimonials.push(testimonial);
        });
    }

    $scope.deleteTestimonial = function (testimonial){
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteTestimonial.html',
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
                    alertMe( "danger" ,"Delete Testimonial Fail");
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
        if($scope.newCarouselImage == undefined){
            var restCallManager = new RestCallManager();
            restCallManager.post(callback , $http, item , "editTestimonial");
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
            $scope.upload = $upload.upload({
                url : 'server/UploadController.php',
                data : {
                    fname : $scope.newCarouselImage.name | null,
                    action : 'uploadTestimonialImage',
                    testimonial : item
                },

                file : $scope.newCarouselImage
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                item.id = data.id;
                item.imagePath = data.imagePath;


                alertMe( "success" ,"Create New Testimonials Success");
                $scope.uploadingImage = false;
                $uibModalInstance.close(item);
                return;
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
