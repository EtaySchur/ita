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





