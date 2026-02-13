import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../services/api/apiRequest";
import "./Dashboard.css";
import { showError, showSuccess } from "../../services/utils/toastUtil";

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editStep, setEditStep] = useState(1);

  const [chargeData, setChargeData] = useState({
    chargeType: "",
    refund: "",
    amount: "",
  });

  const [approved, setApproved] = useState({});

  if (!state) return <p>No application data found</p>;

  const { _id, personal, loanType, bank, documents, charges } = state;

  // ✅ Edit form state
  const [editData, setEditData] = useState({
    firstName: personal?.firstName || "",
    lastName: personal?.lastName || "",
    phone: personal?.phone || "",
    loanAmount: loanType?.loanAmount || "",
  });

  /* ---------------- INPUT HANDLERS ---------------- */

  const handleChange = (e) => {
    setChargeData({ ...chargeData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  /* ---------------- DELETE APPLICATION ---------------- */

  const handleDelete = async () => {
  try {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    const formData = new FormData();
    formData.append("applicationId", _id);

    await apiRequest("delete", "/apply", formData);

    showSuccess("Application deleted successfully");
    navigate("/");
  } catch (err) {
    showError("Delete failed");
  }
};


  /* ---------------- UPDATE APPLICATION ---------------- */

  const handleUpdate = async () => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("applicationId", _id);

    // ✅ Only send changed & non-empty fields
    Object.keys(editData).forEach((key) => {
      if (editData[key] !== "" && editData[key] !== null) {
        formData.append(key, editData[key]);
      }
    });

    await apiRequest("put", "/apply", formData);

    showSuccess("Application updated successfully");
    setShowEditModal(false);
    navigate(0);
  } catch (err) {
    showError("Update failed");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- ADD CHARGE ---------------- */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiRequest("post", "/add-charge", {
        applicationId: _id,
        ...chargeData,
      });

      showSuccess("Charge added successfully");
      setShowModal(false);
      navigate(0);
    } catch (err) {
      showError("Failed to add charge");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- APPROVE CHARGE ---------------- */

  const handleApprove = async (chargeId) => {
    try {
      const approvalValue = approved[chargeId] ? 1 : 0;

      await apiRequest("put", "/charge-approval", {
        applicationId: _id,
        chargeId,
        approval: approvalValue,
      });

      showSuccess(
        approvalValue === 1 ? "Charge approved" : "Charge unapproved"
      );
      navigate(0);
    } catch (err) {
      showError("Approval failed");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="top-card">
        <h2>Application Details</h2>
        <span>Application ID: {_id}</span>
      </div>

      <div className="details-grid-wrapper">
        {/* LOAN */}
        <div className="info-card">
          <h3>Loan Details</h3>
          <p><b>Loan Type:</b> {loanType?.loanName}</p>
          <p><b>Amount:</b> ₹{loanType?.loanAmount}</p>
          <p><b>Tenure:</b> {loanType?.tenure}</p>
        </div>

        {/* PERSONAL */}
        <div className="info-card">
          <h3>Personal Details</h3>
          <p><b>Name:</b> {personal?.firstName} {personal?.lastName}</p>
          <p><b>Email:</b> {personal?.email}</p>
          <p><b>Phone:</b> {personal?.phone}</p>
        </div>

        {/* BANK */}
        <div className="info-card">
          <h3>Bank Details</h3>
          <p><b>Account:</b> {bank?.accountNumber}</p>
          <p><b>IFSC:</b> {bank?.ifsc}</p>
        </div>

        {/* DOCUMENTS */}
        <div className="info-card">
          <h3>Aadhaar</h3>
          <p>{documents?.aadhaar}</p>
          {documents?.aadhaarImage && (
            <img
              src={`https://bajajpanel.online/${documents.aadhaarImage}`}
              width="200"
              alt="aadhaar"
            />
          )}
        </div>

        <div className="info-card">
          <h3>PAN</h3>
          <p>{documents?.pan}</p>
          {documents?.panImage && (
            <img
              src={`https://bajajpanel.online/${documents.panImage}`}
              width="200"
              alt="pan"
            />
          )}
        </div>
      </div>

      {/* BUTTONS */}
     <div style={{ marginTop: 30 }}>
  <button className="back-btn" onClick={() => navigate(-1)}>
    ← Back
  </button>

  <button className="back-btns" onClick={() => setShowModal(true)}>
    Apply Charges
  </button>

  <button className="back-btns" onClick={() => setShowEditModal(true)}>
    Edit
  </button>

  <button className="back-btns" onClick={handleDelete}>
    Delete
  </button>
</div>


      {/* ADD CHARGE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Charge</h3>
            <input name="chargeType" placeholder="Charge Type" onChange={handleChange} />
            <input name="refund" placeholder="Refund Amount" onChange={handleChange} />
            <input name="amount" type="number" placeholder="Amount" onChange={handleChange} />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit}>
                {loading ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
  <div className="modal-overlay">
    <div className="modal-box" style={{ maxWidth: "650px" }}>
      <h3>Edit Application</h3>

      {/* STEP 1 */}
      {editStep === 1 && (
        <>
          <h4 style={{ marginBottom: 10 }}>Personal Information</h4>

          <input
            placeholder="First Name"
            onChange={(e) =>
              setEditData({ ...editData, firstName: e.target.value })
            }
          />
          <input
            placeholder="Last Name"
            onChange={(e) =>
              setEditData({ ...editData, lastName: e.target.value })
            }
          />
          <input
            placeholder="Phone"
            onChange={(e) =>
              setEditData({ ...editData, phone: e.target.value })
            }
          />
          <input
            type="date"
            onChange={(e) =>
              setEditData({ ...editData, dob: e.target.value })
            }
          />
          <input
            placeholder="Address"
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
          />
          <input
            placeholder="Occupation"
            onChange={(e) =>
              setEditData({ ...editData, occupation: e.target.value })
            }
          />

          <div className="modal-actions">
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
            <button onClick={() => setEditStep(2)}>Next</button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {editStep === 2 && (
        <>
          <h4 style={{ marginBottom: 10 }}>Bank Information</h4>

          <input
            placeholder="Account Holder"
            onChange={(e) =>
              setEditData({ ...editData, accountHolder: e.target.value })
            }
          />
          <input
            placeholder="Account Number"
            onChange={(e) =>
              setEditData({ ...editData, accountNumber: e.target.value })
            }
          />
          <input
            placeholder="IFSC"
            onChange={(e) =>
              setEditData({ ...editData, ifsc: e.target.value })
            }
          />
          <input
            placeholder="Branch"
            onChange={(e) =>
              setEditData({ ...editData, branch: e.target.value })
            }
          />

          <div className="modal-actions">
            <button onClick={() => setEditStep(1)}>Back</button>
            <button onClick={() => setEditStep(3)}>Next</button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {editStep === 3 && (
        <>
          <h4 style={{ marginBottom: 10 }}>Document Details</h4>

          <input
            placeholder="Aadhaar Number"
            onChange={(e) =>
              setEditData({ ...editData, aadhaar: e.target.value })
            }
          />
          <input
            placeholder="PAN Number"
            onChange={(e) =>
              setEditData({ ...editData, pan: e.target.value.toUpperCase() })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditData({ ...editData, aadhaarImage: e.target.files[0] })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditData({ ...editData, panImage: e.target.files[0] })
            }
          />

          <div className="modal-actions">
            <button onClick={() => setEditStep(2)}>Back</button>
            <button onClick={handleUpdate}>
              {loading ? "Updating..." : "Update Application"}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
}
