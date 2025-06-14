// src/pages/Coaches.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook để điều hướng

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // Gọi API GET /coach để lấy danh sách
        const res = await axios.get("/coach");
        setCoaches(res.data);
      } catch (err) {
        console.error("Error fetching coaches:", err);
        setError(
          "❌ Không thể tải danh sách huấn luyện viên. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  if (loading) {
    return <p className="loading">Đang tải danh sách huấn luyện viên…</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Hàm xử lý khi bấm nút "Đặt lịch"
  const handleBook = (coachId) => {
    // Redirect tới trang booking của coach (ví dụ: /coach/<coachId>/booking)
    navigate(`/coach/${coachId}/booking`);
  };

  return (
    <div className="coaches-container">
      <h2 className="heading">🏋️‍♂️ Danh sách Huấn luyện viên</h2>
      {coaches.length === 0 ? (
        <p className="no-data">Hiện chưa có huấn luyện viên nào.</p>
      ) : (
        <div className="cards-grid">
          {coaches.map((coach) => (
            <div key={coach._id} className="coach-card">
              {/* Avatar */}
              <div
                className="avatar-wrapper clickable"
                onClick={() => handleBook(coach._id)}
              >
                <img
                  src={coach.image || "/images/default_coach.png"}
                  alt={coach.name}
                  className="avatar"
                />
              </div>

              {/* Thông tin */}
              <h3 className="card-name">{coach.name}</h3>
              <p className="card-item">
                <strong>Email:</strong> {coach.email}
              </p>
              <p className="card-item">
                <strong>Phone:</strong> {coach.phone}
              </p>
              <p className="card-item">
                <strong>Chuyên môn:</strong>{" "}
                {coach.specialties && coach.specialties.length > 0
                  ? coach.specialties.join(", ")
                  : "Chưa cập nhật"}
              </p>
              <p className="card-item">
                <strong>Giá/giờ:</strong> {coach.pricePerHour.toLocaleString()}{" "}
                ₫
              </p>
              {coach.description && (
                <p className="card-item card-description">
                  <strong>Mô tả:</strong> {coach.description}
                </p>
              )}
              {coach.availableTimes && coach.availableTimes.length > 0 && (
                <p className="card-item">
                  <strong>Thời gian trống:</strong>{" "}
                  {coach.availableTimes.join(", ")}
                </p>
              )}
              <p className="card-item">
                <strong>Đánh giá:</strong> {(coach.rating || 0).toFixed(1)}
              </p>

              {/* Nút đặt lịch */}
              <button
                className="btn-book"
                onClick={() => handleBook(coach._id)}
              >
                Đặt lịch huấn luyện viên
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CSS nội tuyến */}
      <style>{`
        .coaches-container {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', sans-serif;
        }

        .heading {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .loading, .error, .no-data {
          text-align: center;
          font-size: 1rem;
          color: #374151;
          margin-top: 2rem;
        }

        .error {
          color: #dc2626;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .coach-card {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .coach-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .avatar-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }

        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 0.75rem;
        }

        .card-item {
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.5rem;
          width: 100%;
          text-align: left;
        }

        .card-description {
          font-style: italic;
          color: #4b5563;
        }
          .clickable {
  cursor: pointer;
}

.avatar-wrapper.clickable:hover {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}


        .btn-book {
          margin-top: auto;
          padding: 0.5rem 1rem;
          background-color: #10b981;
          color: #ffffff;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-book:hover {
          background-color: #059669;
        }

        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .heading {
            font-size: 1.5rem;
          }
          .card-name {
            font-size: 1.1rem;
          }
          .card-item {
            font-size: 0.85rem;
          }
          .avatar-wrapper {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default Coaches;
