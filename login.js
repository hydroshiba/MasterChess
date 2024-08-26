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
	auth.signInWithEmailAndPassword(email, password)
	  .then((userCredential) => {
		// Signed in 
		const user = userCredential.user;
		console.log("User logged in:", user.uid);
		// You can redirect the user or update UI here
	  })
	  .catch((error) => {
		console.error("Login error:", error.message);
		// Handle errors here, such as displaying a notification to the user
	  });
  }
  
  function redirectToRegister() {
	window.location.href = 'register.html';
	  }
  
  // Forgot password function
  function forgotPassword(email) {
	auth.sendPasswordResetEmail(email)
	  .then(() => {
		console.log("Password reset email sent");
		// Notify the user that the reset email has been sent
	  })
	  .catch((error) => {
		console.error("Forgot password error:", error.message);
		// Handle errors here, such as displaying a notification to the user
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
  
  // Example usage (you would call these functions from your HTML forms):
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
  });
  
  // document.getElementById('registerForm').addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   const email = document.getElementById('registerEmail').value;
  //   const password = document.getElementById('registerPassword').value;
  //   register(email, password);
  // });
  
  // document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   const email = document.getElementById('forgotPasswordEmail').value;
  //   forgotPassword(email);
  // });