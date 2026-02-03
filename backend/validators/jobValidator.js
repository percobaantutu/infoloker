const yup = require("yup");

const categories = [
  "Engineering", "Design", "Marketing", "Sales", 
  "IT & Software", "Customer-service", "Product", 
  "Operations", "Finance", "HR", "Other"
];

const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];


const parseSalary = (value) => {
  if (!value) return null;
  if (typeof value === "number") return value;
  
  const cleaned = value.toString().replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : null;
};

const jobSchema = yup.object({
  title: yup.string().required("Job title is required").min(3).trim(),
  location: yup.string().required("Location is required").trim(),
  category: yup.string().required("Category is required").oneOf(categories),
  type: yup.string().required("Job type is required").oneOf(jobTypes),
  description: yup.string().required("Description is required").min(10),
  requirements: yup.string().required("Requirements are required"),
  
  salary: yup.object({
    min: yup.mixed().transform((val) => parseSalary(val)).nullable(),
    max: yup.mixed().transform((val) => parseSalary(val)).nullable()
      .test("is-greater", "Max salary must be greater than min salary", function(value) {
        const { min } = this.parent;
        const cleanMin = parseSalary(min);
        const cleanMax = parseSalary(value);
        return (cleanMax && cleanMin) ? cleanMax >= cleanMin : true;
      }),
  }),

  deadline: yup
    .mixed()
    .nullable() 
    .notRequired() 
    .transform((curr, orig) => (orig === "" ? null : curr))
    .test("valid-date", "Invalid date format", (value) => {
      if (!value) return true; 
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
});

module.exports = { jobSchema };