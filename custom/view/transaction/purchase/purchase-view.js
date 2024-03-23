var db = require("../../../../util/database.js");

$("#post11").attr("hidden", "");

// $(document).ready(function () {
//   $("select").chosen({ no_results_text: "Oops, nothing found!" });
// });


var wage = document.getElementById("cursor-pointer");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    //checks whether the pressed key is "Enter"
    document.getElementById("purchase_item").focus();
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
    document.getElementById("purchase_item").focus();
  }
});

var wage = document.getElementById("purchase_item");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_quantity").focus();
  }
});

var wage = document.getElementById("purchase_quantity");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_price").focus();
    document.getElementById("purchase_price").select();
  }
});

var wage = document.getElementById("purchase_price");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    document.getElementById("purchase_discount").focus();
  }
});

var wage = document.getElementById("purchase_discount");
wage.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    add_button();
  }
});

// =========================================================================================== //

var dob1 = document.getElementById("purchase_expiry");
dob1.addEventListener("keydown", getAge);
function getAge() {
  dob1.value = dob1.value
    .replace(/^(\d\d)(\d)$/g, "$1-$2")
    .replace(/[^\d\-]/g, "");
}

var dob = document.getElementById("expiry_purchase");
dob.addEventListener("keydown", getAge1);
function getAge1() {
  dob.value = dob.value
    .replace(/^(\d\d)(\d)$/g, "$1-$2")
    .replace(/[^\d\-]/g, "");
}

// =========================================================================================== //

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function isFloatKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  // Allow numbers (0-9), decimal point, and backspace
  return (
    (charCode >= 48 && charCode <= 57) || // Numbers
    charCode === 46 || // Decimal point
    charCode === 8 // Backspace
  );
}

// =========================================================================================== //
add_purchase = function (party, date, trans, bilty, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "INSERT INTO purchase (party_id,date,trans_id,bilty,status) VALUES (?,?,?,?,?)"
    );
    stmt.run(party, date, trans, bilty, 0);
    stmt.finalize();
    callback("true");
  });
};

add_item = function (
  item,
  quantity,
  price,
  discount,
  batch,
  expiry,
  purchase_id,
  total,
  callback
) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "INSERT INTO purchase_item (item_id,quantity,available_quantity,price,discount,batch,expiry,purchase_id,total) VALUES (?,?,?,?,?,?,?,?,?)"
    );
    stmt.run(
      item,
      quantity,
      quantity,
      price,
      discount,
      batch,
      expiry,
      purchase_id,
      total
    );
    stmt.finalize();
    callback("true");
  });
};

available_quantity = function (item_id, callback) {
  db.connection.serialize(function () {
    var sql =
      "SELECT item_name, sum(available_quantity) as sum FROM purchase_item,item_group where purchase_item.item_id=item_group.item_id and item_group.item_id = ?";
    db.connection.all(sql, [item_id], (err, rows) => {
      if (err) {
        throw err;
      }

      if (rows.length > 0) {
        var sum = rows[0].sum;
        var name = rows[0].item_name;
        document.getElementById("alert_available").innerHTML =
          name + " is: " + sum;
      }
      callback("true");
    });
  });
};

add_purchase_item = function (
  item,
  quantity,
  price,
  discount,
  batch,
  expiry,
  purchase_id,
  callback
) {
  var price1 = parseFloat(price);
  var quantity1 = parseFloat(quantity);
  var discount1 = parseFloat(discount);
  discount1 = discount1 / 100;

  var total = price1 * quantity1;
  total = total - total * discount1;
  total = total.toFixed(2);
  add_item(
    item,
    quantity,
    price,
    discount,
    batch,
    expiry,
    purchase_id,
    total,
    function (items) {
      available_quantity(item, function (avl_qty) {
        callback("true");
      });
    }
  );
};

function valid_purchase(
  party,
  date,
  trans,
  bilty,
  item,
  quantity,
  price,
  discount,
  batch,
  expiry,
  purchase_id
) {
  var sql = "SELECT * FROM purchase where purchase_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      add_purchase_item(
        item,
        quantity,
        price,
        discount,
        batch,
        expiry,
        purchase_id,
        function (add_p_item) {
          $("#purchase_invoice").attr("max", purchase_id);
          console.log(add_p_item);
          show_purchase_added();
          show_edit_purchase();
        }
      );
    } else {
      add_purchase(party, date, trans, bilty, function (add_p) {
        add_purchase_item(
          item,
          quantity,
          price,
          discount,
          batch,
          expiry,
          purchase_id,
          function (add_p_item) {
            $("#purchase_invoice").attr("max", purchase_id);
            show_purchase_added();
            show_edit_purchase();
          }
        );
      });
    }
  });
}

