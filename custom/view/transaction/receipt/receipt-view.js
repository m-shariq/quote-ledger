var db = require("../../../../util/database.js");

$("#post11").attr("hidden", "");

var wage = document.getElementById("purchase_amount");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    //checks whether the pressed key is "Enter"
    add_button();
  }
});

document.getElementById("purchase_party").focus();

var wage = document.getElementById("purchase_party");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_date").focus();
  }
});

var wage = document.getElementById("purchase_date");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_bank").focus();
  }
});

var wage = document.getElementById("purchase_bank");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_comment").focus();
  }
});

var wage = document.getElementById("purchase_comment");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_city").focus();
  }
});
var wage = document.getElementById("purchase_city");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_amount").focus();
  }
});

// =========================================================================================== //

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

// =========================================================================================== //
add_purchase = function (party, date, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "INSERT INTO receipt (party_id,date,status) VALUES (?,?,?)"
    );
    stmt.run(party, date, 0);
    stmt.finalize();
    callback("true");
  });
};

add_purchase_item = function (bank, comment, amount, purchase_id,city, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "INSERT INTO receipt_item (bank,comment,amount,receipt_id,city_id) VALUES (?,?,?,?,?)"
    );
    stmt.run(bank, comment, amount, purchase_id,city);
    stmt.finalize();
    callback("true");
  });
};

update_payment = function (date, purchase_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE receipt SET date = ? WHERE receipt_id = ?"
    );
    stmt.run(date, purchase_id);
    stmt.finalize();
    callback("true");
  });
};

update_payment_item = function (bank, comment, amount, payment,city, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE receipt_item SET bank=?, comment = ?, amount=?, city_id = ? WHERE receipt_item_id = ?"
    );
    stmt.run(bank, comment, amount, city, payment);
    stmt.finalize();
    callback("true");
  });
};

function edit_purchase(
  party,
  date,
  bank,
  comment,
  amount,
  payment,
  purchase_id, city
) {
  update_payment(date, purchase_id, function (up_py) {
    update_payment_item(bank, comment, amount, payment,city, function (up_py_i) {
      show_purchase_added();
      show_edit_purchase();
    });
  });
}

function valid_purchase(party, date, bank, comment, amount, purchase_id,city) {
  var sql = "SELECT * FROM receipt where receipt_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      add_purchase_item(bank, comment, amount, purchase_id,city, function (add_py) {
        $("#purchase_invoice").attr("max", purchase_id);
        show_purchase_added();
        show_edit_purchase();
        $("select#purchase_bank").prop("selectedIndex", 0);
        $("select#purchase_city").prop("selectedIndex", 0);
        document.getElementById("purchase_comment").value = "";
        document.getElementById("purchase_amount").value = "";
      });
    } else {
      add_purchase(party, date, function (value) {
        add_purchase_item(
          bank,
          comment,
          amount,
          purchase_id,city,
          function (value1) {
            $("#purchase_invoice").attr("max", purchase_id);
            show_purchase_added();
            show_edit_purchase();
            $("select#purchase_bank").prop("selectedIndex", 0);
            $("select#purchase_city").prop("selectedIndex", 0);
            document.getElementById("purchase_comment").value = "";
            document.getElementById("purchase_amount").value = "";
          }
        );
      });
    }
  });
}

// ===================================================================================================== //

update_post_payment = function (purchase_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE receipt set status=? where receipt_id=?"
    );
    stmt.run(1, purchase_id);
    stmt.finalize();
    callback("true");
  });
};

insert_post_payment = function (amount1, purchase_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      `INSERT INTO invoice_pay (received, receipt_id) 
      SELECT ?,?
      WHERE NOT EXISTS (Select receipt_id From invoice_pay WHERE receipt_id =?) LIMIT 1;`
    );
    stmt.run(parseFloat(amount1), purchase_id, purchase_id);
    stmt.finalize();
    callback("true");
  });
};

function post_purchase(purchase_id, amount1, party_id) {
  var sql = "SELECT * FROM receipt where receipt_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      update_post_payment(purchase_id, function (py_it) {
        insert_post_payment(amount1, purchase_id, function (py_its) {
          show_purchase_added();
          show_edit_purchase();
        });
      });
    } else {
      return;
    }
  });
}

update_unpost_payment = function (purchase_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE receipt set status=? where receipt_id=?"
    );
    stmt.run(0, purchase_id);
    stmt.finalize();
    callback("true");
  });
};

