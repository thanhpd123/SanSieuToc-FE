import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      if (storedUser?.id && storedUser?.token) {
        setUser(storedUser);
      } else {
        setError('⚠️ Bạn cần đăng nhập để xem lịch sử đặt sân.');
        setLoading(false);
      }
    } catch (err) {
      setError('⚠️ Lỗi khi lấy thông tin người dùng.');
      localStorage.removeItem('userData');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.token) return;

      try {
        const res = await axios.get('/booking', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error(err);
        setError('❌ Không thể tải lịch sử đặt sân. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <p className="loading">Đang tải lịch sử đặt sân...</p>;
  if (error) return <p className="error">{error}</p>;

  return (

    
    <>
      <div className="booking-history-container">
        <h2 className="heading">📋 Lịch sử đặt sân</h2>

        {bookings.length === 0 ? (
          <p className="no-bookings">Bạn chưa có lượt đặt sân nào.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h3 className="field-name">🏟️ {booking.fieldId?.name || 'Tên sân'}</h3>
              <p className="info">
                📍 <strong>Địa chỉ:</strong> {booking.fieldId?.address || 'Không rõ'}
              </p>
              <p className="info">
                📅 <strong>Ngày:</strong> {booking.date}
              </p>
              <p className="info">
                ⏰ <strong>Giờ:</strong> {booking.startTime} - {booking.endTime}
              </p>
              <p className="info">
                💰 <strong>Tổng tiền:</strong> {booking.totalPrice?.toLocaleString()} ₫
              </p>
              <p className="info">
                📌 <strong>Trạng thái:</strong>{' '}
                <span className={`status ${booking.status}`}>
                  {booking.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .booking-history-container {
          padding: 1rem;
          max-width: 768px;
          margin: 0 auto;
          font-family: 'Segoe UI', sans-serif;
        }

        .heading {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .no-bookings {
          color: #4b5563;
          font-style: italic;
        }

        .error {
          padding: 1rem;
          color: #dc2626;
          font-weight: 500;
        }

        .loading {
          padding: 1rem;
          font-weight: 500;
        }

        .booking-card {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .booking-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .field-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .info {
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.4rem;
        }

        .status {
          font-weight: 600;
          text-transform: capitalize;
        }

        .status.pending {
          color: #ca8a04;
        }

        .status.confirmed {
          color: #16a34a;
        }

        .status.cancelled {
          color: #dc2626;
        }

        @media (max-width: 640px) {
          .heading {
            font-size: 1.3rem;
          }

          .field-name {
            font-size: 1.1rem;
          }

          .info {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookingHistory;
