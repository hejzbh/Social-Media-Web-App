import  * as WorkWithData from './workWithData.js';
import * as helperFuncs from './helperFunctions.js';
import {loggedOrLogout} from './bookmarkLogin.js';
import profilePhoto from '../../dist/profile-photo.daf813e7.png';
import weatherPhoto from '../../dist/weatherPNG.406523be.png';
import editProfile from './editProfile.js';




class view{
    // Sections
    _homepage = document.querySelector('.homepage__section');
    _entrySection = document.querySelector('.entry__section');

    // User info (sidebar)
    _profileDiv = document.querySelector('.user__info');
    _profileName = document.querySelector('.user__name');

    // DIV about posts (list of post, contain all buttons for posts and more)bubbling
    _divForPosts = document.querySelector('.list__of__post');
 
    // Textarea value of post
    _postTextArea = document.querySelector('#post__content');


    // Buttons
    _submitPostBTN = document.querySelector('.submit__post');
    _logoutBTN = document.querySelector('.logout');
    _editProfileBtn = document.querySelector('.edit__profile');

    
    

    _userLocale = navigator.language;

    // All data from user
    _userInfo;
    /**
     * 
     * @param {data} // Logged in user data 
     */

    _render(data){
        this._userInfo = data;
     
        // Send to the browser information that the user is LOGGED IN and in case of a reload to stay logged in
        loggedOrLogout(true, +this._userInfo.id);

        this._renderAllPosts();
        
        this._loadBasicsInfo();
        this._toggleSections();
        this._loadAllUsers();

        // Buttons funcionality
                this.addPostBTN();
        this._reactionsOnPost();
        this._editProfileBTN();
        this._searchUserEvent();
        this._showWeatherData();
      


        this._logoutBTN.addEventListener('click', this._logout.bind(this));

        
    };

    _getPosition(){
        return new Promise(function(resolve, reject){
            navigator.geolocation.getCurrentPosition(resolve, function(){
                reject('Not found');
            });
        });
    }

   async _showWeatherData(){
        try {
            const positionOfUser = await this._getPosition();

            const {latitude:lat, longitude:lng} = positionOfUser.coords;

            const geoAPI = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
            const geoData = await geoAPI.json();


            const weatherAPI =  await fetch(`https://api.weatherapi.com/v1/current.json?key=73cf5f2a536e414d8b5192121222804&q=${geoData.city}`);

        
            const {current, location} = await weatherAPI.json();
            
            this._insertWatherHTML(current, location);
        } catch(err){
            console.log(err);
        }
    }

    _insertWatherHTML(current, location){
        const weatherDiv = document.querySelector('.weather');

weatherDiv.innerHTML = `
<div class="top">
<div class="temp__details">
 <p class="user__city">${location.name}, ${location.region}</p>
 <p class="weather__date">${new Intl.DateTimeFormat(this._userLocale).format(new Date(current.last_updated))} last updated</p>
</div>
 <div class="temp_div">
     <h4><span class="temp">${current.temp_c}</span> °C</h4>
 </div>
</div>
<img src="${weatherPhoto}" alt="">
<div class="weather__bottom">
 <p>Humidity: <span class="humidity">${current.humidity}</span> %</p>
 <p>Wind: <span class="weather__wind">${current.wind_kph}</span> km/h</p>
</div>
`;

    }



    _editProfileBTN(){
        const thisClass = this;
        this._editProfileBtn.addEventListener('click', function(){
            new editProfile(thisClass._userInfo);
        });
    };

    // Enable search input to do something...
    _searchUserEvent(){
        const input = document.querySelector('.search__users');
        const thisClass = this;

        input.addEventListener('keyup', function(){
      
            const value = this.value!=='' ? helperFuncs.correctInput(this.value) : '';

            thisClass._searchUsers(value);
        });
    }

    // Function which target by INPUT search
   async _searchUsers(searchValue){
    const listOfUsers = document.querySelector('.list__of__users');
        try {
         

            if(searchValue===''){
                this._loadAllUsers();
                return;
            };

            // 1) All users
            const allUsers = await WorkWithData.getDataUsers();

            // 2) Filter users by search input
            const usersBySearch = allUsers.filter(user=>user.first_name.includes(searchValue) || user.last_name.includes(searchValue));
          
    
            // 3) Empty array ? No users.
            if(usersBySearch.length===0) throw new Error('User not found');

           
            // 4) Create html for each filtered user
            let html = usersBySearch.map(user=>this._generateUsersHTML(user.first_name, user.last_name)).join('');

            // 5) Clear full list
            listOfUsers.innerHTML='';

            //6) Insert only filtered users
            listOfUsers.insertAdjacentHTML('afterbegin', html);


        } catch(err){
            listOfUsers.innerHTML = err;
        }
    }

  
    ///////////////////////////////////////
    ////// P O S T S 
    ///////////////////////////////////////
    addPostBTN(){
        this._submitPostBTN.addEventListener('click', this._newPost.bind(this));
    };

