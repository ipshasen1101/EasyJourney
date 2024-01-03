//Sign Up and Log In functionality
const toSignUp = document.getElementById("toSignUp");
const toLogIn = document.getElementById("toLogIn");
const signUpForm = document.getElementById("signUpForm");
const logInForm = document.getElementById("logInForm");

toLogIn.addEventListener("click", (e) => {
  e.preventDefault();

  signUpForm.classList.add("hidden");
  logInForm.classList.remove("hidden");
});

toSignUp.addEventListener("click", (e) => {
  e.preventDefault();

  signUpForm.classList.remove("hidden");
  logInForm.classList.add("hidden");
});

signUpForm.addEventListener("submit", () => {
  if (userInfo) {
    window.location = "homepage.html";
  }
});

logInForm.addEventListener("submit", () => {
  if (userInfo) {
    window.location = "homepage.html";
  }
});

//Redirecting to Forgot Password
const forgotPassword = document.getElementById("forgot_password");
forgotPassword.addEventListener("click", () => {
  window.location = "forgot.html";
});
