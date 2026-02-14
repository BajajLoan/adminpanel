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
    refund: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState({}); // ✅ FIX
  const [showEditModal, setShowEditModal] = useState(false);
const [step, setStep] = useState(1);

const [personalEdit, setPersonalEdit] = useState({});
const [bankEdit, setBankEdit] = useState({});
const [documentsEdit, setDocumentsEdit] = useState({});

const [aadhaarImageFile, setAadhaarImageFile] = useState(null);
const [panImageFile, setPanImageFile] = useState(null);

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
const handleDelete = async () => {
  try {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    await apiRequest("delete", "/apply", {
      applicationId: _id,
    });

    showSuccess("Application deleted successfully");
    navigate("/");
  } catch (err) {
    showError("Delete failed");
  }
};



  const handleUpdate = async () => {
  try {
    const formData = new FormData();

    // ✅ IMPORTANT
    formData.append("applicationId", _id);

    // Personal Fields
    Object.entries(personalEdit).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Bank Fields
    Object.entries(bankEdit).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Document Fields
    Object.entries(documentsEdit).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (aadhaarImageFile) {
      formData.append("aadhaarImage", aadhaarImageFile);
    }

    if (panImageFile) {
      formData.append("panImage", panImageFile);
    }

    await apiRequest("put", "/apply", formData);

    showSuccess("Application updated successfully");
    setShowEditModal(false);
    navigate(0);
  } catch (err) {
    console.log(err);
    showError("Update failed");
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
            <p><b>Occupation:</b> {personal?.occupation}</p>
          </div>
        </div>

        {/* BANK */}
        <div className="info-card">
          <h3>Bank Details</h3>
          <div className="info-grid">
            <p><b>Bank:</b> {bank?.bankName}</p>
            <p><b>Account:</b> {bank?.accountNumber}</p>
            <p><b>IFSC:</b> {bank?.ifsc}</p>
            <p><b>Annual:</b> {bank?.annual}</p>
          </div>
        </div>

        {/* CHARGES */}
        {Array.isArray(charges) && charges.length > 0 && (
          <div className="info-card">
            <h3>Charged Amount</h3>

            {charges.map((charge) => {
              const isChecked = approved[charge._id] || false;
              const isApproved = charge?.approval === 1 ? true : false;

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

  <button className="back-btns" onClick={() => setShowModal(true)}>
    Apply Charges
  </button>

  <button
    className="back-btns"
    style={{ marginLeft: "10px", background: "#2563eb", color: "#fff" }}
    onClick={() => setShowEditModal(true)}
  >
    Edit Application
  </button>

  <button
    className="back-btns"
    style={{ marginLeft: "10px", background: "#dc2626", color: "#fff" }}
    onClick={handleDelete}
  >
    Delete Application
  </button>
</div>
          {showEditModal && (
  <div className="modal-overlay">
    <div className="modal-box" style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <h3>Edit Application</h3>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h4>Personal Information</h4>

          <input
            className="input"
            placeholder="Full Name (As per Adhar)"
            onChange={(e) =>
              setPersonalEdit({ ...personalEdit, firstName: e.target.value })
            }
          />

          {/* <input
            className="input"
            placeholder="Last Name"
            onChange={(e) =>
              setPersonalEdit({ ...personalEdit, lastName: e.target.value })
            }
          /> */}

          <input
            className="input"
            placeholder="Phone"
            onChange={(e) =>
              setPersonalEdit({ ...personalEdit, phone: e.target.value })
            }
          />
          <input className="input" placeholder="date of birth" type="date"
                   onChange={(e) =>
              setPersonalEdit({ ...personalEdit, dob: e.target.value })
            }
                  />
                   <input className="input" placeholder="email" type="email"
                   onChange={(e) =>
              setPersonalEdit({ ...personalEdit, email: e.target.value })
            }
                  />
                   <input className="input" placeholder="occupation"
                   onChange={(e) =>
              setPersonalEdit({ ...personalEdit, occupation: e.target.value })
            }
                  />

          <div className="modal-actions">
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
            <button onClick={() => setStep(2)}>Next</button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h4>Bank Information</h4>

          <input
            className="input"
            placeholder="Account Holder"
            onChange={(e) =>
              setBankEdit({ ...bankEdit, accountHolder: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Account Number"
            onChange={(e) =>
              setBankEdit({ ...bankEdit, accountNumber: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="IFSC"
            onChange={(e) =>
              setBankEdit({ ...bankEdit, ifsc: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Annual Income"
            onChange={(e) =>
              setBankEdit({ ...bankEdit, annual: e.target.value })
            }
          />

          <div className="modal-actions">
            <button onClick={() => setStep(1)}>Back</button>
            <button onClick={() => setStep(3)}>Next</button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h4>Documents</h4>

          <input
            className="input"
            placeholder="Aadhaar"
            onChange={(e) =>
              setDocumentsEdit({
                ...documentsEdit,
                aadhaar: e.target.value,
              })
            }
          />

          <input
            className="input"
            placeholder="PAN"
            onChange={(e) =>
              setDocumentsEdit({
                ...documentsEdit,
                pan: e.target.value,
              })
            }
          />

          <input
            type="file"
            className="input"
            onChange={(e) => setAadhaarImageFile(e.target.files[0])}
          />

          <input
            type="file"
            className="input"
            onChange={(e) => setPanImageFile(e.target.files[0])}
          />

          <div className="modal-actions">
            <button onClick={() => setStep(2)}>Back</button>
            <button onClick={handleUpdate}>Update</button>
          </div>
        </>
      )}
    </div>
  </div>
)}


      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Charge</h3>
            <input name="chargeType" placeholder="Charge Type" onChange={handleChange} />
            <input name="refund" placeholder="Refund Amount" onChange={handleChange} />
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

