import * as WorkWithData from './workWithData.js';

export const registrationBTN = document.querySelector('.btn__register');
export const registrationForm = document.querySelector('.form__register');
export const registerName = document.querySelector('.input__name');
export const registerLastName = document.querySelector('.input__lastname');
export const registerEmail = document.querySelector('.input__email__registration');
export const registerPassword = document.querySelector('.input__password__registration');

const registrationMessage  = document.querySelector('.registration__message');

// Display error or success message in register form
export const displayMessage = function(message = 'Something went wrong', color = 'red'){
    registrationMessage.innerHTML = message;
    registrationMessage.style.color=color;
};

// Clear all inputs from registration form
const clearInputFields = function(){
registerName.value = registerLastName.value = registerEmail.value =registerPassword.value='';
};


// Register new user
export default async function(obj){
   try {
    // 1) Get all users
    const listOfUsers = await WorkWithData.getDataUsers();

    // 2) Check if there some user with same email
    const allowOrReject = listOfUsers.some(user => user.email === obj.email);

    
    // 3) If not, send new user data to API, else reject.
    if(!allowOrReject){
        await WorkWithData.sendDataUser(obj);
        displayMessage('Uspjesno kreiran acc', 'green');
        clearInputFields();
    } else {
        throw new Error('Ta email adresa se vec koristi');
    }
   }catch(err){
    displayMessage(err.message, 'red');
   }
  
};


