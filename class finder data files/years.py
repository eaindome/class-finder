import pandas as pd

# Read the Excel file
excel_file = 'E:\Programming\Projects\Class Finder\class finder data files\years.xlsx'
df = pd.read_excel(excel_file)

# Convert Excel data to SQL script
sql_statements = []
for index, row in df.iterrows():
    year_name = row['year_name']
    sql = f"INSERT INTO Years (year_name) VALUES ('{year_name}');"
    sql_statements.append(sql)

# Save SQL script to a file
sql_script_file = 'E:\Programming\Projects\Class Finder\class finder data files\years_script.sql'
with open(sql_script_file, 'w') as file:
    file.write('\n'.join(sql_statements))
