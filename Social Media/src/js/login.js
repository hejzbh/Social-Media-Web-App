import * as WorkWithData from './workWithData.js';


export const loginBTN = document.querySelector('.btn__login');
export const loginEmail = document.querySelector('.input__email__login');
export const loginPassword = document.querySelector('.input__password__login');


const loginDiv = document.querySelector('.login__message');


// Display error, or sucess message in login form
export const displayLoginMessage = (message = 'Something went wrong')=>{
    loginDiv.innerHTML = message;
};

// Spinner for loading data (true = load, false = stopLoad);
export const loginSpinner = (check = true)=>{
 loginDiv.innerHTML = check ? `<div class="spinner">
 <i class="fa-solid fa-rotate"></i>
</div>` : '';
};


// Function for login user
export default async function(email, password){
 try {
    // 1) Get all users
    const listOfUsers = await WorkWithData.getDataUsers();

    // 2) Check if there is a user we sent
    const accountExist = listOfUsers.find(user=>user.email===email && user.password === password);

    // 3) True = return that dataObject for next actions, else = display error message
    if(accountExist) {
        return accountExist;
    } else {
        throw new Error(`We couldn't find an account matching the login info you entered`);
    }


 } catch(err){
throw err;
 }
};