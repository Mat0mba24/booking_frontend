import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import styles from "../styles/BookingsPage.module.css";
import { Loader } from "../components/Loader";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/bookings`, {
          withCredentials: true,
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Ошибка при получении бронирований:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [BASE_URL]);

  const cancelBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/bookings/${bookingId}`, {
        withCredentials: true,
      });
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Ошибка при отмене бронирования:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <Header />
      <div className={styles.header}>Мои брони</div>
      <div className={styles.container}>
        {bookings.map((booking) => (
          <div key={booking.id} className={styles.booking}>
            <div className={styles.hotelName}>
              <span>{booking.hotel_name}</span>
            </div>
            <div className={styles.bookingCard}>
              <img
                src={`${BASE_URL}/static/images/${booking.image_id}.webp`}
                alt="Комната"
                className={styles.image}
              />
              <div className={styles.details}>
                <div className={styles.detailsTitle}>{booking.name}</div>
                <hr className="my-2" />
                {booking.description && (
                  <div className={styles.detailsDescription}>
                    {booking.description}
                  </div>
                )}
                <div className={styles.detailsServices}>
                  {booking.services.join(" · ")}
                </div>
              </div>
              <div className={styles.bookingInfo}>
                <span className={styles.bookingStatus}>✅ Забронировано</span>
                <span className={styles.bookingDates}>
                  С {booking.date_from}
                </span>
                <span className={styles.bookingDates}>
                  По {booking.date_to}
                </span>
                <span className={styles.bookingCost}>
                  {booking.total_cost.toLocaleString()}
                </span>
                <span className={styles.bookingNights}>
                  за {booking.total_days} ночей
                </span>
                <button
                  className={styles.cancelButton}
                  onClick={() => cancelBooking(booking.id)}
                >
                  Отменить бронь
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
