<?php
/**
 * Created by PhpStorm.
 * User: EtaySchur
 * Date: 23/11/2015
 * Time: 16:41
 */

class DbManager {
    protected $pdo;
    public function __construct() {

    }
    private static function connectToDb() {
        $configuration = parse_ini_file("/etc/config.ini");
        $dbpass = $configuration['dbPassword'];
        $dbhost = $configuration['dbHost'];
        $dbname = $configuration['dbName'];
        $dbuser = $configuration['dbUserName'];

        $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass ,  array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

        return $pdo;
    }

    public static function getSubCategory($id){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `subCategories` WHERE `id` = $id");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        exit;
    }



    public static function getCarouselImages(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `carouselImages` WHERE `isDeleted` = 0");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        exit;
    }


    public static function getAdminMiniProjects(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `miniProjects` WHERE `isDeleted` = 0");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        exit;
    }


    public static function getTestimonials(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `testimonials` WHERE `isDeleted` = 0");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        exit;
    }



    public static function deleteProject($project){
        $conn = self::connectToDb();
        $sql = "UPDATE `projects` SET `isDeleted` = 1 WHERE id=$project->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;

    }

    public static function deleteTestimonial($testimonial){
        $conn = self::connectToDb();
        $sql = "UPDATE `testimonials` SET `isDeleted` = 1 WHERE id=$testimonial->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;

    }

    public static function saveNewTestimonial($data){
        return self::insertToDb('testimonials' , $data);
        exit;

    }



    public static function getProjects(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `projects` WHERE `isDeleted` = 0 AND `published` = 1");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;

        exit;
    }

    public static  function getManageProject($projectId){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `projects` WHERE `isDeleted` = 0");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;

        exit;
    }

    public static  function getProject($projectId){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `projects` WHERE `id` = $projectId");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;

        exit;
    }


    public static function saveNewProject($data){
        return self::insertToDb('projects' , $data);

        exit;
    }

    public static function getGeneralSettings(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `general`");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        exit;
    }

    public static function deleteCategory($category){
        $conn = self::connectToDb();
        $sql = "UPDATE `categories` SET `isDeleted` = 1 WHERE id=$category->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
        exit;
    }

    public static function deleteSubCategory($subCategory){
        $conn = self::connectToDb();
        $sql = "UPDATE `subCategories` SET `isDeleted` = 1 WHERE id=$subCategory->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
        exit;
    }

    public static  function editTestimonial($data){
        return self::updateDb("testimonials" , $data);
        exit;

    }

    public static function editCarouselImage($data){
        return self::updateDb("carouselImages" , $data);
        exit;
        $conn = self::connectToDb();
        $sql = "UPDATE `carouselImages` SET `imagePath` = '".$filePath."' WHERE id=$imageId->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
        exit;
    }

    public static  function editProject($data){
        if($data->featured == 1){
            $data->featured = true;
        }else{
            $data->featured = false;
        }

        return self::updateDb("projects" , $data);
        exit;

    }




    public static  function saveGeneralSettings($data){
        return self::updateSettings("general" , $data);
        exit;

    }

    public static  function deleteCarouselImage($image){
        $conn = self::connectToDb();
        $sql = "UPDATE `carouselImages` SET `isDeleted` = 1 WHERE id=$image->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
        exit;

    }

    public static function addCategory($category){
        return self::insertToDb("categories" , $category);
    }

    public static function addSubCategory($data){
        $record = array();
        $record["title"] = $data->newSubCategoryTitle->title;
        $record["categoryId"] = $data->category->id;
        return self::insertToDb("subCategories" , $record);
    }

    public static function getCategories(){
        $result = array();
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `categories` WHERE `isDeleted` = 0 ORDER BY `order` ASC");
        $sql->execute();
        $categories = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach($categories as $category){
            $category['subCategories'] = self::getCategorySubCategories($category['id']);
            array_push($result , $category);
        }
        return $result;
        exit;
    }

    public static function getSubCategories(){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `subCategories` WHERE `isDeleted` = 0");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;


        exit;
    }

