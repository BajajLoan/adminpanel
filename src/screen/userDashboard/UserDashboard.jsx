import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../services/api/apiRequest";
import "./Dashboard.css";
import { showError, showSuccess } from "../../services/utils/toastUtil";

export default function Dashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [chargeData, setChargeData] = useState({
    chargeType: "",
    loanType: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState({}); // ✅ FIX

  if (!state) return <p>No application data found</p>;

  const { _id, personal, loanType, bank, documents, charges } = state;

  /* 🔹 HANDLE INPUT */
  const handleChange = (e) => {
    setChargeData({ ...chargeData, [e.target.name]: e.target.value });
  };

  /* 🔹 ADD CHARGE */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiRequest("post", "/add-charge", {
        applicationId: _id,
        ...chargeData,
      });
      // alert("Charge added successfully");
      showSuccess("Charge added successfully")
      setShowModal(false);
      navigate("/")
    } catch (err) {
      // alert("Failed to add charge");
      showError("Failed to add charge")
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 APPROVE CHARGE */
  const handleApprove = async (chargeId) => {
  try {
    const approvalValue = approved[chargeId] ? 1 : 0; // ✅ checkbox based

    await apiRequest("put", "/charge-approval", {
      applicationId: _id,
      chargeId,
      approval: approvalValue,
    });

    
    showSuccess(approvalValue === 1 ? "Charge approved" : "Charge unapproved")
    navigate(0)
  } catch (err) {
    
    showError("Approval failed")
  }
};


  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <div className="top-card">
        <h2>Application Details</h2>
        <span>Application ID: {_id}</span>
      </div>

      <div className="details-grid-wrapper">
        {/* LOAN */}
        <div className="info-card">
          <h3>Loan Details</h3>
          <div className="info-grid">
            <p><b>Loan Type:</b> {loanType?.loanName}</p>
            <p><b>Amount:</b> ₹{loanType?.loanAmount}</p>
            <p><b>Tenure:</b> {loanType?.tenure}</p>
          </div>
        </div>

        {/* PERSONAL */}
        <div className="info-card">
          <h3>Personal Details</h3>
          <div className="info-grid">
            <p><b>Name:</b> {personal?.firstName} {personal?.lastName}</p>
            <p><b>Email:</b> {personal?.email}</p>
            <p><b>Phone:</b> {personal?.phone}</p>
          </div>
        </div>

        {/* BANK */}
        <div className="info-card">
          <h3>Bank Details</h3>
          <div className="info-grid">
            <p><b>Bank:</b> {bank?.bankName}</p>
            <p><b>Account:</b> {bank?.accountNumber}</p>
            <p><b>IFSC:</b> {bank?.ifsc}</p>
          </div>
        </div>

        {/* CHARGES */}
        {Array.isArray(charges) && charges.length > 0 && (
          <div className="info-card">
            <h3>Charged Amount</h3>

            {charges.map((charge) => {
              const isChecked = approved[charge._id] || false;
              const isApproved = charge?.approval === 1;

              return (
                <div key={charge._id} className="info-grid" style={{ marginBottom: "16px" }}>
                  <p><b>Charge:</b> {charge.chargeType}</p>
                  <p><b>Amount:</b> ₹{charge.amount}</p>

                 {isApproved && (
  <p>
    <b>Status:</b>{" "}
    <span style={{ color: "green", fontWeight: "600" }}>
      Approved
    </span>
  </p>
)}


                  { charge.image ? <img
                        src={`https://bajajpanel.online/${charge?.image}`}
                        alt="Aadhaar"
                      hight={"100"}
                        width={"200"}
                      />: null}
                  {(
                    <div className="flex items-center gap-4 mt-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setApproved({
                            ...approved,
                            [charge._id]: e.target.checked,
                          })
                        }
                      />

                      <button
                        // disabled={!isChecked}
                        className={`px-5 py-2 rounded-full ${
                          isChecked
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                        onClick={() => handleApprove(charge._id)}
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* DOCUMENTS */}
        <div className="info-card">
          <h3>Documents</h3>
         <div className="infro-card">
           <p><b>Aadhaar:</b> {documents?.aadhaar}</p>
          <img
                        src={`https://bajajpanel.online/${documents.aadhaarImage}`}
                        alt="Aadhaar"
                        // className="mt-2 w-[20px]  rounded-lg border"
                        width={"200"}
                      />
         </div>
        </div>
      </div>
              <div className="info-card">
          <h3>Documents</h3>
         <div className="infro-card">
           <p><b>PAN:</b> {documents?.pan}</p>
          <img
                        src={`https://bajajpanel.online/${documents.panImage}`}
                        alt="Aadhaar"
                        // className="mt-2 w-full max-w-xs rounded-lg border"
                       width={"200"}/>
         </div>
        </div>
      

      {/* ACTIONS */}
      <div style={{ marginTop: 30 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <button className="back-btns" onClick={() => setShowModal(true)}>Apply Charges</button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Charge</h3>
            <input name="chargeType" placeholder="Charge Type" onChange={handleChange} />
            <input name="loanType" placeholder="Loan Type" onChange={handleChange} />
            <input name="amount" type="number" placeholder="Amount" onChange={handleChange} />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit}>{loading ? "Saving..." : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
