function getsetcurrentusername(){
var user = firebase.auth().currentUser;

if (user != null) {
  name = user.displayName;
}else{
	name = "UNKNOWN"
}
document.getElementById("usernamechangeinput").value = name ;
}


function changeusername(){


}