// ===================================================================================================================

update_purchase = function (date, bilty, trans, purchase_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE purchase SET date = ?, bilty=?, trans_id=? WHERE purchase_id = ?"
    );
    stmt.run(date, bilty, trans, purchase_id);
    stmt.finalize();
    callback("true");
  });
};

update_purchase_item = function (
  final1,
  quantity,
  price,
  discount,
  batch,
  expiry,
  total,
  purchase_item_id,
  callback
) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE purchase_item SET available_quantity=?, quantity=?, price = ?, discount=?, batch=?,expiry=?,total=? WHERE purchase_item_id = ?"
    );
    stmt.run(
      final1,
      quantity,
      price,
      discount,
      batch,
      expiry,
      total,
      purchase_item_id
    );

    stmt.finalize();
    callback("true");
  });
};

edit_purchase = function (
  party,
  date,
  trans,
  bilty,
  purchase_item_id,
  quantity,
  price,
  discount,
  batch,
  expiry,
  purchase_id,
  callback
) {
  var price1 = parseFloat(price);
  var quantity1 = parseFloat(quantity);
  var discount1 = parseFloat(discount);
  discount1 = discount1 / 100;

  var total = price1 * quantity1;
  total = total - total * discount1;

  var prev = rows[0].quantity;
  var avl = rows[0].available_quantity;
  var final = prev - avl;
  var final1 = quantity1 - final;

  update_purchase(date, bilty, trans, purchase_id, function (u_p) {
    update_purchase_item(
      final1,
      quantity,
      price,
      discount,
      batch,
      expiry,
      total,
      purchase_item_id,
      function (u_p_i) {
        callback("true");
      }
    );
  });
};

function edit_purchase_out(
  party,
  date,
  trans,
  bilty,
  purchase_item_id,
  quantity,
  price,
  discount,
  batch,
  expiry,
  purchase_id
) {
  var sql = "SELECT * FROM purchase_item where purchase_item_id=?";
  db.connection.all(sql, [purchase_item_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      edit_purchase(
        party,
        date,
        trans,
        bilty,
        purchase_item_id,
        quantity,
        price,
        discount,
        batch,
        expiry,
        purchase_id,
        function (edit_purchase) {
          show_purchase_added();
          show_edit_purchase();
        }
      );
    }
  });
}

// ============================================================================================ //

function post_purchase(purchase_id, amount1, party_id) {
  return new Promise((resolve, reject) => {
    var stmt = db.connection.prepare(
      "UPDATE purchase set status=? where purchase_id=?"
    );
    stmt.run(1, purchase_id);
    stmt.finalize();

    var stmt = db.connection.prepare(
      `INSERT INTO invoice (receivable, purchase_id) 
      SELECT ?,?
      WHERE NOT EXISTS (Select purchase_id From invoice WHERE purchase_id =?) LIMIT 1;`
    );
    stmt.run(parseFloat(amount1), purchase_id, purchase_id);
    stmt.finalize();

    resolve();
  });
}

function post1_purchase(purchase_id, amount1, party_id) {
  return new Promise((resolve, reject) => {
    var stmt = db.connection.prepare(
      "UPDATE purchase set status=? where purchase_id=?"
    );
    stmt.run(0, purchase_id);
    stmt.finalize();

    var stmt = db.connection.prepare("DELETE from invoice where purchase_id=?");
    stmt.run(purchase_id);
    stmt.finalize();

    resolve();
  });
}

function post_purchase_out(purchase_id, total, party) {
  var sql = "SELECT * FROM purchase where purchase_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (rows.length > 0) {
      post_purchase(purchase_id, total, party).then(show_purchase_added());
    }
  });
}

