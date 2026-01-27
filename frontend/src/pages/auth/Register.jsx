import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!formData.firstName) newErrors.firstName = "First name required";
  if (!formData.lastName) newErrors.lastName = "Last name required";
  if (!formData.email) newErrors.email = "Email required";
  if (!formData.password) newErrors.password = "Password required";
  if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";
  if (!formData.terms)
    newErrors.terms = "You must accept the terms";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);

  const success = await register(formData);
  if (success) navigate("/dashboard");

  setIsSubmitting(false);
};


  const inputClass = (fieldName) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      errors[fieldName]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <div className="min-h-screen flex">
      
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white items-center justify-center">
        <div className="max-w-md px-10">
          <h1 className="text-3xl font-semibold">Gamage Recruiters</h1>
          <div className="mt-2 h-1 w-16 bg-white rounded-full" />
          <div className="mt-10 border border-white/50 rounded-2xl p-8 space-y-6">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 border border-white rounded-full" />
              <div className="flex-1 h-px bg-white/70" />
            </div>
            <div className="h-24 border border-dashed border-white/60 rounded-xl" />
            <div className="flex gap-2">
              <span className="w-4 h-1 bg-white rounded" />
              <span className="w-4 h-1 bg-white rounded" />
              <span className="w-4 h-1 bg-white rounded" />
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-xl px-6 py-10 md:px-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-600">
            Welcome to Gamage Recruiters
          </h2>
          <p className="mt-2 text-gray-500">Register your account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {errors.api && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errors.api}
              </p>
            )}

            {/* First / Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-blue-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={inputClass('firstName')}
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-blue-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={inputClass('lastName')}
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={inputClass('email')}
                placeholder="example@gamage.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={inputClass('password')}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={inputClass('confirmPassword')}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to all the{' '}
                <button type="button" className="text-blue-600 underline underline-offset-2">
                  Terms
                </button>{' '}
                and{' '}
                <button type="button" className="text-blue-600 underline underline-offset-2">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Already have account */}
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
