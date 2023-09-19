const pool = require('../../database');
const queries = require('./queries');


// Endpoint: User Login
const userLogin = (req, res) => {
    const { email, password } = req.body;

    pool.query(queries.userLogin, [email, password], (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ eroor: 'Internal Server Error' });
        } else if (results.rowCount === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            const user = results.rows[0];
            // store the user's ID in the session
            req.session.userid = user.user_id;
            res.status(200).json({ message: 'Login successful' });
        }
    });
};

//  Endpoint: User Profile
const userProfile = (req, res) => {
    // assume the user information is stored in the request object after successful login
    // check if the user is authenticated (sessoin validation)

    if (!req.session.userid) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const userId = req.session.userid;
    const user = req.session.user;

    pool.query(queries.userProfile, [userId], (error, results) => {
        if (error) {
            console.error('Error execution query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.rowCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            const userProfile = results.rows[0];
            res.status(200).json(userProfile);
        }
    });
};










module.exports = {
    userLogin,
    userProfile,
};