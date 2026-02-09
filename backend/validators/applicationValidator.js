const yup = require("yup");


const updateStatusSchema = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(
      ["Applied", "In Review", "Interview", "Accepted", "Rejected"],
      "Invalid status value"
    ),
});


const applyJobSchema = yup.object({
  
  message: yup.string().max(500, "Message is too long").trim(),
});

module.exports = { updateStatusSchema, applyJobSchema };