import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../navigation/authContext";
import { showSuccess, showError } from "../services/utils/toastUtil";
import { DiAndroid } from "react-icons/di";
import { FaApple } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginAdmin, registerAdmin } = useAuth();


  const handleLogin = async () => {
    if (!email || !password) {
      showError("Email and password required");
      return;
    }

    try {
      setLoading(true);

     const res = await loginAdmin({ email, password });

      showSuccess(res.message);
      console.log(res.message)
      navigate("/", { replace: true });
    } catch (err) {
        console.log(err.message)
      showError( "Admin not found");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
  if (!email || !password || !confirmPassword) {
    showError("All fields required");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const res = await registerAdmin({
      email,
      password,
      confirmPassword
    });

    showSuccess(res.message || "Admin registered successfully");

    // ✅ register ke baad login card dikhao
    setIsRegister(false);
    setPassword("");
    setConfirmPassword("");

  } catch (err) {
    showError(err.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bajaj-login">
      {/* LEFT CARD */}
      <div className="login-left">
        <div className="login-card">
          <h2>{isRegister ? "Register Account" : "Sign-in to Bajaj Finserv"}</h2>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {isRegister && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          <button
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading
              ? "PLEASE WAIT..."
              : isRegister
              ? "REGISTER"
              : "LOGIN"}
          </button>

          <p className="switch-text">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsRegister(false)}>Login</span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsRegister(true)}>Register</span>
              </>
            )}
          </p>

          <p className="footer-text">
            Basic details of your relationship(s) including our group companies
            are displayed on this page.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <h1>Welcome!</h1>
        <p>
          Access and manage all your Bajaj Finserv services in one place. Sign in
          to view your account details, track loans and EMIs, explore personalised
          offers, download documents, and much more.
        </p>

        <div className="app-section">
          <div>
            <p className="app-text">
              Download our app for a personalised experience
            </p>
            <div className="store-icons">
              <DiAndroid size={24} />
              <FaApple size={24} />
            </div>
          </div>
        </div>

        <div className="ratings">
          <div>
            <strong>4.9 ★</strong>
            <span>ANDROID</span>
          </div>
          <div>
            <strong>4.7 ★</strong>
            <span>iOS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
