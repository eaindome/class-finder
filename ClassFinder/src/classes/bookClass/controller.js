const pool = require('../../../database');
const queries = require('./queries');
const { getCurrentDay, getCurrentTime } = require('../ongoingClasses/utils');
const axios = require('axios');
const moment = require('moment');


let manuallyUpdatedRoomIds = [];

// Endpoint: Book a class/lecture room
const bookClassNow = async (req, res) => {
  try {
    const { roomName } = req.params;
    const { day, course, duration } = req.body;
    const userId = req.session.userid;

    // Check if the user is authenticated (session validation)
    if (!userId) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    // Verify the user's role is "Class Rep"
    const userRoleQuery = await pool.query(queries.getUserRole, [userId]);
    const userRole = userRoleQuery.rows[0].role;

    if (userRole !== 'Class Rep') {
      return res.status(403).json({ error: 'Access denied. Only Class Reps can book classes.' });
    }

    // Find the roomId based on the provided roomName
    const roomQuery = await pool.query(queries.getRoomIdFromName, [roomName]);
    const roomId = roomQuery.rows[0].room_id;
    
    /*
    // Check if the room is available
    const classExists = await queries.getClassByRoomAndDay(roomId, day);

    if (classExists) {
      return res.status(409).json({ error: 'The room is not available for booking.' });
    }*/

    // Update the room status to "Booked"
    await pool.query(queries.updateRoomStatus, ['Booked', roomId]);

    // Add the manually updated room ID to the array
    manuallyUpdatedRoomIds.push(roomId);

    // Insert booking information into the BookedClasses table
    const bookingQuery = await pool.query(queries.bookClass, [userId, roomId, course, day, duration]);
    const bookingId = bookingQuery.rows[0].booking_id;

    // Set a timer to automatically change the room status to "Ongoing" after 5 minutes
    setTimeout(async () => {
      // Check if the room status is still "Booked" before updating it to "Ongoing"
      const currentStatusQuery = await pool.query(queries.getRoomStatus, [roomId]);
      const currentStatus = currentStatusQuery.rows[0].status;

      if (currentStatus === 'Booked') {
        await pool.query(queries.updateRoomStatus, ['Ongoing', roomId]);

        // Add the manually updated room ID to the array
        manuallyUpdatedRoomIds.push(roomId);
      }
    }, 5 * 60 * 1000); // 5 minutes (converted to milliseconds)

    res.status(200).json({
      message: 'Class booked successfully.',
      bookingId,
      selectedRoom: `Room ${roomName}`,
      day,
      course,
      duration,
    });
  } catch (error) {
    console.error('Error executing query: ', error);
    console.error(error); // Log the error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint: Cancel a room booking by the class representative
const cancelRoomBooking = async (req, res) => {
  try {
    const { roomName } = req.params;
    const userId = req.session.userid;

    // Check if the user is authenticated (session validation)
    if (!userId) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    // Verify the user's role is "Class Rep"
    const userRoleQuery = await pool.query(queries.getUserRole, [userId]);
    const userRole = userRoleQuery.rows[0].role;

    // Find the roomId based on the provided roomName
    const roomQuery = await pool.query(queries.getRoomIdFromName, [roomName]);
    const roomId = roomQuery.rows[0].room_id; 

    if (userRole !== 'Class Rep') {
      return res.status(403).json({ error: 'Access denied. Only Class Reps can cancel class bookings.' });
    }

    // Check if the room ID is in the manuallyUpdatedRoomIds array
    if (!manuallyUpdatedRoomIds.includes(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID. The room was not manually updated.' });
    }

    // Check if the class status is "Booked" or "Ongoing" before cancelling the booking
    const classStatusQuery = await pool.query(queries.getRoomStatus, [roomId]);
    const classStatus = classStatusQuery.rows[0].status;

    if (classStatus === 'Booked' || classStatus === 'Ongoing') {
      await pool.query(queries.updateRoomStatus, ['Cancelled', roomId]);

      // Remove the manually updated room ID from the array
      manuallyUpdatedRoomIds = manuallyUpdatedRoomIds.filter((id) => id !== roomId);

      res.status(200).json({ message: 'Class booking cancelled successfully.' });
    } else {
      res.status(409).json({ error: 'The class is not currently booked or ongoing.' });
    }
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint: Get Available Times of a Lecture Room
const getAvailableTimes = async (req, res) => {
  try {
    const { roomName, day } = req.params;

    // Find the roomId based on the provided roomName
    const roomQuery = await pool.query(queries.getRoomIdFromName, [roomName]);
    const roomId = roomQuery.rows[0].room_id;

    const availableTimes = await calculateAvailableTimes(roomId, day);
    //console.log("availableTimes", availableTimes);

    res.status(200).json({ availableTimes });
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function: Calculate Available Times
const calculateAvailableTimes = async (roomId, day) => {
  try {
    const timetableQuery = await pool.query(queries.getTimetableByRoomAndDay, [roomId, day]);
    const timetable = timetableQuery.rows;
    
    // Sort timetable by start time
    timetable.sort((a, b) => a.start_time.localeCompare(b.start_time));

    const availableTimes = [];

    // Static start and end times
    const startTime = '08:01:00';
    const endTime = '19:59:00';

    // Check if there are classes before the first scheduled class
    if (timetable.length > 0) {
      const firstClass = timetable[0];
      if (firstClass.start_time > startTime) {
        availableTimes.push({ start_time: startTime, end_time: firstClass.start_time });
      }
    } else {
      // If there are no classes, the entire day is available
      availableTimes.push({ start_time: startTime, end_time: endTime });
      return availableTimes;
    }

    // Calculate available times based on timetable gaps
    for (let i = 0; i < timetable.length - 1; i++) {
      const currentClass = timetable[i];
      const nextClass = timetable[i + 1];

      if (currentClass.end_time < nextClass.start_time) {
        availableTimes.push({ start_time: currentClass.end_time, end_time: nextClass.start_time });
      }
    }

    // Check if there are classes after the last scheduled class
    const lastClass = timetable[timetable.length - 1];
    if (lastClass.end_time < endTime) {
      availableTimes.push({ start_time: lastClass.end_time, end_time: endTime });
    }

    return availableTimes;
  } catch (error) {
    throw new Error('Error calculating available times');
  }
};

// Endpoint: Get Available Times of a Lecture Room
const getAvailableTimesCurrent = async (req, res) => {
  try {
    const { roomName } = req.params;
    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();

    // Find the roomId based on the provided roomName
    const roomQuery = await pool.query(queries.getRoomIdFromName, [roomName]);
    const roomId = roomQuery.rows[0].room_id;

    const availableTimes = await calculateAvailableTimesCurrent(roomId, currentDay, currentTime, true);

    res.status(200).json({ availableTimes });
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function: Calculate Available Times
const calculateAvailableTimesCurrent = async (roomId, day, currentTime, isCurrentEndpoint = false) => {
  try {
    const timetableQuery = await pool.query(queries.getTimetableByRoomAndDay, [roomId, day]);
    const timetable = timetableQuery.rows;

    // Sort timetable by start time
    timetable.sort((a, b) => a.start_time.localeCompare(b.start_time));

    const availableTimes = [];
    
    if (timetable.length === 0) {
      // If no classes are scheduled, consider the time from currentTime to '19:59:00' as available
      if (isCurrentEndpoint && currentTime) {
        if (currentTime < '19:59:00') {
          availableTimes.push({ start_time: currentTime, end_time: '19:59:00' });
        } else {
          return 'Rooms are closed for the day.';
        }
      } 
    } else {
      if (isCurrentEndpoint && currentTime) {
        const firstClass = timetable[0];
        const lastClass = timetable[timetable.length - 1];
  
        const startTime = firstClass.start_time;
        const endTime = lastClass.end_time;
  
        if (endTime < '19:59:00') {
          availableTimes.push({ start_time: endTime, end_time: '19:59:00' });
        }
  
        if (currentTime < startTime || currentTime > '19:59:00') {
          return 'Rooms are closed for the day.';
        }
      }
    }

    return availableTimes;
  } catch (error) {
    throw new Error('Error calculating available times');
  }
};

// Endpoint: Book a class/lecture room for a future event
const bookClassLater = async (req, res) => {
  try {
    const { roomName } = req.params;
    const { day, course, duration, startTime } = req.body;
    const userId = req.session.userid;

    // Find the roomId based on the provided roomName
    const roomQuery = await pool.query(queries.getRoomIdFromName, [roomName]);
    const roomId = roomQuery.rows[0].room_id;

    // Check if the user is authenticated (session validation)
    if (!userId) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    // Verify the user's role is "Class Rep"
    const userRoleQuery = await pool.query(queries.getUserRole, [userId]);
    const userRole = userRoleQuery.rows[0].role;

    if (userRole !== 'Class Rep') {
      return res.status(403).json({ error: 'Access denied. Only Class Reps can book classes.' });
    }

    // Get the available times for the specified room and day
    const availableTimesResponse = await axios.get(`http://localhost:3000/api/v1/src/classes/bookClass/availableTimes/${roomName}/${day}`);
    const availableTimes = availableTimesResponse.data.availableTimes;
    console.log(availableTimes);

    // Check if the specified start time falls within any of the available time slots
    const isTimeAvailable = availableTimes.some((time) => {
      const startTimeMoment = moment(startTime, 'HH:mm:ss');
      console.log('startTimeMoment: ', startTimeMoment);
      const availableStartTimeMoment = moment(time.start_time, 'HH:mm:ss');
      console.log('availableStartTimeMoment: ', availableStartTimeMoment);
      const availableEndTimeMoment = moment(time.end_time, 'HH:mm:ss');
      console.log('availableEndTimeMoment: ', availableEndTimeMoment);
      console.log('string: ', startTimeMoment.isBetween(availableStartTimeMoment, availableEndTimeMoment, null, '[)'));
      
      return startTimeMoment.isBetween(availableStartTimeMoment, availableEndTimeMoment, null, '[)');
    });
    console.log(isTimeAvailable);
    if (!isTimeAvailable) {
      return res.status(409).json({ error: 'The room is not available for booking at the specified time.' });
    }


    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();

    // Check if the current day and time match the booking day and time
    if (currentDay === day && currentTime >= startTime) {
      return res.status(409).json({ error: 'The room cannot be booked for the current day and time.' });
    }

    // Update the room status to "Booked" on the specified day and time
    setTimeout(async () => {
      // Check if the room status is still "Booked" before updating it to "Ongoing"
      const currentStatusQuery = await pool.query(queries.getRoomStatus, [roomId]);
      const currentStatus = currentStatusQuery.rows[0].status;

      if (currentStatus === 'Booked') {
        await pool.query(queries.updateRoomStatus, ['Ongoing', roomId]);

        // Add the manually updated room ID to the array
        manuallyUpdatedRoomIds.push(roomId);
      }
    }, calculateTimeout(currentDay, day, currentTime, startTime));

    res.status(200).json({
      message: 'Class booked successfully.',
      selectedRoom: `Room ${roomId}`,
      day,
      course,
      duration,
    });
  } catch (error) {
    console.error('Error executing query: ', error);
    console.error(error); // Log the error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint: Book a class/lecture room for a future event on the current day
const bookClassLaterDay = async (req, res) => {
  try {
    const { roomName } = req.params;
    const { course, duration, startTime } = req.body;
    const userId = req.session.userid;

    // Check if the user is authenticated (session validation)
    if (!userId) {
      return res.status(401).json({ error: 'User not logged in' });
    }

    // Find the roomId based on the provided roomName
    const roomQuery = await pool.query(queries.getRoomIdFromName, [roomName]);
    const roomId = roomQuery.rows[0].room_id;

    // Verify the user's role is "Class Rep"
    const userRoleQuery = await pool.query(queries.getUserRole, [userId]);
    const userRole = userRoleQuery.rows[0].role;

    if (userRole !== 'Class Rep') {
      return res.status(403).json({ error: 'Access denied. Only Class Reps can book classes.' });
    }

    // Get the available times for the specified room and the current day
    const availableTimesResponse = await axios.get(`http://localhost:3000/api/v1/src/classes/bookClass/getAvailableTimesCurrent/${roomName}`);
    const availableTimes = availableTimesResponse.data.availableTimes;
    console.log('Available Times: ', availableTimes);

    // Check if the specified start time falls within any of the available time slots
    const isTimeAvailable = availableTimes.some((time) => {
      const startTimeMoment = moment(startTime, 'HH:mm:ss');
      console.log('startTimeMoment: ', startTimeMoment);
      const availableStartTimeMoment = moment(time.start_time, 'HH:mm:ss');
      console.log('availableStartTimeMoment: ', availableStartTimeMoment);
      const availableEndTimeMoment = moment(time.end_time, 'HH:mm:ss');
      console.log('availableEndTimeMoment: ', availableEndTimeMoment);
      console.log('string: ', startTimeMoment.isBetween(availableStartTimeMoment, availableEndTimeMoment, null, '[)'));

      return startTimeMoment.isBetween(availableStartTimeMoment, availableEndTimeMoment, null, '[)');
    });
    console.log('Time Available: ', isTimeAvailable);

    if (!isTimeAvailable) {
      return res.status(409).json({ error: 'The room is not available for booking at the specified time Here.' });
    }

    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();

    // Check if the current day and time match the booking day and time
    if (currentTime >= startTime) {
      console.log('Current time: ', currentTime);
      console.log('startTime: ', startTime);
      return res.status(409).json({ error: 'The room cannot be booked for the current day and time here!.' });
    }

    // Calculate the timeout in milliseconds
    const timeout = calculateTimeout(currentDay, currentDay, currentTime, startTime);

    // Update the room status to "Booked" 10 minutes before the start time
    setTimeout(async () => {
      const currentStatusQuery = await pool.query(queries.getRoomStatus, [roomId]);
      const currentStatus = currentStatusQuery.rows[0].status;

      if (currentStatus !== 'Cancelled'|| currentStatus !== 'Ongoing' ) {
        await pool.query(queries.updateRoomStatus, ['Booked', roomId]);

        // Add the manually updated room ID to the array
        manuallyUpdatedRoomIds.push(roomId);
      }
    }, timeout - 5 * 60 * 1000); // 10 minutes (converted to milliseconds)

    // Update the room status to "Ongoing" after the start time
    setTimeout(async () => {
      const currentStatusQuery = await pool.query(queries.getRoomStatus, [roomId]);
      const currentStatus = currentStatusQuery.rows[0].status;

      if (currentStatus !== 'Cancelled') {
        await pool.query(queries.updateRoomStatus, ['Ongoing', roomId]);
      }
    }, timeout);

    res.status(200).json({
      message: 'Class booked successfully.',
      selectedRoom: `Room ${roomName}`,
      day: currentDay,
      course,
      duration,
    });
  } catch (error) {
    console.error('Error executing query: ', error);
    console.error(error); // Log the error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint: Get all booked rooms
const getBookedRooms = async (req, res) => {
  try {
    const bookedRoomsQuery = await pool.query(queries.getBookedRooms);
    const bookedRooms = bookedRoomsQuery.rows;

    res.status(200).json({ bookedRooms });
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Function: Calculate the timeout in milliseconds
const calculateTimeout = (currentDay, bookingDay, currentTime, bookingTime) => {
  const daysDiff = calculateDayDifference(currentDay, bookingDay);
  const timeDiff = calculateTimeDifference(currentTime, bookingTime);

  return daysDiff * 24 * 60 * 60 * 1000 + timeDiff;
};

// Function: Calculate the difference in days
const calculateDayDifference = (currentDay, bookingDay) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = daysOfWeek.indexOf(currentDay);
  const bookingDayIndex = daysOfWeek.indexOf(bookingDay);

  if (currentDayIndex === -1 || bookingDayIndex === -1) {
    throw new Error('Invalid day');
  }

  if (currentDayIndex <= bookingDayIndex) {
    return bookingDayIndex - currentDayIndex;
  }

  return 7 - currentDayIndex + bookingDayIndex;
};

// Function: Calculate the difference in time
const calculateTimeDifference = (currentTime, bookingTime) => {
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  const [bookingHour, bookingMinute] = bookingTime.split(':').map(Number);

  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const bookingTotalMinutes = bookingHour * 60 + bookingMinute;

  if (currentTotalMinutes <= bookingTotalMinutes) {
    return (bookingTotalMinutes - currentTotalMinutes) * 60 * 1000;
  }

  return (24 * 60 - currentTotalMinutes + bookingTotalMinutes) * 60 * 1000;
};

// Update the module.exports object to include the new endpoint
module.exports = {
  bookClassNow, 
  bookClassLater,
  bookClassLaterDay,
  getBookedRooms,
  cancelRoomBooking,
  manuallyUpdatedRoomIds,
  getAvailableTimes,
  getAvailableTimesCurrent,
};

/*
module.exports = {
  bookClassNow,
  cancelRoomBooking,
  manuallyUpdatedRoomIds,
  getAvailableTimes,
  getAvailableTimesCurrent,
};*/



