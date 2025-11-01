const usernameRegex = /^[A-Za-z]+$/;  // Username: only letters
const alphabetRegex = /^[A-Za-z\s]+$/; // Fullname: letters and spaces
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#!$^&*])[A-Za-z\d@#!]{8,}$/;

export { usernameRegex, alphabetRegex, passwordRegex };