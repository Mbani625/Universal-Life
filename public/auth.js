import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Prevent reloading auth state repeatedly
let authChecked = false;

// 🔹 Function to handle login (fetch username from Firestore)
async function loginHandler(playerId) {
  const usernameInput = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    // 🔹 Query Firestore to find the user document with this username
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", usernameInput));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("Username not found");
      return;
    }

    // 🔹 Retrieve the first matching document (username should be unique)
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const email = userData.email; // Get the associated email

    // 🔹 Log in with email (since Firebase Auth requires an email)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the player container with the username
    updatePlayerName(playerId, userData.username);

    closePopup();
  } catch (error) {
    console.error("Login Error:", error.message);
  }
}
window.loginHandler = loginHandler;

// 🔹 Function to handle signup
async function signUpHandler(playerId) {
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!username) {
    console.error("Username is required");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store the username and email in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
    });

    // Also store the username as a key to find email later
    await setDoc(doc(db, "usernames", username), { email: email });

    console.log("Signed up:", user);
    closePopup();
    updatePlayerName(playerId, username);
  } catch (error) {
    console.error("Sign Up Error:", error.message);
  }
}
window.signUpHandler = signUpHandler;

// 🔹 Function to open the Login Popup
function openLoginPopup(playerId) {
  closePopup(); // Close any existing popups

  const popup = document.createElement("div");
  popup.classList.add("popup", "login-popup");
  popup.innerHTML = `
    <button class="popup-close" onclick="closePopup()">✖</button>
    <div class="popup-content">
      <h3>Login</h3>
      <input type="text" id="login-username" placeholder="Username">
      <input type="password" id="login-password" placeholder="Password">
      <button onclick="loginHandler(${playerId})">Login</button>
      <button onclick="openSignUpPopup(${playerId})">Sign Up</button>
      <button onclick="closePopup()">Cancel</button>
    </div>
  `;

  document.body.appendChild(popup);
}
window.openLoginPopup = openLoginPopup;

// 🔹 Function to open the Sign-Up Popup
function openSignUpPopup(playerId) {
  closePopup(); // Close any existing popups

  const popup = document.createElement("div");
  popup.classList.add("popup", "signup-popup");
  popup.innerHTML = `
    <button class="popup-close" onclick="closePopup()">✖</button>
    <div class="popup-content">
      <h3>Sign Up</h3>
      <input type="text" id="signup-username" placeholder="Username">
      <input type="email" id="signup-email" placeholder="Email">
      <input type="password" id="signup-password" placeholder="Password">
      <button onclick="signUpHandler(${playerId})">Sign Up</button>
      <button onclick="closePopup()">Cancel</button>
    </div>
  `;

  document.body.appendChild(popup);
}
window.openSignUpPopup = openSignUpPopup;

// 🔹 Sign Up with Email Verification
export async function signUp(playerId, username, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    alert(
      "A verification email has been sent. Please check your inbox before logging in."
    );

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      verified: false, // Track email verification
      winRate: 0,
      gamesPlayed: 0,
    });

    closePopup();
    return user;
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

// 🔹 Login and Fetch User Data
export async function login(playerId, email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Ensure email is verified before allowing login
    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      return;
    }

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.querySelector(
        `[data-player-id='${playerId}'] .player-name`
      ).textContent = userData.username;
    } else {
      alert("No user data found.");
    }

    closePopup();
    return user;
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

// 🔹 Monitor Auth State
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User detected:", user);

    // Ensure user email is verified
    if (!user.emailVerified) {
      console.log("User email is not verified.");
      return;
    }

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      console.log(`Logged in as: ${userDoc.data().username}`);
    } else {
      console.log("User data not found in Firestore.");
    }
  } else {
    console.log("No user logged in.");
  }
});