// =========================================================================================== //
function show_purchase() {
  $("select#purchase_item").prop("selectedIndex", 0);
  document.getElementById("purchase_quantity").value = "";
  document.getElementById("purchase_price").value = "";
  document.getElementById("purchase_discount").value = "";

  $("#my-table").DataTable().clear().destroy();
  $("#my-table").removeClass().addClass("col-md-6");
  rows = [
    {
      item_id: "",
      item_name: "",
      quantity: "",
      price: "",
      discount: "",
      total: "",
    },
  ];
  rowss = [
    {
      item_id: "",
      item_name: "",
      quantity: "",
      price: "",
      discount: "",
      total: "",
    },
  ];

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
    columnDefs: [
      { width: "6%", targets: 0 },
      { width: "40%", targets: 1 },
      { width: "6%", targets: 2 },
      { width: "9%", targets: 3 },
      { width: "6%", targets: 4 },
      { width: "11%", targets: 5 }
    ],

    data: rowss,
    columns: [
      { data: "item_id" },
      { data: "item_name" },
      { data: "quantity" },
      { data: "price" },
      { data: "discount" },
      { data: "total" }
    ],
    bFilter: false,
    bJQueryUI: true,
    sPaginationType: "full_numbers",
    bPaginate: false,
    bInfo: false,
    footerCallback: function (tfoot, data, start, end, display) {
      var api = this.api();

      $(api.column(5).footer()).html(
        api
          .column(5)
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

  var sql = "Select purchase_id from purchase where status = 0";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    document.getElementById("unposted").innerHTML = "";
    for (let i = 0; i < rows.length; i++) {
      $("#unposted").append(rows[i].purchase_id + ", ");
    }
  });

  var sql = "SELECT purchase_id AS id FROM purchase";
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

  var sql = "SELECT trans_id AS id, trans_name as name FROM trans_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#purchase_trans option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#purchase_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#purchase_party option").remove();
    $("#purchase_party").append(
      $("<option>").text("Select The party").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#purchase_party").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT item_id AS id, item_name as name FROM item_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#purchase_item option").remove();
    $("#purchase_item").append(
      $("<option>").text("Select the item").attr("value", "")
    );
    for (let i = 0; i < rows.length; i++) {
      $("#purchase_item").append(
        $("<option>")
          .text(rows[i].id + " " + rows[i].name)
          .attr("value", rows[i].id)
      );
    }
  });

  document.getElementById("purchase_date").disabled = false;
  document.getElementById("purchase_bilty").disabled = false;
  document.getElementById("purchase_party").disabled = false;
  document.getElementById("purchase_trans").disabled = false;

  document.getElementById("purchase_date").valueAsDate = new Date();
  document.getElementById("purchase_bilty").value = "";

  document.getElementById("purchase_quantity").value = "";
  document.getElementById("purchase_price").value = "";
  document.getElementById("purchase_discount").value = "";

  document.getElementById("purchase_item").disabled = false;
  document.getElementById("purchase_quantity").disabled = false;
  document.getElementById("purchase_price").disabled = false;
  document.getElementById("purchase_discount").disabled = false;

  document.getElementById("item_purchase").disabled = false;
  document.getElementById("quantity_purchase").disabled = false;
  document.getElementById("price_purchase").disabled = false;
  document.getElementById("discount_purchase").disabled = false;

  document.getElementById("purchase_b_add").disabled = false;
  document.getElementById("purchase_b_edit").disabled = false;
  document.getElementById("purchase_b_post").innerHTML = "Post";
  $("#post11").attr("hidden", "");
  $("#post1").removeAttr("hidden");
}

