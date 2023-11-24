const yup = require("yup")

// Yup schema for validation of incoming signup form data
const signupValidationSchema = yup.object({
    name: yup.string().min(3, 'Full name cannot be shorter than 3 characters').required('Name required'),
    email: yup.string().matches(/[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,10}/, 'Invalid email').required('Email required'),
    password: yup.string().min(6, 'Password cannot be shorter than 6 characters').max(15, 'Password cannot be greater than 15 characters').required('Password required'),
    cpassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password required')
})


// Yup schema for validation of incoming login form data
const loginValidationSchema = yup.object({
    email: yup.string().matches(/[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,10}/, 'Invalid email').required('Email required'),
    password: yup.string().min(6, 'Password cannot be shorter than 6 characters').max(15, 'Password cannot be greater than 15 characters').required('Password required'),
})

module.exports = { signupValidationSchema, loginValidationSchema }