    async _newPost(e){
        e.preventDefault();
   
       try {   
           // Check value of textarea
          const checkContent = helperFuncs.checkValueOfInputs(this._postTextArea);
   
          // Create post object
           const newPost = {
               content:this._postTextArea.value,
               user_id:this._userInfo.id
           };

           // If is it true (textarea not empty), just send to API.
           if(checkContent) await WorkWithData.sendDataPosts(newPost); 
           if(!checkContent) throw new Error('Ne mozete postaviti prazan status.');

           // Display new post in DOM
          await this.displayNewPost();

          // Enable delete post button
           this._deletePostBTN();
   
   
       } catch(err){
           console.log(err + 'post');
       }
       };

       
    async displayNewPost(){
        try {
            // 1) Get all posts
            const allPosts = await WorkWithData.getDataPosts();
        
            // 2) Take the last post (logic - new post)
            const [newPost] = allPosts.slice(-1);
      
            // 3) Generate POST html with newPost 
            const newPostHTML = this.generatePostHTML(newPost);
      
    
            // 4) Insert in DIV
            this._divForPosts.insertAdjacentHTML('afterbegin',newPostHTML);

   
    
        }catch(err){
            console.log(err + 'post');
        };
        };  
  
  generatePostHTML(post){
   return `
   <div class="post white__section" id="${post.id}" data-post-id="${post.id}">
   <div class="post__creator__info">
   <div class="post__left">
   <img src="${profilePhoto}" alt="">
    <div class="personal__info">

        <p><span class="creator__name">${this._userInfo.first_name}</span> posted</p>
        <p class="date">${this._formatDates(new Date(post.createdAt))}</p>
    </div>
    <button class="delete__post" data-delete="${post.id}"><i class="fa-solid fa-trash"></i></button>
    </div>
  </div>
  <div class="post__content">
    <p>${post.content}</p>
  </div>
  <div class="post__react">
    <button class="likePost" data-like-to=${post.id}><i class="fa-solid fa-heart"></i><p class="numberOfLikes">0</p></button>
    <form action="" class="comment__form">
    <textarea placeholder="Add comment" id="comment-${post.id}" rows="2"></textarea>
    <button class="submit__comment" data-post-to=${post.id}>Comment</button>
    </form>
  </div>
  <div class="list__of__comments"></div>`;
      };


    ///////////////////
    // Enable deletePostFunction to all 'delete__post' buttons
    // Ovu funkciju pokrecemo u renderAllPosts kada se svi postovi ucitaju, a također
    // je pokrecemo i kada dodamo novi post, jer postoji sansa da nema postova na sajtu 
    // kada udjemo, te onda nece postojati ni ovaj button i izbacit ce nam error
    // da ne moze naci 'detele__post' button, a ovako smo sigurni.
    _deletePostBTN(){
        const thisClass = this;
        document.querySelectorAll('.delete__post').forEach(btn=>{
            btn.addEventListener('click', function(e){
                const btn = e.target.closest('.delete__post');
                if(!btn) return;

                const postID = btn.getAttribute('data-delete');

                thisClass._deletePostFunction(postID);
             
            }); 
        });
    }

    /**
     *  Function for deleting the post we clicked on
     * @param {*} id postID
     */
   async _deletePostFunction(id){
        try {
            // 1) Get all posts
            const allPosts = await WorkWithData.getDataPosts();

            // 2) Find post with ID (parametar)
            const postForDelete = allPosts.find(post=>post.id===id);
        
            // 3) Permision to delete ?
            const allowOrReject = postForDelete.user_id === this._userInfo.id;

            // 4) Permission = true ? delete : else reject.
            if(allowOrReject) {
               await  this._deleteCommentsOfPost(id);
               await WorkWithData.deleteDataPosts(id);
            } else {
                this._errorHandling('This is not your post, you cannot delete it', 'linear-gradient(to top, #ef473a, #cb2d3e)');
                return;
            }

            // 5) Delete post from DOM
            document.getElementById(id).remove();


        }catch(err){    
            console.log(err)
        }
    };  




  
    ///////////////////////////////////////
    ////// C O M M E N T S / L I K E S
    ///////////////////////////////////////
    _reactionsOnPost(){
        const userInfo = this._userInfo; //Logged user info
        const thisClass = this; // This class
            this._divForPosts.addEventListener('click', function(e){
                e.preventDefault();
        
    
                // <<<< COMMENT POST BUTTON>>>>
                if(e.target.classList.contains('submit__comment')){
                    const btn = e.target.closest('.submit__comment');

                    // Take post ID
                    const postID = +btn.getAttribute('data-post-to');

                    // Take textarea with same post ID
                    const commentContent = document.querySelector(`#comment-${postID}`);

                    // Check is it empty?
                    const allowOrReject = helperFuncs.checkValueOfInputs(commentContent);
    
                    // Generate post object
                    const newCommentData = {
                        content : commentContent.value,
                        user_id:  userInfo.id,
                        post_id:postID
                    };
    
            
                   //allow === true ? Post new comment ELSE nothing.
                    allowOrReject ?  thisClass._newComment(newCommentData,postID) : '';
                }



                // <<<< LIKE POST BUTTON>>>>    
                if(e.target.classList.contains('likePost')){
                    const btnLike = e.target.closest('.likePost');
                    if(!btnLike) return;
      

                    // Take post ID
                    const postID = btnLike.getAttribute('data-like-to');
                 
    
                    //Generate like object
                    const newLikeData = {
                        user_id:userInfo.id,
                        post_id:postID
                    };

                    
                    thisClass._newLike(btnLike,newLikeData);
                   
                }

                else {
                    return;
                }
            }); 
    };
   

