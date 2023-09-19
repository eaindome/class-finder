import pandas as pd

# Read the Excel file
excel_file = 'E:\Programming\Projects\Class Finder\class finder data files\course_data.xlsx'
df = pd.read_excel(excel_file)

# Convert Excel data to SQL script
sql_statements = []
for index, row in df.iterrows():
    course_name = row['course_name']
    course_code = row['course_code']
    sql = f"INSERT INTO Courses (course_name, course_code) VALUES ('{course_name}', '{course_code}');"
    sql_statements.append(sql)

# Save SQL script to a file
sql_script_file = 'E:\Programming\Projects\Class Finder\class finder data files\course.sql'
with open(sql_script_file, 'w') as file:
    file.write('\n'.join(sql_statements))
