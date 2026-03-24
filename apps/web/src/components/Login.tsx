import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError("Google sign in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, "dev@ratecache.com", "test1234");
    } catch (err) {
      setError("Dev login failed. Make sure the test account exists in Firebase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <h1>RateCache</h1>
      <p style={{ color: "gray" }}>Sign in to track your travel expenses</p>

      {/* Google Sign In */}
      <button
        onClick={handleGoogle}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "16px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Sign in with Google
      </button>

      <hr style={{ margin: "20px 0", color: "gray" }} />

      {/* Email & Password */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "10px", boxSizing: "border-box", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleEmail}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#222",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Sign in with Email
      </button>

      {/* Error message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* Dev test account */}
      {import.meta.env.DEV && (
        <>
          <hr style={{ margin: "20px 0" }} />
          <button
            onClick={handleDevLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              cursor: "pointer",
              backgroundColor: "#f0f0f0",
              border: "1px dashed #aaa",
              borderRadius: "6px",
              color: "#555",
            }}
          >
            🛠 Dev Login (test account)
          </button>
        </>
      )}
    </div>
  );
}