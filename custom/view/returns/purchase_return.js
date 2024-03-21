var db = require("../../../util/database.js");

setInterval(function () {
  $(".editable").keydown(function (e) {
    if (
      $.inArray(e.keyCode, [46, 9, 8, 27, 110]) !== -1 ||
      ((e.keyCode == 65 || e.keyCode == 86 || e.keyCode == 67) &&
        (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      return;
    }
    if (
      e.keyCode == 13 ||
      ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105))
    ) {
      e.preventDefault();
    }
  });

  $(".editable1").keydown(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  });
}, 1000);

// setInterval(
//   $(".editable").keydown(function (e) {
//     if (e.keyCode == 13) {
//       return_items();
//     }
//   }),
//   2000
// );

// =========================================================================================== //

// =========================================================================================== //

function isNumberKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

// =========================================================================================== //

// =========================================================================================== //
function show_purchase() {
  $("#my-table").DataTable().clear().destroy();
  $("#my-table").removeClass().addClass("col-md-6");
  rows = [
    {
      purchase_item_id: "",
      price: "",
      discount: "",
      item_id: "",
      item_name: "",
      available_quantity: "",
      return_quantity: "",
      defaults: "",
      batch: "",
      expiry: "",
    },
  ];
  rowss = [
    {
      purchase_item_id: "",
      price: "",
      discount: "",
      item_id: "",
      item_name: "",
      available_quantity: "",
      return_quantity: "",
      defaults: "",
      batch: "",
      expiry: "",
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
      { targets: 0, width: "0%" },
      { targets: 1, width: "0%" },
      { targets: 2, width: "0%" },
      { width: "6%", targets: 3 },
      { width: "33%", targets: 4 },
      { width: "6%", targets: 5 },
      { width: "6%", targets: 6 },
      { width: "10%", targets: 7 },
      { width: "20%", targets: 8 },
      { width: "7%", targets: 9 },
      { width: "7%", targets: 10 },
    ],

    data: rowss,
    columns: [
      { data: "purchase_item_id" },
      { data: "price" },
      { data: "discount" },
      { data: "item_id" },
      { data: "item_name" },
      { data: "available_quantity" },
      { data: "return_quantity" },
      { data: "defaults", className: "editable" },
      { data: "defaults", className: "editable1" },
      { data: "batch" },
      { data: "expiry" },
    ],
    bFilter: false,
    bJQueryUI: true,
    sPaginationType: "full_numbers",
    bPaginate: false,
    bInfo: false,
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
      document.getElementById("purchase_invoice").value = rows[i - 1].id;
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

  document.getElementById("purchase_date").disabled = false;
  document.getElementById("purchase_bilty").disabled = false;
  document.getElementById("purchase_party").disabled = false;
  document.getElementById("purchase_trans").disabled = false;

  document.getElementById("purchase_date").valueAsDate = new Date();
  document.getElementById("purchase_bilty").value = "";
}

// =========================================================================================== //
function show_purchase_added() {
  var purchase_id = document.getElementById("purchase_invoice").value;
  console.log(purchase_id);
  var sql =
    "SELECT * FROM purchase, party_group where purchase.party_id=party_group.party_id and purchase_id=?";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length > 0) {
      document.getElementById("purchase_date").value = rows[0].date;
      document.getElementById("purchase_bilty").value = rows[0].bilty;
      document.getElementById("purchase_party").value = rows[0].party_name;
      document.getElementById("purchase_trans").value = rows[0].trans_id;

      document.getElementById("purchase_date").disabled = true;
      document.getElementById("purchase_bilty").disabled = true;
      document.getElementById("purchase_party").disabled = true;
      document.getElementById("purchase_trans").disabled = true;
    }
  });
  var sql =
    "SELECT purchase_item_id, item_group.item_id,item_name,price,discount,available_quantity,defaults,batch,expiry,return_quantity FROM purchase_item,item_group where purchase_id=? and purchase_item.item_id=item_group.item_id";
  db.connection.all(sql, [purchase_id], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [
      {
        purchase_item_id: "",
        price: "",
        discount: "",
        item_id: "",
        item_name: "",
        available_quantity: "",
        return_quantity: "",
        defaults: "",
        batch: "",
        expiry: "",
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
        { targets: 0, width: "0%" },
        { targets: 1, width: "0%" },
        { targets: 2, width: "0%" },
        { width: "6%", targets: 3 },
        { width: "33%", targets: 4 },
        { width: "6%", targets: 5 },
        { width: "6%", targets: 6 },
        { width: "10%", targets: 7 },
        { width: "20%", targets: 8 },
        { width: "7%", targets: 9 },
        { width: "7%", targets: 10 },
      ],

      data: rows,
      columns: [
        { data: "purchase_item_id" },
        { data: "price" },
        { data: "discount" },
        { data: "item_id" },
        { data: "item_name" },
        { data: "available_quantity" },
        { data: "return_quantity" },
        { data: "defaults", className: "editable" },
        { data: "defaults", className: "editable1" },
        { data: "batch" },
        { data: "expiry" },
      ],
      bFilter: false,
      bJQueryUI: true,
      sPaginationType: "full_numbers",
      bPaginate: false,
      bInfo: false,
    });
    $("#my-table").on("click", "tbody td.editable", function (event) {
      if ($(this).attr("contentEditable") == true) {
        $(this).attr("contentEditable", "false");
      } else {
        $(this).attr("contentEditable", "true");
      }
    });
    $("#my-table").on("click", "tbody td.editable1", function (event) {
      if ($(this).attr("contentEditable") == true) {
        $(this).attr("contentEditable", "false");
      } else {
        $(this).attr("contentEditable", "true");
      }
    });
  });
}

