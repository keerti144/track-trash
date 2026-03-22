import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-panel auth-panel-brand">
          <span className="auth-kicker">Track Trash</span>
          <h1>TrackTrash: Smarter tracking for cleaner cities.</h1>
          <p>
            Monitor bins, route collectors, and handle reports.
          </p>
        </section>

        <section className="auth-panel auth-panel-form">
          <div className="auth-form-shell">
            <span className="auth-eyebrow">Welcome back</span>
            <h2>Sign in to your workspace</h2>
            <p>Use your registered email and password to continue.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="auth-footer">
              <span>New here?</span>
              <Link to="/register">Create an account</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
