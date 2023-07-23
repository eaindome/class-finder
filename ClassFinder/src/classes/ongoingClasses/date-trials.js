const currentDate = new Date();
console.log(currentDate);
const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
console.log(currentMonth);
const currentDay = currentDate.getDate();
console.log(currentDay);
const currentYear = currentDate.getFullYear();
console.log(currentYear);

const result = `As of now, the current date is ${currentMonth} ${currentDay}, ${currentYear}.`;
console.log(result);
