import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Bongda from "./component/Bongda";
import Bongro from "./component/Bongro";
import Tennis from "./component/Tennis";
import Login from "./component/Login";
import Booking from "./component/Booking"
import BookingHistory from './component/BookingHistory';
import Coaches from './component/Coaches';
import CoachBooking from './component/CoachBooking';
import CoachBookingHistory from './component/CoachBookingHistory';
import OwnerFields from './component/OwnerFields';
import CreateField from './component/CreateField';
import EditField from './component/EditField';
import OwnerSchedule from './component/OwnerSchedule';
import RevenueReport from './component/RevenueReport';
import CompareRevenue from './component/CompareRevenue';


function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) setUser(storedUser);
  }, []);


  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d0" element={<Bongda />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d1" element={<Bongro />} />
      <Route path="/loaisan/6836d3231f7f6d0deb0f98d2" element={<Tennis />} />
      <Route path="/register" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/manager/fields" element={<OwnerFields user={user} />} />
      <Route path="/manager/fields/create" element={<CreateField user={user} />} />
      <Route path="/manager/fields/:id/edit" element={<EditField user={user} />} />
      <Route path="/manager/bookings" element={<OwnerSchedule user={user} />} />
      <Route path="/manager/revenue" element={<RevenueReport user={user} />} />
      <Route path="/manager/compare" element={<CompareRevenue user={user} />} />


      <Route path="/booking/:id" element={<Booking />} />
      <Route path="/lichsu-datsan" element={<BookingHistory />} />
      <Route path="/coach" element={<Coaches />} />
      <Route path="/coach/:coachId/booking" element={<CoachBooking />} />
      <Route path="/coachbookinghistory" element={<CoachBookingHistory />} />

    </Routes>
  );
}

export default App;
