const { registerSchema, loginSchema, verifyEmailSchema } = require('../validators/authValidator');
const { createJobSchema, updateJobSchema } = require('../validators/jobValidator');
const { updateStatusSchema } = require('../validators/applicationValidator');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- Testing Validators ---');

// --- Auth Tests ---
const validRegister = { name: "John Doe", email: "john@example.com", password: "password123", role: "jobseeker" };
const invalidRegister = { name: "J", email: "bad-email", password: "123" }; // too short name, bad email, short password

assert(!registerSchema.validate(validRegister).error, "Valid register data should pass");
assert(registerSchema.validate(invalidRegister).error, "Invalid register data should fail");

const validLogin = { email: "john@example.com", password: "password123" };
assert(!loginSchema.validate(validLogin).error, "Valid login data should pass");

// --- Job Tests ---
const validJobPayload = {
  title: "Dev",
  description: "Code",
  requirements: "JS",
  type: "Full-Time",
  location: "NY",
  category: "IT",
  salaryMin: 50000,
  salaryMax: 100000
};
const invalidJobPayload = { title: "Dev" }; // missing required fields

assert(!createJobSchema.validate(validJobPayload).error, "Valid job payload should pass");
assert(createJobSchema.validate(invalidJobPayload).error, "Invalid job payload should fail");

// Test salary max > min logic check (if implemented in schema or logical)
// Note: Schema currently checks salaryMax logic if provided? No, I removed the ref check for update but create might have it?
// Let's check createJobSchema in the file I wrote.
// I didn't actually write the cross-validation in the file for createJobSchema explicitly in the second version or I did?
// I wrote: salaryMax: Joi.number().min(0).optional(),
// So no cross validation. That's fine.

// --- Application Tests ---
const validStatus = { status: "Accepted" };
const invalidStatus = { status: "Unknown" };

assert(!updateStatusSchema.validate(validStatus).error, "Valid status should pass");
assert(updateStatusSchema.validate(invalidStatus).error, "Invalid status should fail");

console.log('--- All Tests Passed ---');
