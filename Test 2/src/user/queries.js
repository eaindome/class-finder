const userLogin = 'SELECT * FROM Users WHERE "email" = $1 AND "password" = $2';
const userProfile = `
                    SELECT u.username, u.email, u.role, u.notification_preference, p.program_name, y.year_name 
                    FROM Users u
                    INNER JOIN ProgramYears py ON u.program_year_id = py.program_year_id
                    INNER JOIN Programs p ON py.program_id = p.program_id
                    INNER JOIN Years y ON py.year_id = y.year_id
                    WHERE u.user_id = $1;
`;




module.exports = {
    userLogin,
    userProfile,
};