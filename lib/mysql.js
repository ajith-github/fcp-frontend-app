var mysql = require("mysql");// First you need to create a connection to the db
// let conn_options = {
//     host: process.env.MYSQL_HOST,
//     port: process.env.MYSQL_PORT,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE
// }
let conn_options = {
    host: process.env.ENDPOINT_ADDRESS,
    port: process.env.PORT,
    user: process.env.MASTER_USERNAME,
    password: process.env.MASTER_PASSWORD,
    database: process.env.DB_NAME
}
console.log('mysql connection options: ', conn_options)
let connect = async function() {
    var conn = mysql.createConnection(conn_options);
    con.connect(function (err) {
        if (err) {
            console.log('Error connecting to Db');
            console.log(err.stack)
            return;
        }
        console.log('Connection established: ', conn.threadId);
        return conn
    });

}
function close(){
    con.end(function (err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        if (err) console.log('err: ', err);
        else console.log('Terminated done: ');
    });
}

module.exports = {
    connect: connect,
    close: close
}