const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (number) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(number);
};
export { validateEmail, validatePhoneNumber };
