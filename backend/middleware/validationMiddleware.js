const Joi = require("joi");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({
        message: errorMessage,
        error: "Validation Error"
      });
    }

    next();
  };
};

module.exports = { validateRequest };
