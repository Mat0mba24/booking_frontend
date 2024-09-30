import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../styles/RoomsPage.module.css";
import { Loader } from "../components/Loader";

const RoomsPage = () => {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [bookingLength, setBookingLength] = useState(0);
  const { hotelId } = useParams();
  const locationSearch = useLocation().search;
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const query = new URLSearchParams(locationSearch);
    const dateFromQuery = query.get("date_from") || "";
    const dateToQuery = query.get("date_to") || "";

    setDateFrom(dateFromQuery);
    setDateTo(dateToQuery);
    setBookingLength(
      (new Date(dateToQuery) - new Date(dateFromQuery)) / (1000 * 60 * 60 * 24)
    );

    const fetchHotel = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          BASE_URL + `/api/hotels/id/${hotelId}`
        );
        setHotel(response.data);
      } catch (error) {
        console.error("Ошибка при получении информации об отеле:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          BASE_URL + `/api/hotels/${hotelId}/rooms`,
          {
            params: {
              date_from: dateFromQuery,
              date_to: dateToQuery,
            },
          }
        );
        setRooms(response.data);
      } catch (error) {
        console.error("Ошибка при получении информации о номерах:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotel();
    fetchRooms();
  }, [BASE_URL, hotelId, locationSearch]);

  const bookRoom = async (roomId) => {
    const data = {
      room_id: roomId,
      date_from: dateFrom,
      date_to: dateTo,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(BASE_URL + "/api/bookings", data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Номер забронирован!");
      }
    } catch (error) {
      console.error("Ошибка бронирования номера:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <Header />
      <div className={styles.container}>
        {hotel !== null && (
          <div className={styles.header}>
            Выбор номера в{" "}
            <span className={styles.hotelName}>{hotel.name}</span>
          </div>
        )}
        {rooms.length > 0 ? (
          <div className={styles.roomsContainer}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.roomCard}>
                <img
                  src={BASE_URL + `/static/images/${room.image_id}.webp`}
                  alt="Номер"
                  className={styles.roomImage}
                />
                <div className={styles.roomDetails}>
                  <div className={styles.roomInfo}>
                    <div className={styles.roomName}>{room.name}</div>
                    <hr className="my-2" />
                    {room.description && (
                      <div className={styles.roomDescription}>
                        {room.description}
                      </div>
                    )}
                    <div className={styles.roomServices}>
                      {room.services.join(" · ")}
                    </div>
                    <span className={styles.roomAvailability}>
                      Осталось комнат: {room.rooms_left} из {room.quantity}
                    </span>
                  </div>
                  <div className={styles.roomActions}>
                    <span className={styles.roomCost}>{room.total_cost}</span>
                    <span className={styles.roomNights}>
                      за {bookingLength} ночей
                    </span>
                    <span className={styles.roomPrice}>
                      {room.price} за ночь
                    </span>
                    <div className={styles.bookingDates}>
                      <span>С {new Date(dateFrom).toLocaleDateString()}</span>
                      <span>По {new Date(dateTo).toLocaleDateString()}</span>
                      <button
                        onClick={() => bookRoom(room.id)}
                        className={styles.bookButton}
                      >
                        Забронировать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noRoomsMessage}>Нет доступных комнат</div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
