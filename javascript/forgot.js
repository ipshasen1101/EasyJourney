
//Importing Related Firebase Products
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { auth } from "./firebase.js";

const forgotDone = document.getElementById("forgot-done");
const forgotForm = document.getElementById("reset-password-form");
const emailError = document.getElementById("email_error");
const okBtn = document.getElementById("okBtn");

//Adding Event Listener to Forgot Password form
forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const forgotEmail = document.getElementById("reset-password-form").email.value;

  sendPasswordResetEmail(auth, forgotEmail)
    .then(() => {
      // Password reset email sent!
      // ..

      forgotDone.classList.toggle("hidden");
      forgotForm.classList.toggle("hidden");
    })
    .catch((error) => {

      //Possible errors
      if (error.code === "auth/invalid-email") {
        emailError.classList.toggle("hidden");
        emailError.innerHTML += "Invalid email";
      }
      if (error.code === "auth/user-not-found") {
        emailError.classList.toggle("hidden");
        emailError.innerHTML += "User not signed up";
      }
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

//Adding Event Listener on Ok button
okBtn.addEventListener("click", () => {
  window.location = "login.html";
});
