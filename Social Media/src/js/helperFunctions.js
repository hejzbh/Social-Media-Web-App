export  const checkValueOfInputs = (...inputs) => [...inputs].every(input=>input.value);

export const checkValidEmail = (email) => email.value.split('').includes('@');

export const checkValidPassword = (pw = '') => pw.value.length>=8;

export const correctInput = function(str = ''){ 
    return str[0].toUpperCase() + str.slice(1).toLowerCase().trim();
};