// =========================================================================================== //
function show_purchase_added() {
  var purchase_id = document.getElementById("purchase_invoice").value;

  var sql = "Select purchase_id from purchase where status = 0";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    document.getElementById("unposted").innerHTML = "";
    for (let i = 0; i < rows.length; i++) {
      $("#unposted").append(rows[i].purchase_id + ", ");
    }
  });

  var sql = "SELECT * FROM purchase where purchase_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length > 0) {
      document.getElementById("purchase_date").value = rows[0].date;
      document.getElementById("purchase_bilty").value = rows[0].bilty;
      document.getElementById("purchase_party").value = rows[0].party_id;
      document.getElementById("purchase_trans").value = rows[0].trans_id;

      document.getElementById("purchase_date").disabled = true;
      document.getElementById("purchase_bilty").disabled = true;
      document.getElementById("purchase_party").disabled = true;
      document.getElementById("purchase_trans").disabled = true;

      if (rows[0].status == 1) {
        document.getElementById("purchase_item").disabled = true;
        document.getElementById("purchase_quantity").disabled = true;
        document.getElementById("purchase_price").disabled = true;
        document.getElementById("purchase_discount").disabled = true;
        document.getElementById("purchase_b_add").disabled = true;
        document.getElementById("purchase_b_edit").disabled = false;
        document.getElementById("purchase_b_post").disabled = true;
        document.getElementById("purchase_b_post").innerHTML = "Unpost";
        // $("#post1").attr("hidden", "");
        // $("#post11").removeAttr("hidden");

        // document.getElementById("item_purchase").disabled = true;
        document.getElementById("quantity_purchase").disabled = true;
        // document.getElementById("price_purchase").disabled = true;
        document.getElementById("discount_purchase").disabled = true;
      } else {
        document.getElementById("purchase_item").disabled = false;
        document.getElementById("purchase_quantity").disabled = false;
        document.getElementById("purchase_price").disabled = false;
        document.getElementById("purchase_discount").disabled = false;
        document.getElementById("purchase_b_add").disabled = false;
        document.getElementById("purchase_b_edit").disabled = false;
        document.getElementById("purchase_b_post").disabled = false;
        document.getElementById("purchase_b_post").innerHTML = "Post";
        // $("#post11").attr("hidden", "");
        // $("#post1").removeAttr("hidden");

        document.getElementById("item_purchase").disabled = false;
        document.getElementById("quantity_purchase").disabled = false;
        document.getElementById("price_purchase").disabled = false;
        document.getElementById("discount_purchase").disabled = false;
      }
    }
  });
  var sql =
    "SELECT item_group.item_id,item_name,quantity,discount,price,total,batch,expiry FROM purchase_item,item_group where purchase_id=? and purchase_item.item_id=item_group.item_id and purchase_item.quantity>0";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [
      {
        item_id: "",
        item_name: "",
        quantity: "",
        price: "",
        discount: "",
        total: "",
      },
    ];
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
      columnDefs: [
        { width: "6%", targets: 0 },
        { width: "40%", targets: 1 },
        { width: "6%", targets: 2 },
        { width: "9%", targets: 3 },
        { width: "6%", targets: 4 },
        { width: "11%", targets: 5 },
      ],

      data: rows,
      columns: [
        { data: "item_id" },
        { data: "item_name" },
        { data: "quantity" },
        { data: "price" },
        { data: "discount" },
        { data: "total" },
      ],
      bFilter: false,
      bJQueryUI: true,
      sPaginationType: "full_numbers",
      bPaginate: false,
      bInfo: false,
      footerCallback: function (tfoot, data, start, end, display) {
        var api = this.api();

        $(api.column(5).footer()).html(
          api
            .column(5)
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
  var sql = "SELECT purchase_id AS id FROM purchase";
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

  var sql = "SELECT trans_id AS id, trans_name as name FROM trans_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length > 0) {
      $("#trans_purchase option").remove();
      for (let i = 0; i < rows.length; i++) {
        $("#trans_purchase").append(
          $("<option>").text(rows[i].name).attr("value", rows[i].id)
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
}

// =========================================================================================== //

function show_edit_detail_purchase(purchase_id) {
  var sql = "SELECT * FROM purchase where purchase_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      document.getElementById("party_purchase").value = rows[0].party_id;
      document.getElementById("date_purchase").value = rows[0].date;
      document.getElementById("trans_purchase").value = rows[0].trans_id;
      document.getElementById("bilty_purchase").value = rows[0].bilty;
    }
  });

  var sql =
    "SELECT purchase_item_id as id, item_name as name FROM purchase_item, item_group, purchase where purchase_item.item_id=item_group.item_id and purchase_item.purchase_id = purchase.purchase_id and purchase_item.purchase_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length > 0) {
      $("#item_purchase option").remove();
      for (let i = 0; i < rows.length; i++) {
        $("#item_purchase").append(
          $("<option>").text(rows[i].name).attr("value", rows[i].id)
        );
      }
      var sql = "SELECT * FROM purchase_item where purchase_item_id=?";
      db.connection.all(sql, [rows[0].id], (err, row) => {
        if (err) {
          throw err;
        }
        if (row.length > 0) {
          document.getElementById("quantity_purchase").value = row[0].quantity;
          document.getElementById("price_purchase").value = row[0].price;
          document.getElementById("discount_purchase").value = row[0].discount;
        }
      });
    }
  });
}

// =========================================================================================== //

function show_edit_item_detail(id) {
  var sql = "SELECT * FROM purchase_item where purchase_item_id=?";
  db.connection.all(sql, [id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row.length > 0) {
      document.getElementById("quantity_purchase").value = row[0].quantity;
      document.getElementById("price_purchase").value = row[0].price;
      document.getElementById("discount_purchase").value = row[0].discount;
    }
  });
}

// =========================================================================================== //
