import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

// Adding required Firebase products
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

var firebaseConfig = {
  apiKey: "AIzaSyAMKhcqboeEif8FH8jv3mh8_UMn6QjSRg0",
  authDomain: "easyjourney-7ed53.firebaseapp.com",
  projectId: "easyjourney-7ed53",
  storageBucket: "easyjourney-7ed53.appspot.com",
  messagingSenderId: "487954712334",
  appId: "1:487954712334:web:51c3d3caa7c23cb130395f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//Reference for "UserData" collection
const userRef = collection(db, "UserData");
export { userRef, db };

//Initialize Authentication
const auth = getAuth();

let userInfo;

//subscribing to auth changes
onAuthStateChanged(auth, (user) => {
  userInfo = user;
  console.log(userInfo);
});
export { userInfo, auth };

//signing up new users
const signUpForm = document.getElementById("signUpForm");
const signUpBtn = document.getElementById("signUpBtn");
const passwordMismatch = document.getElementById("password_mismatch");
const passwordError = document.getElementById("password_error");
const emailError = document.getElementById("email_error");

//Function for Adding user details to Firestore
const addUser = async (
  ref,
  first_name,
  last_name,
  email,
  password,
  dob,
  uid,
  creationTime
) => {
  console.log("addUser called", first_name,
  last_name,
  email,
  password,
  dob,
  uid,
  creationTime)
  await setDoc(doc(db, "UserData", uid), {
    name: first_name + " " + last_name,
    email: email,
    password: password,
    dob: dob,
    uid: uid,
    creationTime: creationTime,
  })
    .then(() => {
      console.log("user added to firestore");
      window.location = "homepage.html";
    })
    .catch((err) => console.log(err));
};
console.log(auth.currentUser);

if (signUpBtn) {

  //adding Event Listener on Sign Up button
  signUpBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (
      document.getElementById("floating_password").value ===
      document.getElementById("floating_repeat_password").value
    ) {

      //Taking input from Sign Up form
      const email = signUpForm.email.value;
      const password = signUpForm.password.value;
      const confirm_password = signUpForm.repeat_password.value;
      const firstName = signUpForm.floating_first_name.value;
      const lastName = signUpForm.floating_last_name.value;
      const dob = signUpForm.date_of_birth.value;
      await createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
          // console.log(cred.user);
          const creationTime = cred.user.metadata.creationTime;
          const uid = cred.user.uid;
          // console.log(uid);
          addUser(
            userRef,
            firstName,
            lastName,
            email,
            password,
            dob,
            uid,
            creationTime
          );

          //Redirecting to Home Page
          
          // console.log('user status should change coz sign up')
        })
        .catch((err) => {

          //Possible causes of Error
          console.log(err);
          if (err.code === "auth/email-already-in-use") {
            emailError.classList.toggle("hidden");
            emailError.innerHTML = "Email already exists";
          }
          if (err.code === "auth/invalid-email") {
            emailError.classList.toggle("hidden");
            emailError.innerHTML = "Invalid email";
          }
          if (err.code === "auth/invalid-password") {
            passwordError.classList.toggle("hidden");
          }
        });
    } else {
      passwordMismatch.classList.toggle("hidden");
    }
  });
}

// logging in users
const logInForm = document.getElementById("logInForm");
const logInBtn = document.getElementById("logInBtn");
const emailErrorLogin = document.getElementById("email_error_login");
const passwordErrorLogin = document.getElementById("password_error_login");

if (logInBtn) {

  //Adding Event Listener to Log In button
  logInBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = logInForm.email.value;
    const password = logInForm.password.value;

    await signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        window.location = "homepage.html";
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/invalid-email") {
          emailErrorLogin.classList.toggle("hidden");
          emailErrorLogin.innerHTML = "Email already exists";
        }else if(err.code === "auth/wrong-password"){
          passwordErrorLogin.classList.toggle("hidden");
          passwordErrorLogin.innerHTML = "Wrong password";
        }
      });
  });
}

//Google Sign In
const googleProvider = new GoogleAuthProvider();
const googleSignIn = document.getElementById("google-signin");

//Function for Adding user details when Signed In through Google
const addGoogleUser = async (name, email, photo, uid, creationTime) => {
  await setDoc(doc(db, "UserData(Google)", uid), {
    name: name,
    email: email,
    photoUrl: photo,
    creationTime: creationTime,
    uid: uid,
  }).then(() => {});
};

if (googleSignIn) {

  //Adding Event Listener to Google Sign In button
  googleSignIn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)

        //Calling addGoogleUser function to add Google Sign In Details to Firebase
        addGoogleUser(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
          user.metadata.creationTime
        );
        window.location = "homepage.html";
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  });
}