    /**
     * 
     * @param {*} btn The button we clicked
     * @param {*} newLikeData Generated like object (data...)
     */
  async  _newLike(btn,newLikeData){
        try {
            // 1) Get all likes
            const allLikes = await WorkWithData.getDataLikes();

            // Make sure the user who clicked the like already liked the same post
            const likeExist = allLikes.find(like=>like.user_id===this._userInfo.id && like.post_id === newLikeData.post_id);

      
            // Get <i> and numberOfLikes from BTN
            const [icon, numberOfLikes] = btn.children;

            // Take numbersOfLikes
            const likes = +numberOfLikes.innerHTML;

            // likeExist ? Just delete it, and set numberOfLikes --
            if(likeExist){
               WorkWithData.deleteDataLikes(likeExist.id);
               icon.style.color='gray';
               numberOfLikes.textContent = likes-1;
              
            } // Else ? Just send new likes and set numberOfLikes++
            else {
               WorkWithData.sendDataLikes(newLikeData);
               icon.style.color='red';
               numberOfLikes.textContent = likes+1;

          
            }
         
        } catch(err){
            console.log(err + 'like');
        }
    };


    async _newComment(newCommentData, postID){
        try {
         // 1) Send new comment
         await WorkWithData.sendDataComment(newCommentData);

         // 2) Get all comments
         const comments = await WorkWithData.getDataComments();

         // 3) Take the last comment (logic - new comment)
         const [newCom] =  comments.slice(-1);

         // 4) Display new comment on that POST (postID)
         this.displayNewComment(newCom, postID);


        
        }catch(err){
            console.error(err + 'COMMENT 🎃');
        }
    };

    async _deleteCommentsOfPost(postID){
        try {   
            // 1) Get all comments
            const allComments = await WorkWithData.getDataComments();
    
    
            // 2) Comments of postID (== for numbers and strings)
            const commentsForDelete =allComments.filter(comm=>comm.post_id==postID);
            if(!commentsForDelete) return;

            // 3) Delete
            commentsForDelete.forEach(async com=>await WorkWithData.deleteDataComment(com.id));
    
    
        } catch(err){
            return err;
        }
        }

    
    /**
     * 
     * @param {newComment} comment new Comment
     * @param {*} postID Post in which we will insert a new comment
     */
    displayNewComment(comment, postID){
        const html = this.generateNewCommentHTML(comment);

        //is it sense ? (postID)
        const div = document.getElementById(postID).querySelector('.list__of__comments');

        div.insertAdjacentHTML('afterbegin', html);
    };  


    generateNewCommentHTML(comment, i, userOfComment){
        return `
        <div class="comment" id=${comment.post_id} data-post="˘${comment.post_id}">
        <img src="${profilePhoto}" alt="">
        <div class="comment__info">
        <p class="comment__user">${userOfComment? userOfComment(i).first_name : this._userInfo.first_name}</p>
        <p class="comment_date">${this._formatDates(new Date(comment.createdAt))}</p>
        <p class="comment__content">${comment.content}</p>
        </div>
    </div>
        `;
    };


  


