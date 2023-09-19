import pandas as pd

# Read the Excel file
excel_file = 'E:\Programming\Projects\Class Finder\class finder data files\programs.xlsx'
df = pd.read_excel(excel_file)

# Convert Excel data to SQL script
sql_statements = []
for index, row in df.iterrows():
    program_name = row['program_name']
    sql = f"INSERT INTO Programs (program_name) VALUES ('{program_name}');"
    sql_statements.append(sql)

# Save SQL script to a file
sql_script_file = 'E:\Programming\Projects\Class Finder\class finder data files\programs_script.sql'
with open(sql_script_file, 'w') as file:
    file.write('\n'.join(sql_statements))
