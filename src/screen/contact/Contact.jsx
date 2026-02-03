import { useState } from "react";
import "./Contact.css";
import { showError, showSuccess } from "../../services/utils/toastUtil";

export default function Contact() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminWhatsapp, setAdminWhatsapp] = useState("");
  const [Loading,setLoading]=useState(false)
  const handleSave = async () => {
    if (!adminEmail || !adminPhone || !adminWhatsapp) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await apiRequest("post", "/contact", {
        email: adminEmail,
        contactNumber: adminPhone,
        whatsappNumber: adminWhatsapp
      });

      showSuccess(res.message || "Contact details saved successfully");
    } catch (err) {
      showError(err.message || "Failed to save contact details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bajaj-login">
      {/* LEFT CARD */}
      <div className="login-left">
        <div className="login-card">
          <h2>Contact Details</h2>

          <label>Email ID</label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />

          <label>Contact Number</label>
          <input
            type="tel"
            placeholder="Enter admin phone number"
            value={adminPhone}
            onChange={(e) => setAdminPhone(e.target.value)}
          />

          <label>WhatsApp Number</label>
          <input
            type="text"
            placeholder="Enter WhatsApp number"
            value={adminWhatsapp}
            onChange={(e) => setAdminWhatsapp(e.target.value)}
          />

          <button onClick={handleSave}>
            SAVE CONTACT INFO
          </button>

          <p className="footer-text">
            These contact details will be visible to users for support &
            communication.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <h1>Contact Settings</h1>
        <p>
          Manage official admin contact details such as email, phone and
          WhatsApp number. These details help users reach out for support
          quickly and securely.
        </p>
      </div>
    </div>
  );
}
