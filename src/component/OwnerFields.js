import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../main/OwnerFields.css";

const OwnerFields = ({ user }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchFields = async () => {
      try {
        const res = await axios.get("/field/owner", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFields(res.data);
      } catch (err) {
        console.error("Lỗi API:", err.response?.data || err.message);
        setError("Không thể tải danh sách sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateClick = () => navigate("/manager/fields/create");
  const handleEditClick = (id) => navigate(`/manager/fields/${id}/edit`);
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sân này?")) return;
    try {
      await axios.delete(`/field/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFields(fields.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Xoá sân lỗi:", err);
      alert("Không thể xoá sân.");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getTypeName = (type) => type?.name || "Không rõ";

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="navbar">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/manager/fields")}>
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

      {/* Nội dung chính */}
      <main className="content-wrapper">
        <section className="fields-list-container">
          <h1 className="t1">Sân Của Tôi</h1>

          {/* Nút Thêm sân */}
          <div className="text-center mt-3 mb-3">
            <button className="btn-dat-san" onClick={handleCreateClick}>
               Thêm sân
            </button>
          </div>

          {/* Danh sách sân */}
          {loading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : fields.length === 0 ? (
            <p>Chưa có sân nào được đăng.</p>
          ) : (
            <div className="fields-grid">
              {fields.map((field) => (
                <div key={field._id} className="field-card">
                  <div className="field-image-container" onClick={() => handleEditClick(field._id)}>
                    {field.images?.[0] ? (
                      <img src={field.images[0]} alt={field.name} className="field-image" />
                    ) : (
                      <div className="no-image">Không có ảnh</div>
                    )}
                    <span className="field-type-tag">{getTypeName(field.type)}</span>
                  </div>

                  <div className="field-info">
                    <p className="field-price">{formatPrice(field.pricePerHour)}</p>
                    <h3 className="field-name">{field.name}</h3>
                    <div className="field-location">
                      <img
                        src="https://img.icons8.com/ios-filled/24/000000/marker.png"
                        alt="location"
                        className="location-icon"
                      />
                      <span>{field.address}</span>
                    </div>

                    <div className="field-actions">
                      <button className="btn-dat-san" onClick={() => handleEditClick(field._id)}>
                        Chỉnh sửa
                      </button>
                      <button
                        className="auth-button logout-button"
                        onClick={() => handleDeleteClick(field._id)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OwnerFields;
