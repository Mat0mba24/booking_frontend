import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import HotelsPage from './pages/HotelsPage';
import RoomsPage from './pages/RoomsPage';
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="hotels" element={<HotelsPage />} />
                <Route path="hotels/:locationParam" element={<HotelsPage />} />
                <Route path="hotels/id/:hotelId" element={<RoomsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
