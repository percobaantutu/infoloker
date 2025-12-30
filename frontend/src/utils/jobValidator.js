export const validateJobForm = (data) => {
  const errors = {};

  if (!data.jobTitle?.trim()) errors.jobTitle = "Job title is required";
  if (!data.category) errors.category = "Please select a category";
  if (!data.jobType) errors.jobType = "Please select a job type";
  if (!data.description?.trim()) errors.description = "Job description is required";
  if (!data.requirements?.trim()) errors.requirements = "Job requirements are required";

  if (!data.salaryMin || !data.salaryMax) {
    errors.salary = "Both minimum and maximum salary are required";
  } else if (parseInt(data.salaryMin) >= parseInt(data.salaryMax)) {
    errors.salary = "Minimum salary must be less than maximum salary";
  }

  return errors;
};
