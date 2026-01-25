import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../services/api/apiRequest";
import "./Home.css";

export default function Home() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await apiRequest("get", "/getdata");
      setApplications(res.data || res);
      console.log(res)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">

      
      <h1>User Applications</h1>
      <div className="top-tabs">
  <button onClick={() => navigate("/change-password")}>
    Change Password
  </button>

  <button onClick={() => navigate("/payment-details")}>
    Payment Details
  </button>

  <button onClick={() => navigate("/contact-details")}>
    Contact Details
  </button>
  {/* </div>
 <div className="top-tabs"> */}
  <button onClick={() => navigate("/updatePayment")}>
   Update Payment Details
  </button>

  <button onClick={() => navigate("/updateContact")}>
   Update Contact Details
  </button>
</div>
      
      <div className="content-area">
        {loading ? (
          <div className="loading-wrapper">
            <p className="loading">Loading...</p>
          </div>
        ) : (
          <div className="card-grid">
            {applications.map((app) => (
              <div className="user-card" key={app._id}>
                <h3>
                  {app.personal?.firstName} {app.personal?.lastName}
                </h3>

                <p><strong>Email:</strong> {app.personal?.email}</p>
                <p><strong>Phone:</strong> {app.personal?.phone}</p>
                <p><strong>Loan:</strong> {app.loanType?.loanName}</p>
                <p><strong>Amount:</strong> ₹{app.loanType?.loanAmount}</p>

                <button
                  className="view-btn"
                  onClick={() => navigate("/dashboard", { state: app })}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