delete_post_payment = function (purchase_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "DELETE from invoice_pay where receipt_id=?"
    );
    stmt.run(purchase_id);
    stmt.finalize();
    callback("true");
  });
};
function post1_purchase(purchase_id) {
  update_unpost_payment(purchase_id, function (py_it) {
    delete_post_payment(purchase_id, function (py_its) {
      show_purchase_added();
      show_edit_purchase();
    });
  });
}

// =========================================================================================== //

function show_purchase() {
  $("select#purchase_bank").prop("selectedIndex", 0);
  $("select#purchase_city").prop("selectedIndex", 0);
  document.getElementById("purchase_comment").value = "";
  document.getElementById("purchase_amount").value = "";

  $("#my-table").DataTable().clear().destroy();
  $("#my-table").removeClass().addClass("col-md-6");
  rows = [{ bank_name: "", comment: "",city_name:"", amount: "" }];
  rowss = [{ bank_name: "", comment: "",city_name:"", amount: "" }];

  for (var i = Object.keys(rows).length; i < 12; i++) {
    rowss = rowss.concat(rows);
  }

  $("#my-table").DataTable({
    bPaginate: false,
    bLengthChange: false,
    bFilter: false,
    bInfo: false,
    bAutoWidth: false,
    ordering: false,

    data: rowss,
    columns: [{ data: "bank_name" }, { data: "comment" },{ data: "city_name" }, { data: "amount" }],
    bFilter: false,
    bJQueryUI: true,
    sPaginationType: "full_numbers",
    bPaginate: false,
    bInfo: false,

    footerCallback: function (tfoot, data, start, end, display) {
      var api = this.api();

      $(api.column(3).footer()).html(
        api
          .column(3)
          .data()
          .reduce(function (a, b) {
            if (b != "") {
              return parseFloat(a) + parseFloat(b);
            } else {
              return parseFloat(a);
            }
          }, 0)
      );
    },
  });

  var sql = "SELECT receipt_id AS id FROM receipt";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    let i = 0;
    if (rows.length == 0) {
      document.getElementById("purchase_invoice").value = "1";
      $("#purchase_invoice").attr("max", "1");
    } else {
      for (i; i < rows.length; i++) {}
      document.getElementById("purchase_invoice").value = rows[i - 1].id + 1;
      $("#purchase_invoice").attr("max", rows[i - 1].id);
    }
  });

  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#purchase_party option").remove();
    $("#purchase_party").append(
      $("<option>").text("Select the party").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#purchase_party").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT bank_id AS id, bank_name as name FROM bank_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#purchase_bank option").remove();
    $("#purchase_bank").append(
      $("<option>").text("Selelct the bank").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#purchase_bank").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#purchase_city option").remove();
    $("#purchase_city").append(
        $("<option>").text("Selelct the city").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#purchase_city").append(
          $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "Select receipt_id from receipt where status = 0";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    document.getElementById("unposted").innerHTML = "";
    for (let i = 0; i < rows.length; i++) {
      $("#unposted").append(
          rows[i].receipt_id + ", "
      );
    }
  });

  document.getElementById("purchase_date").disabled = false;
  document.getElementById("purchase_party").disabled = false;

  document.getElementById("purchase_date").valueAsDate = new Date();

  document.getElementById("purchase_bank").value = "";
  document.getElementById("purchase_city").value = "";
  document.getElementById("purchase_comment").value = "";
  document.getElementById("purchase_amount").value = "";

  document.getElementById("purchase_bank").disabled = false;
  document.getElementById("purchase_city").disabled = false;
  document.getElementById("purchase_comment").disabled = false;
  document.getElementById("purchase_amount").disabled = false;

  document.getElementById("purchase_b_add").disabled = false;
  document.getElementById("purchase_b_edit").disabled = false;
  $("#post11").attr("hidden", "");
  $("#post1").removeAttr("hidden");
}

