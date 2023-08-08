const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      const text = await response.text();
      if (text.includes('Login successful!')) {
        // התחברות הצליחה
        alert('Login successful!');
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        window.location.href = '/products';
      } else {
        // שם משתמש או סיסמה שגויים
        alert('Incorrect username or password');
      }
    } else {
      alert('Failed to login');
    }
  } catch (error) {
    console.error(error);
    alert('Failed to login');
  }
});


document.addEventListener('DOMContentLoaded', function() {
  let signupButton = document.getElementById('signup-btn');
  signupButton.addEventListener('click', function() {
    window.location.href = '/signup';
  });
});



function checkForm() {
  const usernameInput = document.forms['info']['username'];
  const emailInput = document.forms['info']['email'];
  const passwordInput = document.forms['info']['password'];

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;

  // בדיקת שם משתמש
  if (username.length < 4 || username.length > 8) {
    document.getElementById('usernameError').textContent = 'Username must be between 4 and 8 characters';
    isValid = false;
  } else {
    document.getElementById('usernameError').textContent = '';
  }

  // בדיקת כתובת אימייל
  if (!email.includes('@')) {
    document.getElementById('emailError').textContent = 'Invalid email address';
    isValid = false;
  } else {
    document.getElementById('emailError').textContent = '';
  }

  // בדיקת סיסמה
  if (password.length < 5 || password.length > 10 || !password.includes('$')) {
    document.getElementById('passwordError').textContent = 'Password must be between 5 and 10 characters and include the $ sign';
    isValid = false;
  } else {
    document.getElementById('passwordError').textContent = '';
  }

  return isValid;
}

const loginForm2 = document.querySelector('#login-form');
loginForm.addEventListener('submit', async (event) => {
// TODO
});

document.addEventListener('DOMContentLoaded', function() {
  //TODO
});