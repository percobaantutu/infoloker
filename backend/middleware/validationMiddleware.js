const validate = (schema) => async (req, res, next) => {
  try {
    
    await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    next();
  } catch (err) {

    const errors = err.inner.reduce((acc, currentError) => {
      acc[currentError.path] = currentError.message;
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors
    });
  }
};

module.exports = validate;