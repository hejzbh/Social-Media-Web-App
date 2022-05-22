export const editProfileLayout = document.querySelector('.blur');

import * as helperFuncs from './helperFunctions.js';
import * as workWithData from './workWithData.js'

export default class editProfile{
    _editProfileSection = document.querySelector('.edit__profile__section');
    _closeBtn = document.querySelector('.close__edit');
    _personalInfoTextPlace = document.querySelectorAll('.edit__profile__info');
    _allInputs = document.querySelectorAll('.edit__input');
    _editButton = document.querySelector('.edit__profile__btn');
    _updateButton = document.querySelector('.update__user__info');
    
    constructor(dataFromView){
        this._userInfo = dataFromView; //

        // Show edit profile section
        this._toggleSections();

        // Load all information about user
        this._loadInfo();

        // Enable to hide profile section
        this._closeEditSectionPermission();

        // Enable to edit data
        this._editButton.addEventListener('click', this.toggleInputs.bind(this));

        // Enable to update data
        this._updateButton.addEventListener('click', this._updateCurrentUserData.bind(this));
    };

    //*********************/
    // METHOD #1
    //*********************/
    _loadInfo(){
        // For each text place (name, lastname, email, password), set user's info.
        this._personalInfoTextPlace.forEach(personalText=>{
           const property = personalText.getAttribute('data-properties');
            personalText.textContent = this._userInfo[property];
        });
    }


    //*********************/
    // METHOD #2
    //*********************/
    // Show all inputs (enable to put something in);

    toggleInputs(){
       this._allInputs.forEach((input, i)=>{
           input.classList.toggle('hidden');
           this._personalInfoTextPlace[i].classList.toggle('hidden');
        });

        this._updateButton.classList.toggle('hidden');
    }




    //*********************/
    // METHOD #3 - main method
    //*********************/

   async _updateCurrentUserData(){
   try {
    //1) Get all users
    const allUsers = await workWithData.getDataUsers();

    // 2) Get all inputs
    const emailInput = document.querySelector('.edit_email');
    const firstNameInput =document.querySelector('.edit_first_name');
    const lastNameInput = document.querySelector('.edit_last_name');
    const passwordInput = document.querySelector('.edit_password');

    // 3) Check that at least one input has value, as we are able to update one or more information
    const oneOfInputHasValue = [...this._allInputs].some(input=>input.value);

    // 4) firstNameInput.value!==''? >>>> That is the information we want to change
    const first_name = firstNameInput.value!=='' ? helperFuncs.correctInput(firstNameInput.value) : undefined;
    const last_name =lastNameInput.value!=='' ? helperFuncs.correctInput(lastNameInput.value) : undefined;
    const email = emailInput.value!=='' ? helperFuncs.correctInput(emailInput.value) : undefined;
    const password = passwordInput.value!==''? passwordInput.value : undefined;


    // 5) If we want to skip a field, make it valid (in order to successfully send what we want), and if we have written something in it, check if it is correct
   let  validPassword = true;
   passwordInput.value!==''? validPassword = helperFuncs.checkValidPassword(passwordInput) : '';
    
   
    let uniqueEmail = false;
    emailInput.value!==''? uniqueEmail = allUsers.some(user=>user.email===emailInput.value) : '';
    
    let validEmail = true;
    emailInput.value!==''? validEmail = helperFuncs.checkValidEmail(emailInput) : '';


    // 6) Object with new data, data is undefined > set old data, data is valid > set that data.

    const newUserData = {
        first_name : first_name || this._userInfo.first_name,
        last_name : last_name || this._userInfo.last_name,
        email:email || this._userInfo.email,
        password:  password || this._userInfo.password
    } 
 



    if(oneOfInputHasValue){
        if(validEmail && !uniqueEmail && validPassword){
            // Update user data
            await  workWithData.updateDataUser(this._userInfo.id, newUserData);
            // Display success message
            this._errorOrSuccessMSG('Successfully', 'linear-gradient(to right, #F8FFAE, #43C6AC)');
            // Update info 
            this._updateView();
        } else {
           this._errorOrSuccessMSG('Error', 'linear-gradient(to top, #ef473a, #cb2d3e)');
        }
    }  else {
        this._errorOrSuccessMSG('Empty fields!', 'linear-gradient(to top, #ef473a, #cb2d3e)');
    }


   }catch(err){
       this._errorOrSuccessMSG(err);
   }      
};

    //*********************/
    // METHOD #4
    //*********************/
   async _updateView(){
        try {
            // 1) Get all users
            const allUsers = await workWithData.getDataUsers();

            // 2) Find new current user data 
            const newData = allUsers.find(user=>user.id===this._userInfo.id);

            // 3) Update
            this._userInfo = newData;

            // 4) Render new data
            this._loadInfo();

            location.reload();
        } catch(err){
            throw err;
        }
    };

    //*********************/
    // METHOD #5
    //*********************/

    _toggleSections(){
        this._editProfileSection.classList.toggle('hidden');
    }


    //*********************/
    // METHOD #6
    //*********************/
    _closeEditSectionPermission(){
        this._closeBtn.addEventListener('click', this._toggleSections.bind(this));
    }


    //*********************/
    // METHOD #7
    //*********************/
    _errorOrSuccessMSG(msg,bg='gray'){
        const div = document.querySelector('.error__handling');
        div.classList.remove('hidden');
        div.style.background = bg;
        div.children[0].textContent = msg;
        setTimeout(() => {
            div.classList.add('hidden');
        }, 3000);
    }
};

//export default new editProfile();