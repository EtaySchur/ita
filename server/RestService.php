<?php
/**
 * Created by PhpStorm.
 * User: EtaySchur
 * Date: 23/11/2015
 * Time: 16:30
 */
require_once 'db/manager.php';
require_once 'mail/phpmailer.php';

if (($_POST) || (isset($_POST))) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    switch ($request->action) {
        case "getCarouselImages" :
            $result = DbManager::getCarouselImages();
            echo json_encode($result);
            exit;

        case "deleteCarouselImage":
            $result = DbManager::deleteCarouselImage($request->data);
            echo json_encode($result);
            exit;
        case "addCategory" :
            $result = DbManager::addCategory($request->data);
            var_dump("my resut ",$result);
            echo json_encode($result);
            exit;
        case "getCategories" :
            $result = DbManager::getCategories();
            echo json_encode($result);
            exit;
        case "getSubCategory" :
            $result = DbManager::getSubCategory($request->data);
            echo json_encode($result);
            exit;
        case "addSubCategory":
            $result = DbManager::addSubCategory($request->data);
            echo json_encode($result);
            exit;

        case "getSubCategories" :
            $result = DbManager::getSubCategories();
            echo json_encode($result);
            exit;
        case "editCategoryTitle" :
            $result = DbManager::editCategoryTitle($request->data);
            echo json_encode($result);
            exit;
        case "deleteCategory" :
            $result = DbManager::deleteCategory($request->data);
            echo json_encode($result);
            exit;
        case "deleteSubCategory" :
            $result = DbManager::deleteSubCategory($request->data);
            echo json_encode($result);
            exit;
        case "editMiniProject" :
            $result = DbManager::editMiniProject($request->data);
            echo json_encode($result);
            exit;
        case "editSubCategoryTitle" :
            $result = DbManager::editSubCategoryTitle($request->data);
            echo json_encode($result);
            exit;
        case "getGeneralSettings" :
            $result = DbManager::getGeneralSettings();
            echo json_encode($result);
            exit;
        case "saveGeneralSettings" :
            $result = DbManager::saveGeneralSettings($request->data);
            echo json_encode($result);
            exit;
        case 'deleteProject' :
            $result = DbManager::deleteProject($request->data);
            echo json_encode($result);
            exit;
         case 'deleteTestimonial' :
             $result = DbManager::deleteTestimonial($request->data);
             echo json_encode($result);
             exit;
        case 'saveNewProject' :
            $result = DbManager::saveNewProject($request->data);
            echo json_encode($result);
            exit;
        case 'getTestimonials' :
            $result = DbManager::getTestimonials();
            echo json_encode($result);
            exit;
        case "getProjects" :
            $result = DbManager::getProjects($request->data);
            echo json_encode($result);
            exit;

        case "getProject" :
            $result = DbManager::getProject($request->data);
            echo json_encode($result);
            exit;
        case "editTestimonial"  :
            $result = DbManager::editTestimonial($request->data);
            echo json_encode($result);
            exit;
        case "editProject"  :
            $result = DbManager::editProject($request->data);
            echo json_encode($result);
            exit;
        case  "getManageProjects" :
             $result = DbManager::getManageProject($request->data);
            echo json_encode($result);
            exit;
          case  "insertContactUs" :
                     $result = DbManager::insertContactInfo($request->data);
                    echo json_encode($result);
                    exit;
        case "getMiniProjects" :
         $result = DbManager::getMiniProjects($request->data);
                    echo json_encode($result);
                    exit;
        case "editCarouselImage"  :
            $result = DbManager::editCarouselImage($request->data);
            echo json_encode($result);
            exit;
        case "saveTestimonials" :
             $result = DbManager::saveOrder($request->data, "testimonials");
                        echo json_encode($result);
                        exit;
        case "saveProjects" :
              $result = DbManager::saveOrder($request->data, "projects");
              $result = DbManager::getManageProject();
              echo json_encode($result);
              exit;
        case "updateObject" :
             $result = DbManager::updateDb($request->table , $request->data);
                        echo json_encode($result);
                        exit;
        case "getAdminMiniProjects":
            $result = DbManager::getAdminMiniProjects($request->table , $request->data);
            echo json_encode($result);
            exit;
        case "sendEmail" :
            $mail             = new PHPMailer(); // defaults to using php "mail()"
            $body             = file_get_contents('static/contact-us.html');
           // $body             = eregi_replace("[\]",'',$body);
            $mail->From = "etayschur@gmail.com";
            $mail->FromName = "Full Name";
            $body = str_replace("###USERNAME###", 'Fuad' , $body);
            $body = str_replace("###PHONE###", 'Fuad' , $body);
            $body = str_replace("###EMAIL###", 'Fuad' , $body);
            $body = str_replace("###TEXT###", 'Fuad' , $body);

//Address to which recipient will reply
            $mail->addReplyTo("etayschur@gmail.com", "Reply");

            $address = "etayschur@gmail.com";
            $mail->AddAddress($address, "John Doe");
            $mail->Subject    = "PHPMailer Test Subject via mail(), basic";

            $mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
            $mail->isHTML(true);

            $mail->Body = $body;
            if(!$mail->Send()) {
                echo "Mailer Error: " . $mail->ErrorInfo;
            } else {
                echo "Message sent!";
            }
            break;






    }
}
