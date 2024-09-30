import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  const logoutUser = async () => {
    const response = await fetch(BASE_URL + "/api/auth/logout", {
      method: "POST",
    });

    if (response.status === 200) {
      navigate("/login");
    }
  };

  return (
    <nav className="nav">
      <div className="navContainer">
        <ul className="navList">
          <li className="navItem">
            <Link to="/hotels" className="navLink">
              🏩 Набронировал
            </Link>
          </li>
        </ul>
        <ul className="navList">
          <li className="navItem">
            <Link to="/bookings" className="navLink">
              Мои брони
            </Link>
          </li>
          <li className="navItem">
            <button onClick={logoutUser} className="navButton">
              Выйти
            </button>
          </li>
        </ul>
      </div>
      <hr />
    </nav>
  );
};

export default Header;
