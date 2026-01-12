import { useState, useContext } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleClientId = typeof rawGoogleClientId === "string" ? rawGoogleClientId.trim() : "";
  const isGoogleConfigured =
    Boolean(googleClientId) &&
    !["GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID_HERE"].includes(googleClientId);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        setErrors({ api: "Google didn’t return a credential. Check your Google OAuth origin settings and try again." });
        return;
      }
      const success = await googleLogin(credentialResponse);
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ api: "Google login failed. Please try again." });
    }
  };

  const handleGoogleError = () => {
    setErrors({ api: "Google login failed. Please try again." });
  };

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

      if (!success) {
        setErrors({ api: "Invalid email or password" });
        return;
      }

      navigate("/dashboard"); 
    } catch (err) {
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm px-6 py-10 md:px-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-slate-800">
          Log in to your Gamage Recruiters account
        </h1>

        {errors.api && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errors.api}
          </p>
        )}

        
        <div className="mt-8 flex justify-center">
          {isGoogleConfigured ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
            />
          ) : (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 w-full text-center">
              Google Sign-In isn’t configured. Set <span className="font-mono">VITE_GOOGLE_CLIENT_ID</span> in
              <span className="font-mono"> frontend/.env</span>.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              name="email"
              type="email"
              className={inputClass("email")}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Your password
              </label>
              <button
                type="button"
                className="text-xs text-gray-500"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className={inputClass("password")}
              value={formData.password}
              onChange={handleChange}
            />

            
            <div className="mt-1 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forget your password
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md bg-blue-500 py-2.5 text-white ${
              isSubmitting ? "opacity-70" : "hover:bg-blue-600"
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
