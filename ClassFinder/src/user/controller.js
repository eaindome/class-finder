const bcrypt = require('bcrypt');
const pool = require('../../database');
const queries = require('./queries');


// Endpoint: User Login
const userLogin = async (req, res) => {
  const { reference_number, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await pool.query(queries.userLogin, [reference_number]);
    if (user.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored password
    const isPasswordValid = await comparePasswords(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Function: Compare hashed and unhashed passwords
    async function comparePasswords(password, hashedPassword) {
      // Check if the password is already hashed
      if (hashedPassword.startsWith('$2')) {
        // Compare the hashed password with the provided password
        return await bcrypt.compare(password, hashedPassword);
      } else {
        // Compare the unhashed password directly
        return password === hashedPassword;
      }
    };

    // Store the user's ID in the session
    req.session.userid = user.rows[0].user_id;
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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


// Endpoint: User Logout
const userLogout = (req, res) => {
    // check if the user is authenticated
    if (!req.session.userid) {
        return res.status(401).json({ error: 'User not logged in '});
    }

    // Destroy the session
    req.session.destroy((error) => {
      if (error) {
        console.error('Error destroying session: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Logout successful' });
      }
    });
};

// Endpoint: User Sign Up
const userSignUp = async (req, res) => {
    const { reference_number, firstname, surname, password, email, program, year } = req.body;
  
    try {
      // Check if the user already exists in the database
      const userExists = await pool.query(queries.checkUserExists, [email]);
      if (userExists.rowCount > 0) {
        return res.status(409).json({ error: 'User already exists' });
      }
  
      // Generate the hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the user into the Users table
      const programYearId = await getProgramYearId(program, year);
      
      
      const user = await pool.query(queries.userSignUp, [
        reference_number,
        `${firstname} ${surname}`,
        hashedPassword,
        email,
        'Student',
        programYearId,
      ]);
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error executing query: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
// Helper function to get program_year_id
const getProgramYearId = async (program, year) => {
    try {
      // Get the program_id
      const programData = await pool.query(queries.getProgram, [program]);
  
      if (programData.rowCount === 0) {
        throw new Error(`Program '${program}' not found`);
      }
      const programId = programData.rows[0].program_id;
  
      // Get the year_id
      const yearData = await pool.query(queries.getYear, [year]);
  
      if (yearData.rowCount === 0) {
        throw new Error(`Year '${year}' not found`);
      }
      const yearId = yearData.rows[0].year_id;
  
      // Check if a program_year entry already exists
      const programYearData = await pool.query(queries.getProgramYear, [programId, yearId]);
  
      if (programYearData.rowCount > 0) {
        return programYearData.rows[0].program_year_id;
      }
  
      // Insert a new entry into ProgramYears table
      const newProgramYearData = await pool.query(queries.insertProgramYear, [
        programId,
        yearId
      ]);
  
      return newProgramYearData.rows[0].program_year_id;
    } catch (error) {
      throw error;
    }
  };
  


module.exports = {
    userLogin,
    userProfile,
    userLogout,
    userSignUp,
};