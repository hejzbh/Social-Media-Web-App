export let loggedIn = false;  
export let userID = 0; 

const setLocalStorage = function(){
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
    localStorage.setItem('userID', JSON.stringify(userID));
};


export function loggedOrLogout(boolean = false, id){
    loggedIn = boolean;
    userID=id;
    setLocalStorage();
};

// Get local storage
export default  function(){
    
    const loggedCheck = JSON.parse(localStorage.getItem('loggedIn'));
    const userLogged = JSON.parse(localStorage.getItem('userID'));
    //console.log(loggedCheck, userLogged);

    if(loggedCheck===undefined || userLogged===undefined)  return;
    loggedIn = loggedCheck;
    userID = +userLogged;
};


