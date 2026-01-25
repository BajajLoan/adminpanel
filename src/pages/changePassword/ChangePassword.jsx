import { useState } from "react";
import "./ChangePassword.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/admin/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
            confirmPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password update failed");
      }

      alert("Password changed successfully");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bajaj-login">
      <div className="login-left">
        <div className="login-card">
          <h2>Change Password</h2>

          <label>Old Password</label>
          <div className="password-box">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <span onClick={() => setShowOld(!showOld)}>
              {showOld ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <label>New Password</label>
          <div className="password-box">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span onClick={() => setShowNew(!showNew)}>
              {showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <label>Confirm Password</label>
          <div className="password-box">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button onClick={handleChangePassword} disabled={loading}>
            {loading ? "PLEASE WAIT..." : "UPDATE PASSWORD"}
          </button>

          <p className="footer-text">
            For security reasons, please do not share your password with anyone.
          </p>
        </div>
      </div>

      <div className="login-right">
        <h1>Security Settings</h1>
        <p>
          Update your password regularly to keep your account secure.
        </p>
      </div>
    </div>
  );
}
