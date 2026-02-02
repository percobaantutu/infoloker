const yup = require("yup");

const updateProfileSchema = yup.object({
 
  name: yup.string().min(3, "Name is too short").trim(),
  
 
  companyName: yup.string().when('role', {
    is: 'employer',
    then: (schema) => schema.min(2, "Company name is too short").trim(),
  }),
  
  companyDescription: yup.string().when('role', {
    is: 'employer',
    then: (schema) => schema.min(10, "Description should be more detailed").trim(),
  }),


  bio: yup.string().max(300, "Bio is too long").trim(),
  
  skills: yup.string().trim(), 
  

  role: yup.string().oneOf(["jobseeker", "employer"])
});

module.exports = { updateProfileSchema };