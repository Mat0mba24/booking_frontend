import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import getMonthDays from "../utils/getMonthDays";
import styles from "../styles/HotelsPage.module.css";
import { Loader } from "../components/Loader";

const HotelsPage = () => {
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dates, setDates] = useState([]);
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();
  const { locationParam } = useParams();
  const locationSearch = useLocation().search;
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const dates = getMonthDays();
    setDates(dates);

    const query = new URLSearchParams(locationSearch);
    const dateFromQuery = query.get("date_from") || "";
    const dateToQuery = query.get("date_to") || "";

    if (!locationParam && !dateFromQuery && !dateToQuery) {
      const defaultDateFrom = new Date().toISOString().split("T")[0];
      const defaultDateTo = new Date(
        new Date().setDate(new Date().getDate() + 31)
      )
        .toISOString()
        .split("T")[0];
      navigate(
        `/hotels/Алтай?date_from=${defaultDateFrom}&date_to=${defaultDateTo}`
      );
    } else {
      setDateFrom(dateFromQuery);
      setDateTo(dateToQuery);
    }
  }, [locationParam, locationSearch, navigate]);

  useEffect(() => {
    const fetchHotels = async () => {
      const query = new URLSearchParams(locationSearch);
      const dateFromQuery = query.get("date_from") || dateFrom;
      const dateToQuery = query.get("date_to") || dateTo;

      if (locationParam && dateFromQuery && dateToQuery) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            BASE_URL + `/api/hotels/${locationParam}`,
            {
              params: {
                date_from: dateFromQuery,
                date_to: dateToQuery,
              },
            }
          );
          setHotels(response.data);
          setLocation(locationParam);
          setDateFrom(dateFromQuery);
          setDateTo(dateToQuery);
        } catch (error) {
          console.error("Ошибка при получении отелей:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setHotels([]);
      }
    };

    fetchHotels();
  }, [locationParam, locationSearch]);

  const searchForOperation = () => {
    navigate(`/hotels/${location}?date_from=${dateFrom}&date_to=${dateTo}`);
  };

  const exploreHotelRooms = (hotelId) => {
    navigate(`/hotels/id/${hotelId}?date_from=${dateFrom}&date_to=${dateTo}`);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <Header />
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Введите место, которое хотели бы посетить..."
              className={styles.searchInput}
            />
          </div>
          <span>С</span>
          <select
            id="date_from"
            className={styles.dateSelect}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          >
            {dates.map((date) => (
              <option key={date.date} value={date.date}>
                {date.date_formatted}
              </option>
            ))}
          </select>
          <span>По</span>
          <select
            id="date_to"
            className={styles.dateSelect}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          >
            {dates.map((date) => (
              <option key={date.date} value={date.date}>
                {date.date_formatted}
              </option>
            ))}
          </select>
          <button onClick={searchForOperation} className={styles.searchButton}>
            Найти
          </button>
        </div>
        {hotels.length > 0 ? (
          <div className={styles.hotelsContainer}>
            {hotels.map((hotel) => (
              <div key={hotel.id} className={styles.hotelCard}>
                <img
                  src={BASE_URL + `/static/images/${hotel.image_id}.webp`}
                  alt="Отель"
                  className={styles.hotelImage}
                />
                <div className={styles.hotelDetails}>
                  <div className={styles.hotelName}>{hotel.name}</div>
                  <hr className="my-2" />
                  <div className={styles.hotelDescription}>
                    {hotel.description}
                  </div>
                  <div className={styles.hotelLocation}>📍{hotel.location}</div>
                  <div className={styles.hotelServices}>
                    {hotel.services.join(" · ")}
                  </div>
                  <div className={styles.hotelRooms}>
                    Осталось номеров: {hotel.rooms_left} из{" "}
                    {hotel.rooms_quantity}
                  </div>
                </div>
                <div className={styles.hotelActions}>
                  <button
                    onClick={() => exploreHotelRooms(hotel.id)}
                    className={styles.selectRoomButton}
                  >
                    Выбрать номер
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noHotelsMessage}>Нет доступных отелей</div>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
