$(function(){
      // Ajoute un gestionnaire d'événement pour les clics sur les liens de la navbar et du footer
      $(".navbar a, footer a").on("click", function(event){
        event.preventDefault(); // Empêche le comportement par défaut du lien

        var hash = this.hash; // Récupère le hash du lien cliqué

        // Vérifie si l'élément cible existe
        if ($(hash).length) {
            $('body').animate(
                { scrollTop: $(hash).offset().top }, // Fait défiler la page jusqu'à l'élément ciblé
                900, // Durée de l'animation en millisecondes
                function() {
                    // Met à jour l'URL de la page avec le hash après l'animation
                    window.location.hash = hash;
                }
            );
        }
    });
    $('#contact-form').submit(function(e){
        e.preventDefault(); 
        $('.comments').empty();
        var postdata = $('#contact-form').serialize();

        $.ajax({
            type: 'POST',
            url: 'php/contact.php',
            data: postdata,
            dataType: 'json',
            success: function(result){
                if(result.isSuccess){
                    $("#contact-form").append("<p class='thank-you'>Votre message a bien été envoyé. Merci de m'avoir contacté !</p>");
                    $("#contact-form")[0].reset();
                } else {
                    $("#firstname + .comments").html(result.firstnameError);
                    $("#name + .comments").html(result.nameError);
                    $("#email + .comments").html(result.emailError);
                    $("#phone + .comments").html(result.phoneError);
                    $("#message + .comments").html(result.messageError);
                }
            }
        });
    });
})