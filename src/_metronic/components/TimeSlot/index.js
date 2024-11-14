import React from 'react';

const TimeSlotDropdown = () => {
  const generateTimeSlots = () => {
    const slots = [];
    let startTime = 7 * 60; 
    const endTime = 22 * 60; 

    while (startTime < endTime) {
      const endTimeSlot = startTime + 15; 

      const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const displayHours = hours < 10 ? `0${hours}` : hours;
        const displayMinutes = mins < 10 ? `0${mins}` : mins;
        return `${displayHours}:${displayMinutes}`;
      };

      const timeSlot = `${formatTime(startTime)} to ${formatTime(endTimeSlot)}`;
      slots.push(timeSlot);
      startTime += 15; 
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <select>
      {timeSlots.map((slot, index) => (
        <option key={index} value={slot}>
          {slot}
        </option>
      ))}
    </select>
  );
};

export default TimeSlotDropdown;
