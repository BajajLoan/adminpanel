import { useState } from "react";
import apiRequest from "../../services/api/apiRequest";
import "./Payment.css";
import { showError, showSuccess } from "../../services/utils/toastUtil";

export default function Payment() {
  const [upiId, setUpiId] = useState("");
  const [bankAccountHolderName, setBankAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleQRImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setQrImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("upiId", upiId);
      formData.append("bankName", bankName);
      formData.append("accountHolder", bankAccountHolderName);
      formData.append("accountNumber", accNumber);
      formData.append("ifsc", ifscCode);
      formData.append("qrImage", qrImage);

      const res = await apiRequest("put", "/payment", formData);

      if (!res.ok) {
        alert(res.message || "Something went wrong");
        return;
      }

      showSuccess("✅ Payment details saved successfully");
    } catch (error) {
      console.error(error);
      showError("❌ Server error");
    }
  };

  return (
    <div className="bajaj-login">
      {/* LEFT CARD */}
      <div className="login-left">
        <div className="login-card">
          <h2>Update Payment Details</h2>

          <label>UPI ID</label>
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />

          <label>Bank Name</label>
          <input
            type="text"
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />

          <label>Account Holder Name</label>
          <input
            type="text"
            placeholder="Enter account holder name"
            value={bankAccountHolderName}
            onChange={(e) => setBankAccountHolderName(e.target.value)}
          />

          <label>Account Number</label>
          <input
            type="text"
            placeholder="Enter account number"
            value={accNumber}
            onChange={(e) => setAccNumber(e.target.value)}
          />

          <label>IFSC Code</label>
          <input
            type="text"
            placeholder="Enter IFSC code"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
          />

          <label>QR Code Image</label>
          <input type="file" accept="image/*" onChange={handleQRImageUpload} />

          {preview && (
            <img src={preview} alt="QR Preview" className="qr-preview" />
          )}

          <button onClick={handleSave}>
            Update PAYMENT DETAILS
          </button>

          <p className="footer-text">
            These payment details will be used for customer transactions.
          </p>
        </div>
      </div>

      {/* RIGHT INFO */}
      <div className="login-right">
        <h1>Payment Settings</h1>
        <p>
          Update official UPI ID, bank account details and QR code for receiving
          payments. Ensure all information is accurate and verified.
        </p>
      </div>
    </div>
  );
}
