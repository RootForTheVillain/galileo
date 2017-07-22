<?php

if(isset($_POST['email'])) {

    $errors = array();

    // EDIT THE 2 LINES BELOW AS REQUIRED
    //$email_to = "info@galileo-insights.com";
    $email_to = "brent.knop@gmail.com";
    $email_subject = "Contact request from galileo-insights.com";

    function died($error) {
        // your error code can go here
        header('Content-Type: application/json');
        echo json_encode($error);
        /*echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";*/
        die();
    }


    // validation expected data exists
    if(!isset($_POST['first_name']) ||
        !isset($_POST['last_name']) ||
        !isset($_POST['email']) ||
        !isset($_POST['phone']) ||
        !isset($_POST['company']) ||
        !isset($_POST['role']) ||
        !isset($_POST['comments'])) {
        array_push($errors, 'We are sorry, but there appears to be a problem with the form you submitted.');
        died($errors);
    }



    $first_name = $_POST['first_name']; // required
    $last_name = $_POST['last_name']; // required
    $email_from = $_POST['email']; // required
    $phone = $_POST['phone']; // required
    $company = $_POST['company']; // required
    $role = $_POST['role']; // required
    $comments = $_POST['comments']; // required

    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

  if(!preg_match($email_exp,$email_from)) {
    array_push($errors, 'The Email Address you entered does not appear to be valid.');
  }

    $string_exp = "/^[A-Za-z .'-]+$/";

  if(!preg_match($string_exp,$first_name)) {
    array_push($errors, 'The First Name you entered does not appear to be valid.');
  }

  if(!preg_match($string_exp,$last_name)) {
    array_push($errors, 'The Last Name you entered does not appear to be valid.');
  }

  if(!preg_match($string_exp,$company)) {
    array_push($errors, 'The Company you entered does not appear to be valid.');
  }

  if(!preg_match($string_exp,$role)) {
    array_push($errors, 'The Role you entered does not appear to be valid.');
  }

  if(strlen($comments) < 2) {
    array_push($errors, 'The Comments you entered do not appear to be valid.');
  }

  if(count($errors) > 0) {
    died($errors);
  }

    $email_message = "Form details below.\n\n";


    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }



    $email_message .= "First Name: ".clean_string($first_name)."\n";
    $email_message .= "Last Name: ".clean_string($last_name)."\n";
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Phone: ".clean_string($phone)."\n";
    $email_message .= "Company: ".clean_string($phone)."\n";
    $email_message .= "Role: ".clean_string($phone)."\n";
    $email_message .= "Comments: ".clean_string($comments)."\n";

// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
@mail($email_to, $email_subject, $email_message, $headers);
?>

<!-- include your own success html here -->

echo json_encode('Thank you for contacting us. We will be in touch with you very soon.');

<?php

}
?>
