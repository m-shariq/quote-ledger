var db = require("../../../util/database.js");
document.getElementById("username").value = localStorage.getItem("username");
document.getElementById("incorrect").style.display = "none";

document.getElementById("password").focus();

var wage = document.getElementById("password");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    //checks whether the pressed key is "Enter"
    basic();
  }
});

function basic() {
  var sql = "SELECT * from user_group where Username=? and Password=?";
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  db.connection.all(sql, [username, password], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      localStorage.setItem("username", username);
      login("login");
    } else {
      document.getElementById("incorrect").style.display = "block";
    }
  });
}
