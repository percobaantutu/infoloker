const Joi = require("joi");

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Applied", "In Review", "Rejected", "Accepted", "Interview")
    .required(),
});

module.exports = {
  updateStatusSchema,
};
