// Firebase Configuration and Authentication Handler

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOUH-nTAM5VVCzs_AQwzQDIafPt2TWxkk",
    authDomain: "book-4736b.firebaseapp.com",
    projectId: "book-4736b",
    storageBucket: "book-4736b.appspot.com",
    messagingSenderId: "1041195504345",
    appId: "1:1041195504345:web:be95c47c1e8bd128cc64c8",
    measurementId: "G-MYPWEMB8SB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

// Toast notification function
function showNotification(message, type) {
    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
        <div class="toast-message">${message}</div>
    `;
    
    // Append to body
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

// Wait for document to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Add CSS for toast notifications
  const style = document.createElement('style');
  style.textContent = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 300px;
        max-width: 90%;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateX(110%);
        transition: transform 0.3s ease-in-out;
        z-index: 9999;
        opacity: 0.95;
    }
    
    .toast-notification.show {
        transform: translateX(0);
    }
    
    .toast-notification.success {
        background-color: #4CAF50;
        color: white;
    }
    
    .toast-notification.error {
        background-color: #F44336;
        color: white;
    }
    
    .toast-icon {
        font-size: 24px;
        margin-right: 15px;
        flex-shrink: 0;
    }
    
    .toast-message {
        font-size: 16px;
        font-weight: 500;
    }
    
    @media (max-width: 576px) {
        .toast-notification {
            min-width: auto;
            width: calc(100% - 40px);
            top: auto;
            bottom: 20px;
            right: 20px;
        }
    }
  `;
  document.head.appendChild(style);

  // Authentication-related elements
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginModal = document.getElementById('loginModal');
  const registrationModal = document.getElementById('registrationModal');

  // Contact form element
  const contactForm = document.getElementById('contact-form');
  
  // Add submit event listener for contact form
  if (contactForm) {
    contactForm.addEventListener('submit', submitContactForm);
  }
  
  // Add submit event listener for login form
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Add submit event listener for registration form
  if (registerForm) {
    registerForm.addEventListener('submit', handleSignup);
  }

  // Check auth state on page load
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      console.log("User is signed in:", user.email);
      // Update UI to show logged in state if needed
    } else {
      // User is signed out
      console.log("No user signed in");
    }
  });

  // Handle login form submission
  function handleLogin(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Logging in...';
    submitButton.disabled = true;
    
    // Get form values
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;
    
    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        
        // Show success notification
        showNotification(`Welcome back, ${user.email}! Login successful.`, 'success');
        
        // Hide the login modal
        const modalInstance = bootstrap.Modal.getInstance(loginModal);
        if (modalInstance) modalInstance.hide();
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
        if (errorCode === 'auth/user-not-found') {
          errorMessage = 'No account found with this email. Please check or register a new account.';
        } else if (errorCode === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again or reset your password.';
        } else if (errorCode === 'auth/invalid-email') {
          errorMessage = 'Invalid email format. Please check your email.';
        } else if (errorCode === 'auth/too-many-requests') {
          errorMessage = 'Too many failed login attempts. Please try again later.';
        }
        
        // Show error notification
        showNotification(errorMessage, 'error');
        
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      });
  }

  // Handle signup form submission
  function handleSignup(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating account...';
    submitButton.disabled = true;
    
    // Get form values
    const username = registerForm.querySelector('input[name="name"]').value;
    const email = registerForm.querySelector('input[name="email"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;
    const confirmPassword = registerForm.querySelectorAll('input[name="password"]')[1].value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      showNotification("Passwords do not match. Please try again.", 'error');
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
      return;
    }
    
    // Create user with email and password
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        
        // Update profile with display name
        return user.updateProfile({
          displayName: username
        }).then(() => {
          console.log("Registration successful", user);
          
          // Save additional user info to Firestore
          return db.collection("users").doc(user.uid).set({
            name: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });
      })
      .then(() => {
        // Show success notification
        showNotification(`Account created successfully! Welcome to Bookle!`, 'success');
        
        // Hide the registration modal
        const modalInstance = bootstrap.Modal.getInstance(registrationModal);
        if (modalInstance) modalInstance.hide();
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
        if (errorCode === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please login instead.';
        } else if (errorCode === 'auth/invalid-email') {
          errorMessage = 'Invalid email format. Please check your email.';
        } else if (errorCode === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        }
        
        // Show error notification
        showNotification(errorMessage, 'error');
        
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      });
  }
  
  // Contact form submission function
  function submitContactForm(e) {
    e.preventDefault();
    
    // Get form values
    const name = getInputVal('name');
    const email = getInputVal('email123');
    const message = getInputVal('message');
    
    // Validate form
    if (!name || !email || !message) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    
    // Show loading state
    const submitButton = document.getElementById('submit-btn');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
    submitButton.disabled = true;
    
    // Save message to Firestore
    db.collection("contact_messages").add({
      name: name,
      email: email,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      
      // Show success notification
      showNotification('Message sent successfully! We will get back to you soon.', 'success');
      
      // Clear form
      contactForm.reset();
      
      // Reset button state after a delay
      setTimeout(() => {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 1000);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      
      // Show error notification
      showNotification('Error sending message. Please try again later.', 'error');
      
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
  }
  
  // Function to get form values
  function getInputVal(id) {
    return document.getElementById(id)?.value || '';
  }

  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut()
        .then(() => {
          showNotification('You have been successfully logged out.', 'success');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        })
        .catch((error) => {
          showNotification('Error logging out. Please try again.', 'error');
        });
    });
  }
});
