import { signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "../firebase";
import SceneBackground from "./travel/SceneBackground";
import Globe from "./Globe";

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  padding: "11px 14px",
  color: "#f0effe",
  fontFamily: "'Cabinet Grotesk', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  outline: "none",
  boxSizing: "border-box",
};

type Mode = "signin" | "signup";

const SPIN_DELAY = 2200; // ms to show fast spin before Firebase unmounts

export default function Login() {
  const [mode, setMode]         = useState<Mode>("signin");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [fastSpin, setFastSpin] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  // Triggers the fast-spin animation, then resolves after SPIN_DELAY
  const spinThenResolve = () =>
    new Promise<void>(res => {
      setFastSpin(true);
      setTimeout(res, SPIN_DELAY);
    });

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithRedirect(auth, provider);
      await spinThenResolve();
    } catch (err: any) {
      setFastSpin(false);
      console.error("Google sign in error:", err?.code, err?.message);
      setError(`Google sign in failed: ${err?.code ?? err?.message ?? "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (name.trim() && !cred.user.displayName) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      await spinThenResolve();
    } catch (err: any) {
      setFastSpin(false);
      const code = err?.code ?? "";
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("No account found with that email.");
      } else if (code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      setLoading(true);
      setError("");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      await spinThenResolve();
    } catch (err: any) {
      setFastSpin(false);
      const code = err?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account already exists with that email.");
        switchMode("signin");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, "dev@ratecache.com", "test1234");
    } catch {
      setError("Dev login failed. Make sure the test account exists in Firebase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        .rc-login-card { animation: rcLoginIn 0.5s ease both; }
        @keyframes rcLoginIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .rc-inp:focus { border-color: rgba(240,192,96,0.6) !important; background: rgba(240,192,96,0.05) !important; }
        .rc-google-btn:hover { opacity: 0.88; }
        .rc-email-btn:hover { opacity: 0.82; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#05050f", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
        <SceneBackground />

        <div className="rc-login-card" style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "2.5rem",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
          fontFamily: "'Cabinet Grotesk', sans-serif",
        }}>

          {/* Globe preview */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <Globe size={120} fast={fastSpin} />
          </div>

          {/* Brand */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f0c060", fontFamily: "'DM Mono', monospace", marginBottom: "0.75rem" }}>
            RateCache
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", color: "#f0effe", margin: "0 0 0.5rem" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "rgba(240,239,254,0.45)", margin: "0 0 2rem", lineHeight: 1.6 }}>
            Track your travel budget across currencies, offline and on the go.
          </p>

          {/* Google sign in */}
          <button
            className="rc-google-btn"
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "13px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "#f0c060", color: "#0a0800",
              fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, fontWeight: 900,
              transition: "opacity 0.15s", marginBottom: "1.5rem",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.4-10.6 7.4-17.2z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 42.8 14.7 48 24 48z"/>
              <path fill="#FBBC05" d="M10.8 28.8A14.5 14.5 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8.2-6z"/>
              <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.4 0 24 0 14.7 0 6.6 5.2 2.6 13.2l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 11, color: "rgba(240,239,254,0.3)", fontWeight: 600, letterSpacing: "0.08em" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 4, marginBottom: "1.25rem" }}>
            {(["signin", "signup"] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: "7px", borderRadius: 7, border: "none", cursor: "pointer",
                  fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 700,
                  background: mode === m ? "rgba(255,255,255,0.09)" : "transparent",
                  color: mode === m ? "rgba(240,239,254,0.9)" : "rgba(240,239,254,0.4)",
                  transition: "all 0.15s",
                }}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Email form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mode === "signup" && (
              <input
                className="rc-inp"
                style={inp}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}
            <input
              className="rc-inp"
              style={inp}
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="rc-inp"
              style={inp}
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (mode === "signin" ? handleEmail() : handleSignUp())}
            />
          </div>

          <button
            className="rc-email-btn"
            onClick={mode === "signin" ? handleEmail : handleSignUp}
            disabled={loading}
            style={{
              width: "100%", marginTop: 14, padding: "13px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.07)", color: "rgba(240,239,254,0.9)",
              fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, fontWeight: 700,
              cursor: "pointer", transition: "opacity 0.15s",
            }}
          >
            {loading ? (mode === "signin" ? "Signing in…" : "Creating account…") : (mode === "signin" ? "Sign in with Email" : "Create Account")}
          </button>

          {/* Error + contextual switch hint */}
          {error && (
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#fb923c", margin: "0 0 6px" }}>{error}</p>
              {mode === "signin" && error.includes("No account") && (
                <button onClick={() => switchMode("signup")} style={{ fontSize: 12, color: "rgba(240,239,254,0.5)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Create an account instead →
                </button>
              )}
              {mode === "signup" && error.includes("already exists") && (
                <button onClick={() => switchMode("signin")} style={{ fontSize: 12, color: "rgba(240,239,254,0.5)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Sign in instead →
                </button>
              )}
            </div>
          )}

          {/* Dev login */}
          {import.meta.env.DEV && (
            <>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "1.5rem 0 1rem" }} />
              <button
                onClick={handleDevLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "10px", borderRadius: 10,
                  border: "1px dashed rgba(255,255,255,0.15)",
                  background: "transparent", color: "rgba(240,239,254,0.35)",
                  fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🛠 Dev Login
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}