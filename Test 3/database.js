const Pool =require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "class_finder_test4",
    password: "Eai@2460",
    port: 5432,
});

module.exports = pool;