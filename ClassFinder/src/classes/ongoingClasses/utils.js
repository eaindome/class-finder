// Get the current day
const getCurrentDay = () => {
    const currentDate = new Date();
    currentDate.setUTCHours(currentDate.getUTCHours() - 12);
    const options = { weekday: 'long', timeZone: 'Etc/GMT' };
    return currentDate.toLocaleDateString('en-US', options);
};

/*
// Get the current time in 'HH:MM' format
const getCurrentTime = () => {
    const currentDate = new Date();
    currentDate.setUTCHours(currentDate.getUTCHours() - 12);

    // Check if the hour is 24 and modify it to 0 (midnight)
    const hour = (currentDate.getHours() === 24) ? '00' : currentDate.getHours();

    const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Etc/GMT' };
    return currentDate.toLocaleString('en-US', options).replace(/(\d{2}:\d{2}):\d{2}/, `${hour}:$2`);
};*/

// Get the current time in 'HH:MM' format
const getCurrentTime = () => {
  const currentDate = new Date();
  //console.log('Current Date: ', currentDate);
  currentDate.setUTCHours(currentDate.getUTCHours());

  //console.log('Date: ', currentDate);

  let hour = currentDate.getHours();
  //console.log('Hour: ', hour);
  let minute = currentDate.getMinutes();

  if (hour === 24) {
    hour = 0; // Modify 24 to 0 for midnight
  }
  //console.log('hour: ', hour);

  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');

  return `${formattedHour}:${formattedMinute}`;
};
  
console.log('Current Day: ', getCurrentDay());
console.log('Current Time: ', getCurrentTime());

module.exports = {
  getCurrentDay,
  getCurrentTime,
};
  

