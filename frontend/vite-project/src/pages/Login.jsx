import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShowcase from "../components/AuthShowcase";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      setSuccessMessage("Welcome back! Redirecting...");
      setTimeout(() => {
        navigate("/notes");
      }, 700);
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-top-bar">
        <ThemeToggle />
      </div>

      <div className="auth-layout">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-wrap">
              <span className="auth-logo">N</span>
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your notes dashboard</p>
          </div>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {submitError && <div className="alert alert-error">{submitError}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                  setSubmitError("");
                }}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                  setSubmitError("");
                }}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>

        <AuthShowcase variant="login" />
      </div>
    </div>
  );
}

export default Login;
