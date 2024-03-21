var db = require("../../../util/database.js");
const pdfkit = require("pdfkit");

$(document).ready(function () {
  $(document).on("change", 'input[type="checkbox"]', function (e) {
    if (document.getElementById("checkbox1").checked) {
      document.getElementById("report_party").disabled = false;
    } else {
      document.getElementById("report_party").disabled = true;
    }
  });
});

function show_party() {
  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#report_party option").remove();
    $("#report_party").append(
      $("<option>").text("All Parties").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#report_party").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_city() {
  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#report_city option").remove();
    $("#report_city").append(
      $("<option>").text("All Cities").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#report_city").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_item() {
  var sql = "SELECT item_id AS id, item_name as name FROM item_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#report_item option").remove();
    $("#report_item").append($("<option>").text("All Items").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#report_item").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}
