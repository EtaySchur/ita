/**
 * Created by EtaySchur on 23/11/2015.
 */

var RestCallManager = function( callback , http) {

};

RestCallManager.prototype.post = function( callback , http , data , action ){
    $('html').css('cursor' , 'progress');
    http.post('server/RestService.php', {
        "action" : action,
        "data" : data
    }).
        success(function(data, status) {
            callback(data , status , true);
            $('html').css('cursor' , 'default');
        })
        .
        error(function(data, status) {
            callback(data , status , false);
            $('html').css('cursor' , 'default');
        });
}

function alertMe ( type , text){
    new PNotify({
        title: 'Regular Success',
        text: text,
        type: type
    });

    return;
    /*
    var info_div =  $('#info_alert');
    $(info_div).addClass('alert-'+type);
    $(info_div).text(text);
    $('.alert_section').css('display' , 'block');
    $('.alert_section').fadeOut( 3000, function() {
        $('.alert_section').css('display' , 'none');

    });
    */
}

