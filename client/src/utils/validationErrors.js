const mapValidationErrors = (validationErrors) => {
  const errorMessages = {};
  validationErrors.inner.forEach((error) => {
    errorMessages[error.path] = error.message;
  });
  return errorMessages;
};

export { mapValidationErrors };
