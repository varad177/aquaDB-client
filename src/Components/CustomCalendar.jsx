import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="m-calendar" style={styles.calendarContainer}>
      <Calendar
        onChange={setDate}
        value={date}
        next2Label={null}
        prev2Label={null}
        className="custom-calendar react-calendar"
      />
      <p style={styles.selectedDate}>
        Selected Date: {date.toDateString()}
      </p>
    </div>
  );
};

const styles = {
  calendarContainer: {
    backgroundColor: 'white',
    border: "0.5px solid #8b5cf6",
    borderRadius: '1rem',
    textAlign: 'center',
    padding: '2rem',
  },
  selectedDate: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#555',
  },
};

/* Add these CSS styles */
const additionalStyles = `
.m-calendar {
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  border-radius: 1.3rem;
}

.react-calendar {
  width: 100% !important;
  border: 0px !important;
  background-color: white !important;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2) !important;
}

.custom-calendar .react-calendar__tile {
  background: none;
  color: #333;
  font-weight: bold;
  margin: 5px;
  padding: 10px 0;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.custom-calendar .react-calendar__tile--active {
  background-color: #ff6b6b;
  color: #fff;
}

.custom-calendar .react-calendar__tile:hover {
  background-color: #e5e5e5;
}

.custom-calendar .react-calendar__navigation button {
  background: none;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 5px;
}

.custom-calendar .react-calendar__navigation button:disabled {
  color: #ccc;
}

.custom-calendar .react-calendar__navigation button:hover {
  background-color: #ff6b6b;
  color: #fff;
  border-radius: 5px;
}
`;

// Inject additional styles into the document
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = additionalStyles;
  document.head.appendChild(styleTag);
}

export default CustomCalendar;
