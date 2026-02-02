const yup = require("yup");

const subscriptionSchema = yup.object({
  planType: yup
    .string()
    .required("Plan type is required")
    .oneOf(["basic", "premium", "enterprise"], "Invalid plan selected"),
    
  
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .optional(),
});

module.exports = { subscriptionSchema };