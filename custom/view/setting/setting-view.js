var db = require("../../../util/database.js");
document.getElementById("username").value = localStorage.getItem("username");
document.getElementById("new-username").value =
  localStorage.getItem("username");

document.getElementById("new-username").focus();

var wage = document.getElementById("new-username");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("old-pass").focus();
  }
});

var wage = document.getElementById("old-pass");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("pass").focus();
  }
});

var wage = document.getElementById("pass");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("re-pass").focus();
  }
});

var wage = document.getElementById("re-pass");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    //checks whether the pressed key is "Enter"
    update();
  }
});

function update_pass(username, password, new_username, oldPassword) {
  var sql = "SELECT * from user_group where Username=? and Password=?";
  db.connection.all(sql, [username, oldPassword], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      var stmt = db.connection.prepare(
        "UPDATE user_group set Password=?, Username=? where Username=?"
      );
      stmt.run(password, new_username, username);
      stmt.finalize();
      localStorage.setItem("username", new_username);
      document.getElementById("username").value =
        localStorage.getItem("username");
      alert("Password Updated");
      dashboard("update_user");
      return;
    } else {
      alert("Incorrect Old Password");
      return;
    }
  });
  return;
}
basic();
