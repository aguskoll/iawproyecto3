/**
 * Created by tino on 16/06/2016.
 */
  var arrayDatosUsuario=new Array();
   var ID;

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var id_token = googleUser.getAuthResponse().id_token;
    localStorage['googleToken'] =id_token;
    //console.log(id_token);

    arrayDatosUsuario=new Array();
    ID=profile.getId();
    arrayDatosUsuario['ID']= ID;
    arrayDatosUsuario['Nombre']=profile.getName();
    arrayDatosUsuario['Imagen']=profile.getImageUrl();
    arrayDatosUsuario['Email']=profile.getEmail();
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
      //  console.log('User signed out.');
        ID=null;
    });

   
}