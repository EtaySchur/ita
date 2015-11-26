<?php
require_once 'db/manager.php';
const CAROUSEL_PATH = 'carousel/';
const PROJECTS_PATH = 'projects/';
const TESTIMONIAL_PATH = 'testimonials/';


$fname = $_POST["fname"];
$action = $_POST["action"];




// TODO - DELETE EXISTS IMAGES


if (isset($_FILES['file'])) {
    //The error validation could be done on the javascript client side.
    $errors = array();
    $file_name = $_FILES['file']['name'];
    $file_size = $_FILES['file']['size'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_type = $_FILES['file']['type'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $extensions = array("jpeg", "jpg", "png", "png");
    $date = new DateTime();
    $timestamp = $date->getTimestamp();
    switch ($action) {
        case 'uploadNewCarouselImage' :
            $image = json_decode($_POST["image"]);

            if (in_array($file_ext, $extensions) === false) {
                $errors[] = "image extension not allowed, please choose a JPEG or PNG file.";
            }
            if ($file_size > 2097152) {
                $errors[] = 'File size cannot exceed 2 MB';
            }
            if (empty($errors) == true) {
                if (!file_exists("static/images/".CAROUSEL_PATH)) {
                    var_dump("Making dir");
                    mkdir("static/images/".CAROUSEL_PATH, 0777, true);
                } else {

                }
                move_uploaded_file($file_tmp, "static/images/" . CAROUSEL_PATH.$timestamp.".".$file_ext);
                $imagePath = "server/static/images/" . CAROUSEL_PATH.$timestamp.".".$file_ext;
                if(!isset($image->id)){
                    $response = DbManager::saveNewCarouselImage("server/static/images/" . CAROUSEL_PATH.$timestamp.".".$file_ext , $image);
                }else{
                    $image->imagePath =  "server/static/images/" . CAROUSEL_PATH.$timestamp.".".$file_ext;
                    $response = DbManager::editCarouselImage( $image);
                }
                $response['imagePath'] = $imagePath;
                echo json_encode($response);
            } else {
                print_r($errors);
            }
        break;
        case 'uploadProjectImage' :
            $project = json_decode($_POST["project"]);
            if (in_array($file_ext, $extensions) === false) {
                $errors[] = "image extension not allowed, please choose a JPEG or PNG file.";
            }
            if ($file_size > 2097152) {
                $errors[] = 'File size cannot exceed 2 MB';
            }
            if (empty($errors) == true) {
                if (!file_exists("static/images/".PROJECTS_PATH)) {
                    var_dump("Making dir");
                    mkdir("static/images/".PROJECTS_PATH, 0777, true);
                } else {

                }
                move_uploaded_file($file_tmp, "static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext);


                $imagePath = "server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext;
                if( !isset($project->id)){
                    $response = DbManager::saveNewProject("server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext , $project);
                }else{
                    $project->imagePAth = "server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext;
                    $response = DbManager::editProject($project);
                    //$response = DbManager::editCarouselImage("server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext , $imageId);
                }
                $response['imagePath'] = $imagePath;
                echo json_encode($response);
            } else {
                print_r($errors);
            }
        break;
        case 'uploadTestimonialImage' :
            $testimonial = json_decode($_POST["testimonial"]);

            if (in_array($file_ext, $extensions) === false) {
                $errors[] = "image extension not allowed, please choose a JPEG or PNG file.";
            }
            if ($file_size > 2097152) {
                $errors[] = 'File size cannot exceed 2 MB';
            }
            if (empty($errors) == true) {
                if (!file_exists("static/images/".TESTIMONIAL_PATH)) {
                    var_dump("Making dir");
                    mkdir("static/images/".TESTIMONIAL_PATH, 0777, true);
                } else {

                }
                move_uploaded_file($file_tmp, "static/images/" . TESTIMONIAL_PATH.$timestamp.".".$file_ext);


                $imagePath = "server/static/images/" . TESTIMONIAL_PATH.$timestamp.".".$file_ext;
                if( !isset($testimonial->id)){
                    $response = DbManager::saveNewTestimonial("server/static/images/" . TESTIMONIAL_PATH.$timestamp.".".$file_ext , $testimonial);
                }else{
                    $testimonial->imagePath = "server/static/images/" . TESTIMONIAL_PATH.$timestamp.".".$file_ext;
                    DbManager::editTestimonial($testimonial);


                    //$response = DbManager::editCarouselImage("server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext , $imageId);
                    $response = array();
                    $response['imagePath'] = $imagePath;
                }

                echo json_encode($response);
            } else {
                print_r($errors);
            }
            break;

    }


} else {
    var_dump("FAIL");
}

?>
