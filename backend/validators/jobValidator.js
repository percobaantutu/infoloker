const yup = require("yup");


const categories = [
  "Engineering", "Design", "Marketing", "Sales", 
  "IT & Software", "Customer-service", "Product", 
  "Operations", "Finance", "HR", "Other"
];


const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];

const jobSchema = yup.object({
  title: yup
    .string()
    .required("Job title is required")
    .min(5, "Title should be at least 5 characters")
    .max(100, "Title is too long")
    .trim(),
  location: yup
    .string()
    .required("Location is required")
    .trim(),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(categories, "Invalid category selected"),
  type: yup
    .string()
    .required("Job type is required")
    .oneOf(jobTypes, "Invalid job type selected"),
  description: yup
    .string()
    .required("Description is required")
    .min(20, "Description is too short, please provide more details"),
  requirements: yup
    .string()
    .required("Requirements are required"),
  salary: yup.object({
    min: yup
      .number()
      .typeError("Minimum salary must be a number")
      .min(0, "Salary cannot be negative")
      .nullable() 
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    max: yup
      .number()
      .typeError("Maximum salary must be a number")
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .test("is-greater", "Max salary must be greater than min salary", function(value) {
        const { min } = this.parent;
        if (value !== null && min !== null) {
          return value >= min;
        }
        return true; 
      }),
  }),
  deadline: yup
    .date()
    .typeError("Please enter a valid date")
    .required("Deadline is required")
    .min(new Date(), "Deadline must be in the future"),
});

module.exports = { jobSchema };