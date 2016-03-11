<?php
require_once 'db/manager.php';
const CAROUSEL_PATH = 'carousel/';
const PROJECTS_PATH = 'projects/';
const TESTIMONIAL_PATH = 'testimonials/';



$action = $_POST["action"];




// TODO - DELETE EXISTS IMAGES


if (true) {
    if($action == 'uploadNewCarouselImage' || $action == 'uploadNewMiniProjectImage'){
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

    }

    switch ($action) {
      case 'uploadNewMiniProjectImage' :
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

                    $image->imagePath = "server/static/images/" . CAROUSEL_PATH.$timestamp.".".$file_ext;
                    $response = DbManager::saveNewMiniProject($image);
                }else{
                    $image->imagePath =  "server/static/images/" . CAROUSEL_PATH.$timestamp.".".$file_ext;
                    $response = DbManager::editMiniProject( $image);
                }
                $response['imagePath'] = $imagePath;
                echo json_encode($response);
            } else {
                print_r($errors);
            }
            break;
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
            if(isset($_FILES["file"])){
                $file = $_FILES["file"];
                $project->imagePath = moveProjectImageFile($file);

            }

            if(isset($_FILES["file1"])){
                $file1 =  $_FILES["file1"];
                $project->image1 = moveProjectImageFile($file1);
            }

            if(isset($_FILES["bigImage"])){
                $bigImage =  $_FILES["bigImage"];
                $project->bigImage = moveProjectImageFile($bigImage);
            }

            if(isset($_FILES["sideBarImage"])){
                $sideBarImage =  $_FILES["sideBarImage"];
                $project->sideBarImage = moveProjectImageFile($sideBarImage);
            }

             if(isset($_FILES["bannarImage"])){
                            $bannarImage =  $_FILES["bannarImage"];
                            $project->bannarImage = moveProjectImageFile($bannarImage);
                        }

            if(isset($_FILES["file2"])){
                $file2 =  $_FILES["file2"];
                $project->image2 = moveProjectImageFile($file2);
            }

            if(isset($_FILES["file3"])){
                $file3 =  $_FILES["file3"];
                $project->image3 = moveProjectImageFile($file3);
            }

            if(isset($_FILES["file4"])){
                $file4 =  $_FILES["file4"];
                $project->image4 = moveProjectImageFile($file4);
            }

            if(isset($_FILES["file5"])){

                $file5 =  $_FILES["file5"];
                $project->imageCircle1 = moveProjectImageFile($file5);
            }

            if(isset($_FILES["file6"])){
                $file6 =  $_FILES["file6"];
                $project->imageCircle2 = moveProjectImageFile($file6);
            }

            if(isset($_FILES["file7"])){
                $file7 =  $_FILES["file7"];
                $project->imageCircle3 = moveProjectImageFile($file7);
            }

            if(isset($_FILES["file8"])){
                $file8 =  $_FILES["file8"];
                $project->imageCircle4 = moveProjectImageFile($file8);
            }

            if(isset($_FILES["file9"])){
                $file8 =  $_FILES["file9"];
                $project->miniCarouselImage1 = moveProjectImageFile($file8);
            }

            if(isset($_FILES["file10"])){
                $file8 =  $_FILES["file10"];
                $project->miniCarouselImage2 = moveProjectImageFile($file8);
            }

            if(isset($_FILES["file11"])){
                $file8 =  $_FILES["file11"];
                $project->miniCarouselImage3 = moveProjectImageFile($file8);
            }

            if(isset($_FILES["file12"])){
                $file8 =  $_FILES["file12"];
                $project->miniCarouselImage4 = moveProjectImageFile($file8);
            }

            if(isset($_FILES["file13"])){
                $file8 =  $_FILES["file13"];
                $project->miniCarouselImage5 = moveProjectImageFile($file8);
            }

            if(isset($_FILES["file14"])){
                $file8 =  $_FILES["file14"];
                $project->miniCarouselImage6 = moveProjectImageFile($file8);
            }





            /*
            if (in_array($file_ext, $extensions) === false) {
                $errors[] = "image extension not allowed, please choose a JPEG or PNG file.";
            }
            if ($file_size > 2097152) {
                $errors[] = 'File size cannot exceed 2 MB';
            }

            */
            if (true) {
                if( !isset($project->id)){
                    $response = DbManager::saveNewProject($project);
                }else{
                    //$project->imagePAth = "server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext;
                    $response = DbManager::editProject($project);
                    //$response = DbManager::editCarouselImage("server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext , $imageId);
                }
                echo json_encode($project);
            } else {
                print_r($errors);
            }
        break;
        case 'uploadTestimonialImage' :
            $testimonial = json_decode($_POST["testimonial"]);
            if(isset($_FILES["file"])){
                $file = $_FILES["file"];
                $testimonial->imagePath = moveTestimoialImageFile($file);

            }

            if(isset($_FILES["blackImage"])){
                $file1 =  $_FILES["blackImage"];
                $testimonial->blackImagePath = moveTestimoialImageFile($file1);
            }


                if( !isset($testimonial->id)){
                    $response = DbManager::saveNewTestimonial($testimonial);
                }else{
                    $response = DbManager::editTestimonial($testimonial);
                }
                echo json_encode($response);
            break;

    }


} else {
    var_dump("FAIL");
}

function moveProjectImageFile($file){
    $errors = array();
    $file_name = $file['name'];
    $file_size = $file['size'];
    $file_tmp = $file['tmp_name'];
    $file_type = $file['type'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $extensions = array("jpeg", "jpg", "png", "png");
    $date = new DateTime();
    $timestamp = rand() + $date->getTimestamp();

    if (!file_exists("static/images/".PROJECTS_PATH)) {
        var_dump("Making dir");
        mkdir("static/images/".PROJECTS_PATH, 0777, true);
    } else {

    }
    move_uploaded_file($file_tmp, "static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext);
    return  "server/static/images/" . PROJECTS_PATH.$timestamp.".".$file_ext;

}

function moveTestimoialImageFile($file){
    $errors = array();
    $file_name = $file['name'];
    $file_size = $file['size'];
    $file_tmp = $file['tmp_name'];
    $file_type = $file['type'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $extensions = array("jpeg", "jpg", "png", "png");
    $date = new DateTime();
    $timestamp = rand() + $date->getTimestamp();

    if (!file_exists("static/images/".TESTIMONIAL_PATH)) {
        var_dump("Making dir");
        mkdir("static/images/".TESTIMONIAL_PATH, 0777, true);
    } else {

    }
    move_uploaded_file($file_tmp, "static/images/" . TESTIMONIAL_PATH.$timestamp.".".$file_ext);
    return  "server/static/images/" . TESTIMONIAL_PATH.$timestamp.".".$file_ext;

}

?>