    private static function getCategorySubCategories($categoryId){
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `subCategories` WHERE `categoryId` = $categoryId AND isDeleted = 0");
        $sql->execute();
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function editCategoryTitle($category){
        $conn = self::connectToDb();
        $sql = "UPDATE `categories` SET `title` = '".$category->title."' WHERE id=$category->id";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
        exit;
    }

    public static function editSubCategoryTitle($subCategory){
        return self::updateDb("subCategories" , $subCategory);
        exit;
    }

    public static function saveNewCarouselImage($filePath , $image){

        $image->imagePath = $filePath;
        return self::insertToDb("carouselImages" , $image);
    }

    public static function insertContactInfo($data){
         return self::insertToDb('contactUs' , $data);
                exit;
    }





    public static function setUserCookie($userId , $cookie){
    }
    public static function login($data){
        $userLogin = ($data->userLogin);
        $userPassword = md5($data->userPassword);
        $conn = self::connectToDb();
        $sql = $conn->prepare("SELECT * from `adminUsers`
                               WHERE `userLogin`  = :userLogin
                               AND  `userPassword`  = :userPassword
                               ");
        $sql->bindParam('userLogin', $userLogin);
        $sql->bindParam('userPassword', $userPassword);
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    public static function deleteForm($formId){
        $conn = self::connectToDb();
        $sql = "UPDATE `forms` SET `isDeleted` = 1 WHERE id=$formId";
        $stmt = $conn->query($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
        exit;
    }

     public static function updateSettings($tableName , $data){
                $conn = self::connectToDb();
                $sql = "UPDATE ".$tableName." SET";
                $comma = " ";
                $whitelist = array(

                );
                foreach($data as $key => $val) {
                    if( ! empty($val)) {
                        $sql .= $comma . $key . " = '" .(trim($val)) . "'";
                        $comma = ", ";
                    }
                }

                if(isset($data->id)){
                    $sql .=" WHERE id = ".$data->id;
                }
                $stmt = $conn->query($sql);
                $stmt->execute();
                $result = $stmt->fetchAll();
                return $result;

        }

        public static function getMiniProjects($subCategoryId){
             $conn = self::connectToDb();
                    $sql = $conn->prepare("SELECT * from `miniProjects` WHERE `isDeleted` = 0 AND subCategoryId = $subCategoryId");
                    $sql->execute();
                    $result = $sql->fetchAll(PDO::FETCH_ASSOC);
                    return $result;
                    exit;
        }



   public static function saveNewMiniProject($data){
            return self::insertToDb('miniProjects' , $data);
                exit;
    }

      public static function editMiniProject($data){
                return self::updateDb('miniProjects' , $data);
                    exit;
        }

    /* Generic Section */
    public static function updateDb($tableName , $data){
        if(!isset($data->id)){
            return null;
        }else{
            $conn = self::connectToDb();
            $sql = "UPDATE ".$tableName." SET";
            $comma = " ";
            $whitelist = array(

            );
            foreach($data as $key => $val) {

                if( isset($val)) {
                    $sql .= $comma . $key . " = '" .(trim($val)) . "'";
                    $comma = ", ";
                }
            }

            if(isset($data->id)){
                $sql .=" WHERE id = ".$data->id;
            }
            $stmt = $conn->query($sql);
            $stmt->execute();
            $result = $stmt->fetchAll();
            return $result;
        }



    }



    public static function insertToDb($tableName, $data) {

        // Convert The Data from Object to Key - Value Array
        $dataArray = (array) $data;
        // Get Last Item Key
        $last_key = end(array_keys($dataArray));
        $sql = array();
        $cols = "(";
        $values = "(";
        foreach ($dataArray AS $k => $v) {
            $cols.= $k;
            $values.= ':' . $k;
            if ($k == $last_key) {

            } else {
                $cols.=",";
                $values.=",";
            }
        }
        $cols.=")";
        $values.= ")";
        $query = "INSERT INTO " . $tableName . " " . $cols . " VALUES " . $values;
        $conn = self::connectToDb();

        $q = $conn->prepare($query);
        $q->execute($dataArray);
        var_dump("Adding Category ",$conn->lastInsertId()); exit;

        return array('id' => $conn->lastInsertId(), 'creation_date' => date("Y-m-d H:i:s", time()));
    }
    private static function deleteFromDb($table , $whereCol , $whereVal){
        $conn = self::connectToDb();
        if($whereCol == null){
            $sql = "DELETE FROM ".$table;
            $q = $conn->query($sql);
            return $q;
        }else{
            $sql = "DELETE FROM ".$table." WHERE ".$whereCol."=".$whereVal;
            $q = $conn->query($sql);
            return $q;
        }
    }
    /* End Of Generic Section */
}