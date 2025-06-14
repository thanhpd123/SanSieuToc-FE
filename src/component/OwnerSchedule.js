import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../main/OwnerSchedule.css";

const OwnerSchedule = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get("/booking/owner", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
        setFilteredBookings(res.data); // mặc định ban đầu
      } catch (err) {
        console.error("Lỗi khi tải lịch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Lọc dữ liệu theo filterType
  useEffect(() => {
    if (!bookings) return;

    const todayStr = new Date().toISOString().split("T")[0];

    let filtered = [];

    switch (filterType) {
      case "today":
        filtered = bookings.filter((b) => b.date === todayStr);
        break;
      case "date":
        filtered = bookings.filter((b) => b.date === selectedDate);
        break;
      case "month":
        filtered = bookings.filter((b) =>
          b.date?.startsWith(selectedMonth)
        );
        break;
      default:
        filtered = bookings;
    }

    setFilteredBookings(filtered);
  }, [filterType, selectedDate, selectedMonth, bookings]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="font-sans">
      {/* Header giống OwnerFields */}
      <header className="navbar">
        <div className="logo" onClick={() => navigate("/manager/fields")} style={{ cursor: "pointer" }}>
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
          <a onClick={() => navigate("/manager/fields")}>Danh sách sân</a>
          <a onClick={() => navigate("/manager/bookings")}>Lịch đặt sân</a>
          <a onClick={() => navigate("/manager/revenue")}>Doanh thu</a>
        </nav>
      </div>

      <main className="content-wrapper">
        <section className="fields-list-container">
          <h1 className="t1">Lịch Đặt Sân</h1>

          {/* Bộ lọc */}
          <div className="filter-group">
            <button
              className={filterType === "today" ? "active" : ""}
              onClick={() => setFilterType("today")}
            >
              Hôm nay
            </button>
            <button
              className={filterType === "date" ? "active" : ""}
              onClick={() => setFilterType("date")}
            >
              Theo ngày
            </button>
            {filterType === "date" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
            <button
              className={filterType === "month" ? "active" : ""}
              onClick={() => setFilterType("month")}
            >
              Theo tháng
            </button>
            {filterType === "month" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            )}
          </div>

          {/* Danh sách lịch */}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : filteredBookings.length === 0 ? (
            <p>Không có lịch đặt sân phù hợp.</p>
          ) : (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Sân</th>
                  <th>Sân con</th>
                  <th>Giờ</th>
                  <th>Người đặt</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.date}</td>
                    <td>{b.fieldId?.name}</td>
                    <td>{b.fieldUnitId?.unitNumber || "-"}</td>
                    <td>{b.startTime} - {b.endTime}</td>
                    <td>{b.userId?.name || "Ẩn"}</td>
                    <td className={`status-${b.status}`}>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default OwnerSchedule;
