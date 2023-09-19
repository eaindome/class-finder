-- Create User table
CREATE TABLE User (
  UserID SERIAL PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role VARCHAR(20) NOT NULL
);

-- Create LectureRoom table
CREATE TABLE LectureRoom (
  RoomID SERIAL PRIMARY KEY,
  RoomNumber VARCHAR(10) NOT NULL,
  Capacity INT NOT NULL,
  AvailabilityStatus VARCHAR(20) NOT NULL
);

-- Create Timetable table
CREATE TABLE Timetable (
  TimetableID SERIAL PRIMARY KEY,
  CourseID INT REFERENCES Course(CourseID),
  LectureRoomID INT REFERENCES LectureRoom(RoomID),
  StartTime TIME NOT NULL,
  EndTime TIME NOT NULL,
  Status VARCHAR(20) NOT NULL
);

-- Create Course table
CREATE TABLE Course (
  CourseID SERIAL PRIMARY KEY,
  CourseCode VARCHAR(20) NOT NULL,
  Title VARCHAR(255) NOT NULL,
  Instructor VARCHAR(255) NOT NULL
);

-- Create Booking table
CREATE TABLE Booking (
  BookingID SERIAL PRIMARY KEY,
  UserID INT REFERENCES User(UserID),
  TimetableID INT REFERENCES Timetable(TimetableID),
  BookingTime TIMESTAMP NOT NULL
);
