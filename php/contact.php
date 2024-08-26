<?php
// Initialiser les variables
$array = array(
    "firstname" => "",
    "name" => "",
    "email" => "",
    "phone" => "",
    "message" => "",
    "firstnameError" => "",
    "nameError" => "",
    "emailError" => "",
    "phoneError" => "",
    "messageError" => "",
    "isSuccess" => false
);

$emailTo = "adnanraiti@gmail.com";

// Traitement du formulaire lorsqu'il est soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validation des champs du formulaire
    $array["firstname"] = verifyInput($_POST["firstname"]);
    $array["name"] = verifyInput($_POST["name"]);
    $array["email"] = verifyInput($_POST["email"]);
    $array["phone"] = verifyInput($_POST["phone"]);
    $array["message"] = verifyInput($_POST["message"]);
    $array["isSuccess"] = true;
    $emailText = "";

    if (empty($array["firstname"])) {
        $array["firstnameError"] = "Le prénom que vous avez saisi est incorrect.";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Prénom: {$array["firstname"]}\n";
    }

    if (empty($array["name"])) {
        $array["nameError"] = "Le nom que vous avez saisi est incorrect.";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Nom: {$array["name"]}\n";
    }

    if (!isEmail($array["email"])) {
        $array["emailError"] = "L'adresse email que vous avez saisie semble incorrecte.";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Email: {$array["email"]}\n";
    }

    if (!isPhone($array["phone"])) {
        $array["phoneError"] = "Le numéro de téléphone que vous avez saisi semble incorrect.";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Téléphone: {$array["phone"]}\n";
    }

    if (empty($array["message"])) {
        $array["messageError"] = "Le message que vous avez saisi semble incorrect ou manquant.";
        $array["isSuccess"] = false;
    } else {
        $emailText .= "Message: {$array["message"]}\n";
    }

    if ($array["isSuccess"]) {
        // Spécifier le bon encodage dans les en-têtes
        $headers = "From: {$array["firstname"]} {$array["name"]} <{$array["email"]}>\r\n";
        $headers .= "Reply-To: {$array["email"]}\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        mail($emailTo, "Un message de votre site", $emailText, $headers);
    }

    echo json_encode($array);
}

// Fonction pour vérifier et nettoyer les données
function verifyInput($var) {
    $var = trim($var);
    $var = stripslashes($var);
    $var = htmlspecialchars($var, ENT_QUOTES, 'UTF-8');
    return $var;
}

function isPhone($var) {
    return preg_match("/^[0-9 ]*$/", $var);
}

function isEmail($var) {
    return filter_var($var, FILTER_VALIDATE_EMAIL);
}
?>