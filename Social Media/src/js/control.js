import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

// Local storage informations (loggedIn user)
import getLocalStorage  from './bookmarkLogin.js';
getLocalStorage();
import { loggedIn, userID} from './bookmarkLogin.js';


import * as helperFuncs from './helperFunctions.js';

import * as WorkWithData from './workWithData.js';

import registrationFunction from './registration.js';

import { editProfileLayout } from './editProfile.js';


import view from './view.js';

import { displayMessage } from './registration.js';

// Elements
const showLeftSideBTN = document.querySelector('.toggle__left');
const showRightSideBTN = document.querySelector('.toggle__right');
const hideLeftSideBTN = document.querySelector('.button__close__left');
const hideRIghtSideBTN = document.querySelector('.close__right__side');


const showLoginFormBTN = document.querySelector('.switchToLogin');
const showRegisterFormBTN = document.querySelector('.switchToRegister');


// Funkcija koja prikazuje register ili login formu
function toggleSection(div){
div.classList.toggle('activeDiv');
};


// All about registration
import {registrationBTN, registrationForm, registerName, registerLastName, registerEmail, registerPassword} from './registration.js'; //Elements for registration


//All about login
import loginFunction, { loginBTN, loginEmail, loginPassword, displayLoginMessage, loginSpinner } from './login.js'; // Elements and functions for Login


// Display login or registration form
const switchForm = function (){
    document.querySelectorAll('.form__place').forEach(div=>div.classList.toggle('hidden'));
};


//////////////////////////////////////////////////////////
///////////////// R E G I S T R A T I ON   B T N 
//////////////////////////////////////////////////////////
registrationBTN.addEventListener('click',  function(e){

        e.preventDefault();

        // Helper functions, check valid inputs
        const checkValueOfInputs = helperFuncs.checkValueOfInputs(registerEmail, registerLastName, registerName,registerPassword);
    
        const checkValidEmail = helperFuncs.checkValidEmail(registerEmail);

        const checkValidPassword = helperFuncs.checkValidPassword(registerPassword);
    
    
        // Input values
        const firstName = helperFuncs.correctInput(registerName.value);
        const lastName = helperFuncs.correctInput(registerLastName.value);
        const password = registerPassword.value;
        const email = registerEmail.value.trim();
    
        

        // Object with information about new user
        const registerObject = {
            first_name:firstName,
            last_name:lastName,
            password:password,
            email:email,
        };
    

        if(checkValueOfInputs && checkValidEmail && checkValidPassword) {
             registrationFunction(registerObject);

        } else {
            displayMessage(`Greška u podacima`);
        }
});




//////////////////////////////////////////
///////////////// L O G I N   B T N 
/////////////////////////////////////////
loginBTN.addEventListener('click', async function(e){
    e.preventDefault();
    try {
     // Start loading
     loginSpinner(true);

    const validInputsCheck = helperFuncs.checkValueOfInputs(loginEmail, loginPassword);
    const checkValidPassword = helperFuncs.checkValidPassword(loginPassword);
    const checkValidEmail = helperFuncs.checkValidEmail(loginEmail);

    // Logged user
    let user = {};

   if(validInputsCheck && checkValidPassword && checkValidEmail) {
     user = await loginFunction(loginEmail.value, loginPassword.value);
   } else {
       throw new Error('Greška u podacima');
   }

   // Display
   view._render(user);


   // Stop loading
   loginSpinner(false);
   // Remove message
   displayLoginMessage('');
    } catch(err){
        displayLoginMessage(err.message);
    };


});




// If the user is already logged in, load the homepage with his data, if not let him log in

const loadLoggedUser = async function(){
    try {
        // 1) Get all users
        const users = await WorkWithData.getDataUsers();

        // 2) Find logged in user (localstorage informations)
        const loggedUser = await users.find(user=>user.id===userID.toString());

        if(loggedIn){
            view._render(loggedUser) 
        } else {
            return;
        }
       
    } catch(err){
        console.log(err);
    }
};



// INIT
(()=>{
    showRegisterFormBTN.addEventListener('click', switchForm);
    showLoginFormBTN.addEventListener('click', switchForm); 
    loadLoggedUser();
    showLeftSideBTN.addEventListener('click', toggleSection.bind(this, document.querySelector('.leftSide')));
    hideLeftSideBTN.addEventListener('click', toggleSection.bind(this, document.querySelector('.leftSide')));
    showRightSideBTN.addEventListener('click', toggleSection.bind(this, document.querySelector('.homepage_right')));
    hideRIghtSideBTN.addEventListener('click', toggleSection.bind(this, document.querySelector('.homepage_right')));

})();



editProfileLayout.addEventListener('click',  function(){
const editProfileDiv = document.querySelector('.edit__profile__section ');
editProfileDiv.classList.toggle('hidden');
});

