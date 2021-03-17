function sendOrderByEmail() {

    fetch('/isUserLoggedIn', { method: 'POST', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } })
    // Handle success
    .then(response => response.json())  // convert to json
    .then(json => {
       
        
        if(json.loggedin)
        alert("Your order has been placed!");
          else
          alert("You must be logged in to place an order!");
    
    })   
    .catch(err => console.log('Request Failed', err)); // Catch errors

}

