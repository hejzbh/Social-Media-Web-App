import { async } from "regenerator-runtime";
import { API } from "./config.js";

// MODUL for send/get data

// API FOR USERS ------------S T A R T---------- 
export const sendDataUser = async function(registrationData){
    try {
      const sending = await fetch(`${API}/users`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body : JSON.stringify(registrationData)
        });

        if(!sending.ok) throw new Error('Problem with registration');
    } catch(err){
        throw err;
    }
};



export const getDataUsers = async function(){
    try {
       const getUsers = await fetch(`${API}/users`);
       const users = await getUsers.json();

       return await users;
    }catch(err){
        throw err;
    }
};

export const updateDataUser = async function(id, newData){

    try {
        const updateCurrentUser = await fetch(`${API}/users/${id}`, {
            method: 'PUT',
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify(newData),
        });

        if(!updateCurrentUser.ok) throw new Error('Nemoguce azurirati usera');

   


    }catch(err){
        console.log(err + 'updateUserInfo');
    }
};






// API FOR POSTS ------------S T A R T---------- 

export const getDataPosts = async function(){
    try {
        const getPosts = await fetch(`${API}/posts`);

        const posts = await getPosts.json();

        return posts;
    } catch(err) {
        throw err;
    }
};

export const sendDataPosts = async function(newPost){
    try {
       const sending = await fetch(`${API}/posts`, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(newPost)
       });

       if(!sending.ok) throw new Error(`Nemoguce postaviti post.`);

    } catch(err) {
        throw err;
    }
};

export const deleteDataPosts = async function(postID){
    try {
        const deleteObj = await fetch(`https://61a6026d8395690017be8fd1.mockapi.io/posts/${postID}`, {
            method:'DELETE',
        });

        const data = await deleteObj.json();
    }catch(err){
        console.log(err);
    }
}

// API FOR COMMENT ------------S T A R T---------- 

export const getDataComments = async function(){
    try {
        const getComments = await fetch(`${API}/comments`);

        const comments = await getComments.json();

        return comments;
    } catch(err) {
        throw err;
    }
};

export const sendDataComment = async function(newComment){
    try {
       const sending = await fetch(`${API}/comments`, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(newComment)
       });

       if(!sending.ok) throw new Error(`Nemoguce poslati komentar.`);
       
    } catch(err) {
        throw err;
    }
};

export const deleteDataComment = async function(id){
    try {
        const deleteComment = await fetch(`${API}/comments/${id}`, {
            method:'DELETE',
           });
           
        if(!deleteComment.ok) throw new Error('Cannot delete comments');

    } catch(err){
        return err;
    }
}

// API FOR LIKES ------------S T A R T---------- 
export const getDataLikes = async function(){
    try {
        const getLikes = await fetch(`${API}/likes`);

        const likes = await getLikes.json();

        return likes;
    } catch(err) {
        throw err;
    }
};

export const sendDataLikes = async function(newLike){
    try {
       const sending = await fetch(`${API}/likes`, {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(newLike)
       });



       if(!sending.ok) throw new Error(`Nemoguce poslati like.`);
       console.log('poslano');
       
    } catch(err) {
        throw err;
    }
};

export const deleteDataLikes = async function(id){
    console.log(id);
    try {
       const deleteLike = await fetch(`${API}/likes/${id}`, {
        method:'DELETE',
       });

       console.log(deleteLike);

      

       
    } catch(err) {
        throw err;
    }
};