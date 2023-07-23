const pool = require('../../../database');
const queries = require('./queries');

// Endpoint: Get Class Status
const getClassStatus = (req, res) => {
    // Query the database to get the status of all classes
    pool.query(queries.getClassStatus, (error, results) => {
      if (error) {
        console.error('Error executing query: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const classStatusList = results.rows;
  
      // Return the class status list as a response
      res.status(200).json(classStatusList);
    });
};

module.exports = {
  getClassStatus,
};