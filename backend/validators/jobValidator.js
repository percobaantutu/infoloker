const Joi = require("joi");

const createJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().required(),
  location: Joi.string().optional().allow(""),
  category: Joi.string().optional().allow(""),
  type: Joi.string()
    .valid("Remote", "Full-Time", "Part-Time", "Internship", "Contract")
    .required(),
  salaryMin: Joi.number().min(0).optional(),
  salaryMax: Joi.number().min(0).optional(),
});

const updateJobSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  requirements: Joi.string().optional(),
  location: Joi.string().optional().allow(""),
  category: Joi.string().optional().allow(""),
  type: Joi.string()
    .valid("Remote", "Full-Time", "Part-Time", "Internship", "Contract")
    .optional(),
  salaryMin: Joi.number().min(0).optional(),
  salaryMax: Joi.number().min(0).optional(),
  isClosed: Joi.boolean().optional()
});

module.exports = {
  createJobSchema,
  updateJobSchema,
};
