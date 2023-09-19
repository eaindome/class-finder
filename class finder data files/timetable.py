import pandas as pd
import psycopg2

connection = psycopg2.connect(
    host="localhost",
    database="ClassFinder",
    user="postgres",
    password="Eai@2460"
)

def insert_timetables():
    timetable_data = pd.read_excel('timetable_file.xlsx')

    # Map day names to their corresponding day IDs in the database
    day_mapping = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
        'Sunday': 7
    }

    for index, row in timetable_data.iterrows():
        program_name = row['program_name']
        year_name = row['year_name']
        course_code = row['course_code']
        lecturer_name = row['lecturer_name']
        room_name = row['room_name']
        start_time = row['start_time'].strftime('%H:%M:%S')
        end_time = row['end_time'].strftime('%H:%M:%S')
        day_name = row['day_name']
        day_id = day_mapping.get(day_name)

        # Get program_year_id from ProgramYears table based on program_name and year_name
        query = "SELECT program_year_id FROM ProgramYears WHERE program_name = %s AND year_name = %s;"
        connection.execute(query, (program_name, year_name))
        program_year_id = connection.fetchone()[0]

        # Get program_course_id from ProgramCourses table based on program_year_id and course_code
        query = "SELECT program_course_id FROM ProgramCourses WHERE program_year_id = %s AND course_code = %s;"
        connection.execute(query, (program_year_id, course_code))
        program_course_id = connection.fetchone()[0]

        # Get lecturer_course_id from LecturerCourses table based on lecturer_name and course_code
        query = "SELECT lecturer_course_id FROM LecturerCourses WHERE course_id = %s AND lecturer_id = (SELECT lecturer_id FROM Lecturers WHERE lecturer_name = %s);"
        connection.execute(query, (program_course_id, lecturer_name))
        lecturer_course_id = connection.fetchone()[0]

        # Get room_id from Rooms table based on room_name
        query = "SELECT room_id FROM Rooms WHERE room_name = %s;"
        connection.execute(query, (room_name,))
        room_id = connection.fetchone()[0]

        # Insert the timetable entry into the Timetables table
        query = "INSERT INTO Timetables (program_year_id, program_course_id, lecturer_course_id, room_id, start_time, end_time, day_id) VALUES (%s, %s, %s, %s, %s, %s, %s);"
        connection.execute(query, (program_year_id, program_course_id, lecturer_course_id, room_id, start_time, end_time, day_id))

if __name__ == "__main__":
    insert_timetables()

# Remember to commit the changes after executing the script
connection.commit()
