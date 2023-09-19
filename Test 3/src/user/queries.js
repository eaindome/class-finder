
const userLogin = 'SELECT * FROM Users WHERE "email" = $1';

const userProfile = `
                    SELECT u.username, u.email, u.role, u.notification_preference, p.program_name, y.year_name 
                    FROM Users u
                    INNER JOIN ProgramYears py ON u.program_year_id = py.program_year_id
                    INNER JOIN Programs p ON py.program_id = p.program_id
                    INNER JOIN Years y ON py.year_id = y.year_id
                    WHERE u.user_id = $1;
`;

const checkUserExists = 'SELECT * FROM Users WHERE email = $1';
const userSignUp =
  'INSERT INTO Users (username, password, email, role, program_year_id) VALUES ($1, $2, $3, $4, $5)';
const getProgramYear =
  'SELECT program_year_id FROM ProgramYears WHERE program_id = $1 AND year_id = $2';
const insertProgramYear =
  'INSERT INTO ProgramYears (program_id, year_id) VALUES ($1, $2) RETURNING program_year_id';
const getProgram = 'SELECT program_id FROM Programs WHERE program_name = $1';
const getYear = 'SELECT year_id FROM Years WHERE year_name = $1';

module.exports = {
    userLogin,
    userProfile,
    checkUserExists,
    userSignUp,
    getProgramYear,
    insertProgramYear,
    getProgram,
    getYear,
};