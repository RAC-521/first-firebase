import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './FirebaseConfig';
// import "firebase/firestore";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '', 
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then( response => {
      const {displayName, email, photoURL} = response.user;    
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      };
      setUser(signedInUser);
    })
    .catch( error => {
      console.log(error);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then( response => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        isValid: false,
        error: '',
        isExistingUser: false,
      };
      setUser(signedOutUser);
    })
    .catch( error => {
      console.log(error);
    })
  }

  const isValidEmail = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = (input) => /\d/.test(input);
  
  const handleChange = (event) => {
    const newUserInfo = {...user};
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = isValidEmail(event.target.value);
    }
    else if(event.target.name === 'password'){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const switchForm = (event) => {
    const createdUser = {...user};
    createdUser.isExistingUser = event.target.checked;
    setUser(createdUser);
  }

  const signInUser = (event) => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then( response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch( error => {
        console.log(error.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then( response => {
        console.log(response);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch( error => {
        console.log(error.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = error.message;
        setUser(createdUser);
      })
    }
    else{
      console.log('Wrong email or password')
    }
   event.preventDefault();
   event.target.reset();
  }
  

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && 
          <div>
            <p>Welcome {user.name}</p>
            <p><small>Email: {user.email}</small></p>
            <img src={user.photo} alt=""></img>
          </div> 
      }
      <h1>Authentication</h1>
      <input onChange={switchForm} type="checkbox" name="switchForm" id="switchForm"/>
      <label htmlFor="switchForm">Returning user</label>

      <form style={{display: user.isExistingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input onBlur={handleChange} type="text" name="email" placeholder="Email..." required/> 
        <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Password..." required/>
        <br/>
        <input type="submit" value="Sign in"/>
      </form>

      <form style={{display: user.isExistingUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input onBlur={handleChange} type="text" name="name" placeholder="Name..." required/> 
        <br/>
        <input onBlur={handleChange} type="text" name="email" placeholder="Email..." required/> 
        <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Password..." required/>
        <br/>
        <input type="submit" value="Create account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
