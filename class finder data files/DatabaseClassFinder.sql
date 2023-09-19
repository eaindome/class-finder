-- Create Programs table
CREATE TABLE Programs (
  program_id SERIAL PRIMARY KEY,
  program_name VARCHAR(255) NOT NULL UNIQUE
);

-- Create Years table
CREATE TABLE Years (
  year_id SERIAL PRIMARY KEY,
  year_name VARCHAR(255) NOT NULL UNIQUE
);

-- Create DaysOfWeek table
CREATE TABLE DaysOfWeek (
  day_id SERIAL PRIMARY KEY,
  day_name VARCHAR(20) NOT NULL UNIQUE
);

-- Create Courses table
CREATE TABLE Courses (
  course_id SERIAL PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL,
  course_code VARCHAR(255) NOT NULL
);

-- Create Lecturers table
CREATE TABLE Lecturers (
  lecturer_id SERIAL PRIMARY KEY,
  lecturer_name VARCHAR(255) NOT NULL,
  lecturer_email VARCHAR(255) NOT NULL UNIQUE
);

-- Create ProgramYears table
CREATE TABLE ProgramYears (
  program_year_id SERIAL PRIMARY KEY,
  program_id INT NOT NULL,
  year_id INT NOT NULL,
  UNIQUE (program_id, year_id),
  FOREIGN KEY (program_id) REFERENCES Programs (program_id),
  FOREIGN KEY (year_id) REFERENCES Years (year_id)
);

-- Create ProgramCourses table (Junction table)
CREATE TABLE ProgramCourses (
  program_course_id SERIAL PRIMARY KEY,
  program_id INT NOT NULL,
  course_id INT NOT NULL,
  UNIQUE (program_id, course_id),
  FOREIGN KEY (program_id) REFERENCES Programs (program_id),
  FOREIGN KEY (course_id) REFERENCES Courses (course_id)
);

-- Create LecturerCourses table (Junction table)
CREATE TABLE LecturerCourses (
  lecturer_course_id SERIAL PRIMARY KEY,
  lecturer_id INT NOT NULL,
  course_id INT NOT NULL,
  UNIQUE (lecturer_id, course_id),
  FOREIGN KEY (lecturer_id) REFERENCES Lecturers (lecturer_id),
  FOREIGN KEY (course_id) REFERENCES Courses (course_id)
);

-- Create Users table
CREATE TABLE Users (
  user_id SERIAL PRIMARY KEY,
  student_reference_number INT NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) NOT NULL DEFAULT 'Student',
  notification_preference BOOLEAN NOT NULL,
  program_year_id INT,
  FOREIGN KEY (program_year_id) REFERENCES ProgramYears (program_year_id)
);

-- Create Rooms table
CREATE TABLE Rooms (
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR(255) NOT NULL,
  room_capacity INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Available',
  location VARCHAR(255),
  UNIQUE (room_name)
);

-- Create Timetables table
CREATE TABLE Timetables (
  timetable_id SERIAL PRIMARY KEY,
  program_year_id INT NOT NULL,
  program_course_id INT NOT NULL,
  lecturer_course_id INT NOT NULL,
  room_id INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  day_id INT NOT NULL,
  FOREIGN KEY (program_year_id) REFERENCES ProgramYears (program_year_id),
  FOREIGN KEY (program_course_id) REFERENCES ProgramCourses (program_course_id),
  FOREIGN KEY (lecturer_course_id) REFERENCES LecturerCourses (lecturer_course_id),
  FOREIGN KEY (room_id) REFERENCES Rooms (room_id),
  FOREIGN KEY (day_id) REFERENCES DaysOfWeek (day_id)
);

-- Create index on frequently queried columns
CREATE INDEX idx_timetables_program_year_id ON Timetables (program_year_id);
CREATE INDEX idx_timetables_program_course_id ON Timetables (program_course_id);
CREATE INDEX idx_timetables_lecturer_course_id ON Timetables (lecturer_course_id);
CREATE INDEX idx_timetables_room_id ON Timetables (room_id);
CREATE INDEX idx_timetables_day_id ON Timetables (day_id);

-- Create the BookedClasses table
CREATE TABLE BookedClasses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users (user_id),
  room_id INTEGER REFERENCES Rooms (room_id),
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adding constraints
ALTER TABLE Users
ALTER COLUMN notification_preference SET DEFAULT false;

ALTER TABLE Users ADD CONSTRAINT users_email_unique UNIQUE (email);

CREATE TABLE session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

ALTER TABLE session ADD CONSTRAINT session_sid_unique UNIQUE (sid);

ALTER TABLE Users ADD device_token character varying(255) SET DEFAULT '';

ALTER TABLE Users ALTER COLUMN notification_preference SET DEFAULT false;
