// script.js

// Function to validate the password fields
const validatePassword = () => {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const errorMessage = document.getElementById('error-message');
  
    if (passwordField.value !== confirmPasswordField.value) {
      errorMessage.textContent = 'Passwords do not match';
      return false;
    }
  
    errorMessage.textContent = '';
    return true;
  };
  
  // Attach the event listener to the form submission
  const form = document.getElementById('reset-form');
  form.addEventListener('submit', (event) => {
    if (!validatePassword()) {
      event.preventDefault();
    }
});
  