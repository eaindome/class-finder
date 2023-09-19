const pool = require('../database');
const queries = require('./queries');


const userLogin = (req, res) => {
    const { email, password } = req.body;

    pool.query(queries.userLogin, [email, password], (error, results) => {
        if (error) {
            console.error('Error execution query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (results.rowCount === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            const user = results.rows[0];
            // store the user's ID in the session
            req.session.userid = user.userid;
            res.status(200).json({ message: 'Login successful', user }); // This also prints out the user's profile
        }
    });
};

const userProfile = (req, res) => {
    // check if the user is authenticated (session or token validation)
    if (!req.session.userid) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    
    const id = req.session.userid;

    // Check if the ID is a valid number
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    pool.query(queries.userProfile, [id], (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
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










/*
// Get logged-in user's profile
const userProfile = (req, res) => {
    // assume user information is stored in the request object after successful login
    const id = parseInt(req.params.id);
    pool.query(queries.userProfile, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};
*/

/*
const upcomingClass = (req, res) => {
    // assume user information is stored in the request object after successful login
    const user = req.user;

    pool.query(queries.upcomingClass, [user.UserID], (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error'})
        } else {
            const upcomingClass = results.rows;
            res.status(200).json(upcomingClass);
        }
    });
};
*/
/*
module.exports = {
    userLogin,
    userProfile,
    // upcomingClass,
};*/

