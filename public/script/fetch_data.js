function fetchUsers() {

// Make a request to this route. The response will be the JSON representation 5 rows in the db table. 
fetch('/getUsers')
    // Handle success
    .then(response => response.json())  // convert to json
    .then(json => {
       
        var str = JSON.stringify(json, null, 2); // spacing level = 2
        //document.getElementById("display").innerHTML = str;

        //console.log(json)
        //console.log(str);
        var obj = JSON.parse(str);
        console.log(obj)

        //get a div element called user and remove all the elements from it using while loop. 
        var elements = document.getElementsByClassName("user");
       while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    //this code will dynamically and programatically create html elements to display on the page. 
        for(var i = 0; i < obj.length; i++) {
            
           // var id1 = document.createTextNode(obj[i].id);
            var username1 = document.createTextNode("Username: "+ obj[i].username);
            var email1 = document.createTextNode("E-mail: "+obj[i].email);
            var isAdmin1 = document.createTextNode("isAdmin: "+ obj[i].isAdmin);
        

            var usernameElement = document.createElement("div");
            var emailElement = document.createElement("div");
            var isAdminElement = document.createElement("div");
            var showInfoButton = document.createElement("button");
            var deleteButton = document.createElement("button");
            var updateButton = document.createElement("button");
            updateButton.id = obj[i].email;
            updateButton.textContent = "Update user";
            updateButton.className = "updateButton";
            updateButton.onclick = updateUser(updateButton.id);
            deleteButton.id = obj[i].email;
            deleteButton.textContent = "Delete user";
            deleteButton.className = "deleteButton";
            deleteButton.onclick = deleteUser(deleteButton.id);
            showInfoButton.textContent = "Show info";
            showInfoButton.id = obj[i].email;
            showInfoButton.className = "infoButton";
            showInfoButton.onclick = showInfo(showInfoButton.id);
            emailElement.className = "email";
            isAdminElement.className = "isAdmin";
            usernameElement.className = "username";
            usernameElement.appendChild(username1);
            emailElement.appendChild(email1);
            isAdminElement.appendChild(isAdmin1);
     
            var div = document.createElement("div");
            div.className="user";
            div.appendChild(usernameElement);
            div.appendChild(emailElement);
            div.appendChild(isAdminElement);
            div.appendChild(showInfoButton);
            div.appendChild(deleteButton);
            div.appendChild(updateButton);

            document.body.appendChild(div);
            
        }
        
    })   
    .catch(err => console.log('Request Failed', err)); // Catch errors


}


function showInfo(clickedId){
    //return wrapped function so we can assign the function to a variable along with a parameter without
    //calling the function directly
    return function(){
    var email = clickedId;
    console.log("id: "+email);
    // Make a request to this route. 
fetch('/showUserInfo', { method: 'POST', headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, body: JSON.stringify({ email:email }) })
// Handle success
.then(response => response.json())  // convert to json
.then(json => {
   
    var str = JSON.stringify(json, null, 2); // spacing level = 2
    //document.getElementById("display").innerHTML = str;

    //console.log(json)
    //console.log(str);
    var obj = JSON.parse(str);
    console.log(obj)

})   
.catch(err => console.log('Request Failed', err)); // Catch errors
}
}

function deleteUser(clickedId){

    //return wrapped function so we can assign the function to a variable along with a parameter without
    //calling the function directly
    return function(){
        var email = clickedId;
        console.log("id: "+email);
        // Make a request to this route. The response will be the JSON representation 5 rows in the db table. 
    fetch('/deleteUser', { method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify({ email:email }) })
    // Handle success
    .then(response => response.json())  // convert to json
    .then(json => {
       
        console.log("deleted");
    
        fetchUsers();
    
    })   
    .catch(err => console.log('Request Failed', err)); // Catch errors
    }


}

function updateUser(clickedId){

     //Modal code below 
     return function(){
        var email = clickedId;
        console.log("id: "+email);
// Get the modal
var modal = document.getElementById("modal1");
console.log("Modal id: "+modal.id);

// Get the button that opens the modal
var btn = document.getElementById(clickedId);
console.log("Button id: "+ btn.id)

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close1")[0];

// When the user clicks on the button, open the modal
  modal.style.display = "block";

  var currentUserNameField = document.getElementById("current_name");
  var currentEmailField = document.getElementById("current_email");
  var currentUserNameFieldHidden = document.getElementById("current_name_hidden");
  var currentEmailFieldHidden = document.getElementById("current_email_hidden");

  fetch('/showUserInfo', { method: 'POST', headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }, body: JSON.stringify({ email:email }) })
// Handle success
.then(response => response.json())  // convert to json
.then(json => {
   
    var str = JSON.stringify(json, null, 2); // spacing level = 2
    
    var obj = JSON.parse(str);
    console.log(obj[0].username);
    console.log(obj[0].email);
    currentUserNameFieldHidden.value=obj[0].username;
    currentEmailFieldHidden.value=obj[0].email;
    console.log("Hidden email value: "+currentEmailFieldHidden.value);
    currentUserNameField.value=obj[0].username;
    currentEmailField.value=obj[0].email;
    console.log("current email value: "+currentEmailField.value);
    

})   
.catch(err => console.log('Request Failed', err)); // Catch errors
  

  


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

     }

}




document.addEventListener('DOMContentLoaded', function() {
    

    //run this code when html page is finished loading. 
    fetchUsers();

  //  setInterval(function(){ 
        //do something here every 60 seconds
    //}, 60000);
        
}, false);







  
