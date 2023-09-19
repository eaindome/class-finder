import pandas as pd

# Read the Excel file
excel_file = "C:\\Users\\EKOW\\Documents\\Class Finder Project\\names2.xlsx"
df = pd.read_excel(excel_file)

# Convert Excel data to SQL script
sql_statements = []
for index, row in df.iterrows():
    lecturer_name = row['lecturer_name']
    lecturer_email = row['lecturer_email']
    sql = f"INSERT INTO Lecturers (lecturer_name, lecturer_email) VALUES ('{lecturer_name}', '{lecturer_email}');"
    sql_statements.append(sql)

# Save SQL script to a file
sql_script_file = 'E:\Programming\Projects\Class Finder\class finder data files\lecturers.sql'
with open(sql_script_file, 'w') as file:
    file.write('\n'.join(sql_statements))