// =========================================================================================== //
function show_purchase_added() {
  $("select#purchase_bank").prop("selectedIndex", 0);
  $("select#purchase_city").prop("selectedIndex", 0);
  document.getElementById("purchase_comment").value = "";
  document.getElementById("purchase_amount").value = "";

  var purchase_id = document.getElementById("purchase_invoice").value;

  var sql = "SELECT * FROM receipt where receipt_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      document.getElementById("purchase_date").value = rows[0].date;
      document.getElementById("purchase_party").value = rows[0].party_id;

      document.getElementById("purchase_date").disabled = true;
      document.getElementById("purchase_party").disabled = true;

      if (rows[0].status == 1) {
        document.getElementById("purchase_bank").disabled = true;
        document.getElementById("purchase_city").disabled = true;
        document.getElementById("purchase_comment").disabled = true;
        document.getElementById("purchase_amount").disabled = true;
        document.getElementById("purchase_b_add").disabled = true;
        document.getElementById("purchase_b_edit").disabled = true;
        $("#post1").attr("hidden", "");
        $("#post11").removeAttr("hidden");
      } else {
        document.getElementById("purchase_bank").disabled = false;
        document.getElementById("purchase_city").disabled = false;
        document.getElementById("purchase_comment").disabled = false;
        document.getElementById("purchase_amount").disabled = false;
        document.getElementById("purchase_b_add").disabled = false;
        document.getElementById("purchase_b_edit").disabled = false;
        $("#post11").attr("hidden", "");
        $("#post1").removeAttr("hidden");
      }
    }
  });

  var sql = "Select receipt_id from receipt where status = 0";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    document.getElementById("unposted").innerHTML = "";
    for (let i = 0; i < rows.length; i++) {
      $("#unposted").append(
          rows[i].receipt_id + ", "
      );
    }
  });

  var sql =
    "SELECT b.bank_name,r.comment,r.amount,c.city_name FROM bank_group b LEFT JOIN receipt_item r on b.bank_id = r.bank LEFT JOIN city_group c on c.city_id = r.city_id where receipt_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");

    rowss = [{ bank_name: "", comment: "",city_name: "", amount: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 12; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      bPaginate: false,
      bLengthChange: false,
      bFilter: false,
      bInfo: false,
      bAutoWidth: false,
      ordering: false,

      data: rows,
      columns: [{ data: "bank_name" }, { data: "comment" }, { data: "city_name" }, { data: "amount" }],
      bFilter: false,
      bJQueryUI: true,
      sPaginationType: "full_numbers",
      bPaginate: false,
      bInfo: false,
      footerCallback: function (tfoot, data, start, end, display) {
        var api = this.api();

        $(api.column(3).footer()).html(
          api
            .column(3)
            .data()
            .reduce(function (a, b) {
              if (b != "") {
                return parseFloat(a) + parseFloat(b);
              } else {
                return parseFloat(a);
              }
            }, 0)
        );
      },
    });
  });
}

// =========================================================================================== //

function show_edit_purchase() {
  console.log("ye chalra");
  var sql = "SELECT receipt_id AS id FROM receipt";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#invoice_purchase option").remove();

    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        $("#invoice_purchase").append(
          $("<option>").text(rows[i].id).attr("value", rows[i].id)
        );
      }
    }
  });

  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length > 0) {
      $("#party_purchase option").remove();
      for (let i = 0; i < rows.length; i++) {
        $("#party_purchase").append(
          $("<option>").text(rows[i].name).attr("value", rows[i].id)
        );
      }
    }
  });

  var sql = "SELECT bank_id AS id, bank_name as name FROM bank_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#bank_purchase option").remove();
    $("#bank_purchase").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#bank_purchase").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#city_purchase option").remove();
    $("#city_purchase").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#city_purchase").append(
          $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

// =========================================================================================== //

function show_edit_detail_purchase(purchase_id) {
  console.log(purchase_id);

  var sql = "SELECT * FROM receipt where receipt_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      console.log(rows);
      document.getElementById("party_purchase").value = rows[0].party_id;
      document.getElementById("date_purchase").value = rows[0].date;
    }
  });

  var sql =
    "SELECT receipt_item_id as id, amount as name FROM receipt_item, receipt where receipt_item.receipt_id = receipt.receipt_id and receipt_item.receipt_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }

    console.log(rows);
    if (rows.length > 0) {
      $("#payment_purchase option").remove();
      for (let i = 0; i < rows.length; i++) {
        $("#payment_purchase").append(
          $("<option>").text(rows[i].name).attr("value", rows[i].id)
        );
      }
      var sql = "SELECT * FROM receipt_item where receipt_item_id=?";
      db.connection.all(sql, [rows[0].id], (err, row) => {
        if (err) {
          throw err;
        }
        if (row.length > 0) {
          document.getElementById("bank_purchase").value = row[0].bank;
          document.getElementById("city_purchase").value = row[0].city_id;
          document.getElementById("comment_purchase").value = row[0].comment;
          document.getElementById("amount_purchase").value = row[0].amount;
        }
      });
    }
  });
}

// =========================================================================================== //

function show_edit_item_detail(id) {
  var sql = "SELECT * FROM receipt_item where receipt_item_id=?";
  db.connection.all(sql, [id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row.length > 0) {
      document.getElementById("bank_purchase").value = row[0].bank;
      document.getElementById("city_purchase").value = row[0].city_id;
      document.getElementById("comment_purchase").value = row[0].comment;
      document.getElementById("amount_purchase").value = row[0].amount;
    }
  });
}

// =========================================================================================== //