// =========================================================================================== //

// =========================================================================================== //

// =========================================================================================== //

insert_return = function (
  purchase_item_id,
  return_quantity,
  return_date,
  total,
  comment,
  callback
) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "INSERT INTO purchase_return (purchase_item_id,return_quantity,return_date,return_total,comment) VALUES (?,?,?,?,?)"
    );
    stmt.run(purchase_item_id, return_quantity, return_date, total, comment);
    stmt.finalize();
    callback("true");
  });
};

update_item = function (return_quantity, purchase_item_id, callback) {
  db.connection.serialize(function () {
    var stmt = db.connection.prepare(
      "UPDATE purchase_item SET available_quantity=available_quantity - ?, return_quantity = return_quantity + ?  WHERE purchase_item_id = ?"
    );
    stmt.run(return_quantity, return_quantity, purchase_item_id);
    stmt.finalize();
    callback("true");
  });
};

function update_quantity(
  purchase_item_id,
  return_quantity,
  return_date,
  price,
  discount,
  comment
) {
  var price1 = parseFloat(price);
  var quantity1 = parseFloat(return_quantity);
  var discount1 = parseFloat(discount);
  discount1 = discount1 / 100;

  var total = price1 * quantity1;
  total = total - total * discount1;
  total = total.toFixed(2);

  insert_return(
    purchase_item_id,
    return_quantity,
    return_date,
    total,
    comment,
    function (ins_ret) {
      update_item(return_quantity, purchase_item_id, function (up_it) {
        show_purchase_added();
      });
    }
  );
}

function return_items() {
  var invoice_id = document.getElementById("purchase_invoice").value;
  var sql =
    "Select  * from purchase where purchase.status = 1 and purchase.purchase_id=?";
  db.connection.all(sql, [invoice_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      $("#my-table tbody tr").each(function () {
        var purchase_item_id = $(this).find("td").eq(0).html();
        var price = $(this).find("td").eq(1).html();
        var discount = $(this).find("td").eq(2).html();
        var available_quantity = $(this).find("td").eq(5).html();
        var return_quantity = $(this).find("td").eq(7).html();
        var comment = $(this).find("td").eq(8).html();
        var return_date = document.getElementById("return_date").value;

        if (
          purchase_item_id != "" &&
          parseInt(available_quantity) >= parseInt(return_quantity) &&
          parseInt(return_quantity) > 0
        ) {
          update_quantity(
            purchase_item_id,
            return_quantity,
            return_date,
            price,
            discount,
            comment
          );
        }
      });
    } else {
      return;
    }
  });
}
