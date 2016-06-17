/**
 * Created by tino on 16/06/2016.
 */
  var arrayDatosUsuario=new Array();
   var ID;
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    arrayDatosUsuario=new Array();
    ID=profile.getId();
    arrayDatosUsuario['ID']= ID;
    arrayDatosUsuario['Nombre']=profile.getName();
    arrayDatosUsuario['Imagen']=profile.getImageUrl();
    arrayDatosUsuario['Email']=profile.getEmail();

    console.log('ID: ' + ID); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + arrayDatosUsuario['Nombre']);
    console.log('Image URL: ' + arrayDatosUsuario['Imagen']);
    console.log('Email: ' + arrayDatosUsuario['Email']);
    


}
function  getIDUsuario() {

    return ID;
}

function googleIngreso(){
    

    if(ID!=null){
        
        return true;
    }
    else return false;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        ID=null;
    });

}