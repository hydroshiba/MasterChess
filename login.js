// Firebase configuration
const firebaseConfig = {
  // Replace with your actual Firebase config
  apiKey: "AIzaSyCGv7DEPIG7ieCyv8gVl3RSAf7E1dA4Kmg",
  authDomain: "masterchess-8dfcd.firebaseapp.com",
  databaseURL: "https://masterchess-8dfcd-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "masterchess-8dfcd",
  storageBucket: "masterchess-8dfcd.appspot.com",
  messagingSenderId: "601239027759",
  appId: "1:601239027759:web:11975db1520f4b64e486da"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to the auth and database services
const auth = firebase.auth();
const database = firebase.database();

// Login function
function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User logged in:", user.uid);
      window.location.href = 'home.html';
    })
    .catch((error) => {
      throw new Error("Invalid email or password");
    });
}

function redirectToRegister() {
  window.location.href = 'register.html';
}

// Forgot password function
function forgotPassword(email) {
  return auth.sendPasswordResetEmail(email)
    .then(() => {
      console.log("Password reset email sent");
    });
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user.uid);
    // Update UI for signed-in state
  } else {
    // User is signed out
    console.log("User is signed out");
    // Update UI for signed-out state
  }
});

// Helper functions for error handling
function showError(element, message) {
  if (element) {
    element.textContent = message;
    element.classList.remove('hidden');
  }
}

function hideError(element) {
  if (element) {
    element.classList.add('hidden');
  }
}

function hideAllErrors() {
  hideError(document.getElementById('generalError'));
}

// Wait for the DOM to be fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const generalError = document.getElementById('generalError');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      hideAllErrors();

      login(email, password)
        .then(() => {
          console.log('Login successful');
        })
        .catch((error) => {
          showError(generalError, error.message);
        });
    });
  } else {
    console.error('Login form not found');
  }
});