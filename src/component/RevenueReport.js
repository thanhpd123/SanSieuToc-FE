import React, { useState, useMemo } from "react";
import RevenueByBranch from "./RevenueByBranch";
import RevenueByField from "./RevenueByField";
import RevenueBySlot from "./RevenueBySlot";
import { useNavigate } from "react-router-dom";
import "../main/RevenueReport.css";

const RevenueReport = ({ user }) => {
  const [tab, setTab] = useState("branch");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const userData = useMemo(() => {
  const raw = localStorage.getItem("userData");
  console.log("raw userData from localStorage:", raw); 
  return raw ? JSON.parse(raw) : null;
}, []);

console.log("Parsed userData:", userData);
const userId = userData?._id || userData?.id; 
const token = userData?.token;

console.log("userId:", userId);
console.log("token:", token);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="revenue-container">
      {/* Header */}
      <header className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/manager/fields")}
          style={{ cursor: "pointer" }}
        >
          <span className="green-text">Sân</span>
          <span className="white-text">SiêuTốc ⚡</span>
        </div>
        <button onClick={handleLogout} className="auth-button logout-button">
          Đăng xuất
        </button>
      </header>

      {/* Strip điều hướng */}
      <div className="yellow-strip">
        <nav className="loaisan-nav">
          <span role="button" onClick={() => navigate("/manager/fields")}>
            Danh sách sân
          </span>
          <span role="button" onClick={() => navigate("/manager/bookings")}>
            Lịch đặt sân
          </span>
          <span role="button" onClick={() => navigate("/manager/revenue")}>
            Doanh thu
          </span>
        </nav>
      </div>

      {/* Tabs */}
      <div className="tab-strip">
        <button className={tab === "branch" ? "tab active" : "tab"} onClick={() => setTab("branch")}>
          Theo cơ sở
        </button>
        <button className={tab === "field" ? "tab active" : "tab"} onClick={() => setTab("field")}>
          Theo sân bóng
        </button>
        <button className={tab === "slot" ? "tab active" : "tab"} onClick={() => setTab("slot")}>
          Theo slot
        </button>
      </div>

      {/* Bộ lọc ngày */}
      <div className="date-picker-container">
        <label>
          Từ:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          Đến:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </div>

      {/* Hiển thị bảng theo tab */}
      {tab === "branch" && userId && (
        <RevenueByBranch token={token} userId={userId} startDate={startDate} endDate={endDate} />
      )}
      {tab === "field" && userId && (
        <RevenueByField token={token} userId={userId} startDate={startDate} endDate={endDate} />
      )}
      {tab === "slot" && userId && (
        <RevenueBySlot token={token} userId={userId} startDate={startDate} endDate={endDate} />
      )}
    </div>
  );
};

export default RevenueReport;
