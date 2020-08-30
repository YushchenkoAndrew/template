var mysql = require("mysql");

function connect() {
  var con = mysql.createConnection({
    host: "192.168.0.105",
    user: "root",
    password: "6sCMqddng4agAcj",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SHOW DATABASES", function (err, result) {
      if (err) throw err;
      console.log("Result: ");
      for (let i in result) console.log(result[i]);
    });
  });
}

module.exports.connect = connect;
