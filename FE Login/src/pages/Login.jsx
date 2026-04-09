import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 tambahan
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // mulai loading

    try {
      await API.post("/login", { email, password });
      navigate("/dashboard");
    } catch (err) {
      alert("Login gagal");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loader"></span> Loading...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}