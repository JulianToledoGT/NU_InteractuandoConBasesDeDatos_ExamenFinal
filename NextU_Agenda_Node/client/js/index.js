function login (){
    if ($('#user').val() != "" && $('#pass').val() != "") {
        $.post('http://localhost:8082/login',{user: $('#user').val(), pass: $('#pass').val()}, function(res) {
            if (res == "Validado") {
                sessionStorage.setItem('nu_agenda_user', $('#user').val());
                window.location.href = "main.html"
            }else{
                alert("Credenciales incorrectas. Verifique.")
            }
        })
    } else {
        alert("Complete todos los campos. Verifique.")
    }
};

$(document).keypress(function(event) {
    if (event.charCode === 13){login()}
});

$('#login').on('click', function(event) {
    login();
});
