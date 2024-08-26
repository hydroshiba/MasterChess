// Firebase configuration
const firebaseConfig = {
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

// Check if username exists
function checkUsernameExists(username) {
    return database.ref('users').orderByChild('username').equalTo(username).once('value')
        .then(snapshot => snapshot.exists());
}

// Check if email exists
function checkEmailExists(email) {
    return auth.fetchSignInMethodsForEmail(email)
        .then(methods => methods.length > 0);
}

// Register function
function register(username, email, password) {
    return Promise.all([checkUsernameExists(username), checkEmailExists(email)])
        .then(([usernameExists, emailExists]) => {
            if (usernameExists) {
                throw new Error('Username already exists');
            }
            if (emailExists) {
                throw new Error('Email already exists');
            }
            return auth.createUserWithEmailAndPassword(email, password);
        })
        .then((userCredential) => {
            const user = userCredential.user;
            return database.ref('users/' + user.uid).set({
                username: username,
                email: email,
            });
        })
        .then(() => {
            console.log("User data saved to database");
            // Sign out the user immediately after registration
            return auth.signOut();
        });
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const generalError = document.getElementById('generalError');

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
        hideError(generalError);
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            hideAllErrors();

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showError(generalError, "Passwords do not match");
                return;
            }

            register(username, email, password)
                .then(() => {
                    console.log('Registration successful');
                    alert('Registration successful! Please log in.');
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    showError(generalError, error.message);
                });
        });
    }
});