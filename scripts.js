// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgaVE2aM_P7dSqEhMUFMKZqUp-i-99htE",
    authDomain: "campus19692.firebaseapp.com",
    projectId: "campus19692",
    storageBucket: "campus19692.firebasestorage.app",
    messagingSenderId: "842826616850",
    appId: "1:842826616850:web:452a33f757d77cc86148cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Smooth scroll for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 60,
            behavior: 'smooth'
        });
    });
});

// User authentication: Sign up
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = registerForm.name.value;
        const branch = registerForm.branch.value;
        const section = registerForm.section.value;
        const roll = registerForm.roll.value;
        const email = registerForm.email.value;
        const password = registerForm['password-register'].value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name,
                branch,
                section,
                roll,
                email
            });
            alert('Account created successfully!');
            window.location.href = "index.html";  // Redirect after successful registration
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// User authentication: Log in
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            window.location.href = "index.html";  // Redirect after successful login
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// User logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert('Logged out successfully!');
            logoutBtn.style.display = 'none';
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// Auth state listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(`Logged in as: ${userData.name}`);
        }
        logoutBtn.style.display = 'block';
    } else {
        logoutBtn.style.display = 'none';
    }
});

// Google authentication
const googleSignInBtn = document.getElementById('google-sign-in'); // Make sure this button exists in the HTML
const provider = new GoogleAuthProvider();

googleSignInBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Signed in as: ", user.displayName);

        // Store user data in Firestore (if you want to store their information)
        await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        });

        // Hide Google Sign-In button and show the Logout button
        googleSignInBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        alert('Google Sign-In Successful');
    } catch (error) {
        console.error('Error during Google Sign-In: ', error.message);
        alert('Error: ' + error.message);
    }
});

// Dynamically load events from Firestore
const eventsContainer = document.querySelector('.event-list');

async function fetchEvents() {
    const eventsRef = collection(db, "events");
    const querySnapshot = await getDocs(eventsRef);
    querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        
        eventCard.innerHTML = `
            <h3>${eventData.title}</h3>
            <p><strong>Date:</strong> ${eventData.date}</p>
            <p><strong>Location:</strong> ${eventData.location}</p>
            <p>${eventData.description}</p>
            <a href="#">Register here</a>
        `;

        eventsContainer.appendChild(eventCard);
    });
}

// Fetch events on page load
window.onload = fetchEvents;
