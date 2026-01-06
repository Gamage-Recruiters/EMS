import { useState, useContext } from 'react';
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // redirect placeholder
        navigate('/dashboard'); 
      } else {
        setErrors({ api: "Invalid email or password" });
      }
    } catch (err) {
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      errors[fieldName]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm px-6 py-10 md:px-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-slate-800">
          Log in to your account
        </h1>

        {errors.api && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.api}
          </p>
        )}

        {/* Google login button */}
        <button
          type="button"
          onClick={googleLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass("email")}
              placeholder="example@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Your password
              </label>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={inputClass("password")}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 w-full rounded-md bg-blue-500 py-2.5 text-sm font-semibold text-white transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-8 h-px bg-gray-200" />

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-700">Don’t have an account?</p>
          <Link
            to="/register"
            className="mt-3 inline-block w-full rounded-full border border-gray-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;