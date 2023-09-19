import pandas as pd
import psycopg2
import csv

# Replace the connection parameters with your actual database details
connection = psycopg2.connect(
    host="localhost",
    database="ClassFinder",
    user="postgres",
    password="Eai@2460"
)


def insert_courses():
    courses_data = pd.read_excel('course_file.xlsx')
    for index, row in courses_data.iterrows():
        course_name = row['course_name']
        course_code = row['course_code']
        query = "INSERT INTO Courses (course_name, course_code) VALUES (%s, %s) RETURNING course_id;"
        connection.execute(query, (course_name, course_code))
        course_id = connection.fetchone()[0]
        yield course_id

def insert_lecturers():
    lecturers_data = pd.read_excel('lecturer_file.xlsx')
    for index, row in lecturers_data.iterrows():
        lecturer_name = row['lecturer_name']
        lecturer_email = lecturer_name.replace(" ", "").lower() + "@example.com"  # Generate a dummy email
        query = "INSERT INTO Lecturers (lecturer_name, lecturer_email) VALUES (%s, %s) RETURNING lecturer_id;"
        connection.execute(query, (lecturer_name, lecturer_email))
        lecturer_id = connection.fetchone()[0]
        yield lecturer_id

def insert_lecturer_courses():
    with open('courses_with_lecturers_file.txt', 'r') as file:
        courses_with_lecturers = csv.reader(file)
        next(courses_with_lecturers)  # Skip header row
        for course in courses_with_lecturers:
            course_code = course[0].strip()
            lecturer_name = course[2].strip()
            query = "SELECT course_id FROM Courses WHERE course_code = %s;"
            connection.execute(query, (course_code,))
            course_id = connection.fetchone()[0]

            query = "SELECT lecturer_id FROM Lecturers WHERE lecturer_name = %s;"
            connection.execute(query, (lecturer_name,))
            lecturer_id = connection.fetchone()[0]

            query = "INSERT INTO LecturerCourses (lecturer_id, course_id) VALUES (%s, %s);"
            connection.execute(query, (lecturer_id, course_id))

if __name__ == "__main__":
    # Call the functions to insert data into the database
    for course_id in insert_courses():
        pass
    for lecturer_id in insert_lecturers():
        pass
    insert_lecturer_courses()

# Remember to commit the changes after executing the script
connection.commit()
