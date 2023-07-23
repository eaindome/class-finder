const Pool =require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "classfinderdatabase",
    password: "Eai@2460",
    port: 5432,
});

module.exports = pool;