  // Render all 
  async _renderAllPosts(){
      
        try {
            // Start loading
            this._spinner(true);
          
            // 1) Get all data from API
            const [allPosts, allUsers, allComments,allLikes] = await Promise.all([
                Array.from(await WorkWithData.getDataPosts()),
                Array.from(await WorkWithData.getDataUsers()),
                Array.from(await WorkWithData.getDataComments()),
                Array.from(await WorkWithData.getDataLikes())
            ]);
       

            // 2) allPosts array is empty? Display message "Nema postova!"
            if(allPosts===[]) throw new Error(`Nema postova!`);
          
          // continue...
          let  html = ``;

          // Shallow copy of AllPosts (because we need .reverse() to display a new posts first)
          const allPostsCopy = allPosts.slice();

            


        allPostsCopy.reverse().forEach(post => {
         // Owner of this post
         const userOfPost = allUsers.find( user =>  user.id===post.user_id);
        
         // Comments
         const commentsOfThisPost = allComments.filter( obj=>obj.post_id==post.id);
     
         // User of comment
         const userOfComment = (i) => allUsers.find( user =>  user.id===commentsOfThisPost[i].user_id);

         // Likes
         const likesOfPost = allLikes.filter(like=>like.post_id==post.id);

         // If current user liked this post, set red color on button like
         const colorfulLike = () => {

           const thisUserLikedCheck = likesOfPost.some(like=>like.user_id===this._userInfo.id);

            if(thisUserLikedCheck) return `style="color:red"`;
            else return;

         }
        
         

        html += `
        <div class="post white__section" id="${post.id}" data-post-id="${post.id}">
        <div class="post__creator__info">
        <div class="post__left">
        <img src="${profilePhoto}" alt="">
         <div class="personal__info">
     
             <p><span class="creator__name">${userOfPost.first_name}</span> posted</p>
             <p class="date">${this._formatDates(new Date(post.createdAt))}</p>
         </div>
         <button class="delete__post" data-delete="${post.id}"><i class="fa-solid fa-trash"></i></button>
         </div>
     </div>
     <div class="post__content">
         <p>${post.content}</p>
     </div>
     <div class="post__react">
         <button class="likePost" data-like-to=${post.id} ${colorfulLike()}><i class="fa-solid fa-heart"></i><p class="numberOfLikes">${likesOfPost!==[] ? likesOfPost.length : 'like' }</p></button>
         <form action="" class="comment__form">
         <textarea placeholder="Add comment" id="comment-${post.id}" rows="2"></textarea>
         <button class="submit__comment" data-post-to=${post.id}>Comment</button>
         </form>
     </div>
     <div class="list__of__comments">
     ${commentsOfThisPost!==[] ? commentsOfThisPost.map((comment, i)=>this.generateNewCommentHTML(comment, i, userOfComment)).join(''):''}
     </div>
 </div>
`;
}); 


          // Stop loading
          this._spinner(false);

          // Insert HTML in div
          this._divForPosts.insertAdjacentHTML('afterbegin', html);

          // Enable delete post
          this._deletePostBTN();

          
        } catch(err){
            this._divForPosts.innerHTML = err;
        }
    }


    // Display personal info
    _loadBasicsInfo(){
        this._profileName.textContent = `${this._userInfo.first_name}  ${this._userInfo.last_name}`;
    };         



    // Show homepage - hide register and reverse
    _toggleSections(){
        this._entrySection.classList.toggle('hidden');
        this._homepage.classList.toggle('hidden');
    }

    // Loading
    _spinner(setAndClear = false){
    this._divForPosts.innerHTML = setAndClear ? `<div class="spinner">
    <i class="fa-solid fa-rotate"></i>
</div>` : '';
    }

    // Format dates by user locale
    _formatDates(date){
        const differentBetwenTwoDates = (date1, date2) =>Math.floor(Math.abs((date1-date2)/(1000*60*60*24)));

        const result = differentBetwenTwoDates(new Date(), date);

        if(result===0) return 'Today';
        if(result===1) return `Yasterday`;
        if(result<=7) return `${result} days ago`
        else {
            return new Intl.DateTimeFormat(this._userLocale).format(date);
        }
    };

    _generateUsersHTML(firstName, lastName){
        return `
        <li class="user__exist">
           <img src="${profilePhoto}" alt="">
           <p>${firstName} ${lastName}</p>
       </li>
        `;
    };

    // Load All users and display in LIST OF USERS (RIGHT SIDEBAR)
   async _loadAllUsers(){
        try {
            const allUsers = await WorkWithData.getDataUsers();
            const listOfUsers = document.querySelector('.list__of__users');

           listOfUsers.innerHTML = '';

           let html = allUsers.map(user=>this._generateUsersHTML(user.first_name, user.last_name)).join('');


            listOfUsers.insertAdjacentHTML('afterbegin', html);

        } catch(err){
            console.log(err);
        };

    };


    //Error handling
    _errorHandling(msg,bg=''){
        const div = document.querySelector('.error__handling');
        div.classList.remove('hidden');
        div.style.background = bg;
        div.children[0].textContent = msg;
        setTimeout(() => {
            div.classList.add('hidden');
        }, 3000);
    }
    /**
     * Function to logout from a profile
     * Set FALSE to "logged" variable
     * (more in bookmarkLogin.js)
     */
    _logout(){
        loggedOrLogout(false, +this._userInfo.id);
        this._toggleSections();
      
     };


   
};

export default new view();