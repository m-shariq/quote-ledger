var db = require("../../../util/database.js");

// FUNCTIONALITIES FOR THE TRANSPORTERS STARTED
function add_transporter(trans_name) {
  var stmt = db.connection.prepare(
    "INSERT INTO trans_group (trans_name) VALUES (?)"
  );
  stmt.run(trans_name);
  stmt.finalize();
}

function edit_transporter(trans_id, trans_name) {
  var stmt = db.connection.prepare(
    "UPDATE trans_group SET trans_name = ? WHERE trans_id = ?"
  );
  stmt.run(trans_name, trans_id);
  stmt.finalize();
}

function show_transporter() {
  var sql = "SELECT trans_id AS id, trans_name as name FROM trans_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_transporter_table() {
  var sql = "SELECT trans_id AS id, trans_name as name FROM trans_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");

    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE TRANSPORTERS ENDED

// FUNCTIONALITIES FOR THE area STARTED
function add_area(trans_name) {
  var stmt = db.connection.prepare(
    "INSERT INTO area_group (area_name) VALUES (?)"
  );
  stmt.run(trans_name);
  stmt.finalize();
}

function edit_area(trans_id, trans_name) {
  var stmt = db.connection.prepare(
    "UPDATE area_group SET area_name = ? WHERE area_id = ?"
  );
  stmt.run(trans_name, trans_id);
  stmt.finalize();
}

function show_area() {
  var sql = "SELECT area_id AS id, area_name as name FROM area_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_area_table() {
  var sql = "SELECT area_id AS id, area_name as name FROM area_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");

    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE area ENDED

// FUNCTIONALITIES FOR THE saleman STARTED
function add_saleman(trans_name) {
  var stmt = db.connection.prepare(
    "INSERT INTO saleman_group (saleman_name) VALUES (?)"
  );
  stmt.run(trans_name);
  stmt.finalize();
}

function edit_saleman(trans_id, trans_name) {
  var stmt = db.connection.prepare(
    "UPDATE saleman_group SET saleman_name = ? WHERE saleman_id = ?"
  );
  stmt.run(trans_name, trans_id);
  stmt.finalize();
}

function show_saleman() {
  var sql = "SELECT saleman_id AS id, saleman_name as name FROM saleman_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_saleman_table() {
  var sql = "SELECT saleman_id AS id, saleman_name as name FROM saleman_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");

    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE TRANSPORTERS ENDED

// FUNCTIONALITIES FOR THE BANKS STARTED
function add_bank(trans_name) {
  var stmt = db.connection.prepare(
    "INSERT INTO bank_group (bank_name) VALUES (?)"
  );
  stmt.run(trans_name);
  stmt.finalize();
}

function edit_bank(trans_id, trans_name) {
  var stmt = db.connection.prepare(
    "UPDATE bank_group SET bank_name = ? WHERE bank_id = ?"
  );
  stmt.run(trans_name, trans_id);
  stmt.finalize();
}

function show_bank() {
  var sql = "SELECT bank_id AS id, bank_name as name FROM bank_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_bank_table() {
  var sql = "SELECT bank_id AS id, bank_name as name FROM bank_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");

    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE BANKS ENDED

// FUNCTIONALITIES FOR THE Cities STARTED
function add_city(city_name) {
  var stmt = db.connection.prepare(
    "INSERT INTO city_group (city_name) VALUES (?)"
  );
  stmt.run(city_name);
  stmt.finalize();
}

function edit_city(city_id, city_name) {
  var stmt = db.connection.prepare(
    "UPDATE city_group SET city_name = ? WHERE city_id = ?"
  );
  stmt.run(city_name, city_id);
  stmt.finalize();
}

function show_city() {
  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_city_table() {
  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE CITY ENDED

// FUNCTIONALITIES FOR THE AC STARTED
function add_ac(ac_name) {
  var stmt = db.connection.prepare("INSERT INTO ac_group (ac_name) VALUES (?)");
  stmt.run(ac_name);
  stmt.finalize();
}

function edit_ac(ac_id, ac_name) {
  var stmt = db.connection.prepare(
    "UPDATE ac_group SET ac_name = ? WHERE ac_id = ?"
  );
  stmt.run(ac_name, ac_id);
  stmt.finalize();
}

function show_ac() {
  var sql = "SELECT ac_id AS id, ac_name as name FROM ac_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_ac_table() {
  var sql = "SELECT ac_id AS id, ac_name as name FROM ac_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");

    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE AC ENDED

// FUNCTIONALITIES FOR THE ITEM CAT STARTED
function add_item_cat(item_cat_name) {
  var stmt = db.connection.prepare(
    "INSERT INTO item_cat_group (item_cat_name) VALUES (?)"
  );
  stmt.run(item_cat_name);
  stmt.finalize();
}

function edit_item_cat(item_cat_id, item_cat_name) {
  var stmt = db.connection.prepare(
    "UPDATE item_cat_group SET item_cat_name = ? WHERE item_cat_id = ?"
  );
  stmt.run(item_cat_name, item_cat_id);
  stmt.finalize();
}

function show_item_cat() {
  var sql =
    "SELECT item_cat_id AS id, item_cat_name as name FROM item_cat_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_trans option").remove();
    $("#id_trans").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_trans").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_item_cat_table() {
  var sql =
    "SELECT item_cat_id AS id, item_cat_name as name FROM item_cat_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [{ id: "", name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [{ data: "id" }, { data: "name" }],
    });
  });
}

// FUNCTIONALITIES FOR THE ITEM CAT ENDED

// FUNCTIONALITIES FOR THE ITEM STARTED
function add_item(item_cat_name, item_cat, ac) {
  var stmt = db.connection.prepare(
    "INSERT INTO item_group (item_name,ac_id,item_cat_id) VALUES (?,?,?)"
  );
  stmt.run(item_cat_name, ac, item_cat);
  stmt.finalize();
}

function edit_item(item_id, item_name, item_cat, ac) {
  var stmt = db.connection.prepare(
    "UPDATE item_group SET item_name = ? , item_cat_id = ? , ac_id = ? WHERE item_id = ?"
  );
  stmt.run(item_name, item_cat, ac, item_id);
  stmt.finalize();
}

function show_add_item() {
  var sql =
    "SELECT item_cat_id AS id, item_cat_name as name FROM item_cat_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    $("#id_item_cat option").remove();

    for (let i = 0; i < rows.length; i++) {
      $("#id_item_cat").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT ac_id AS id, ac_name as name FROM ac_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    $("#id_ac option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#id_ac").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_edit_item() {
  var sql =
    "SELECT item_id AS id, item_name as name, item_cat_name as cat_name, ac_name as ac_name FROM item_group,ac_group,item_cat_group where item_group.ac_id = ac_group.ac_id and item_group.item_cat_id = item_cat_group.item_cat_id";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    $("#id_item option").remove();
    $("#id_item").append($("<option>").text("").attr("value", ""));

    for (let i = 0; i < rows.length; i++) {
      $("#id_item").append(
        $("<option>")
          .text(
            rows[i].name + " - " + rows[i].cat_name + " - " + rows[i].ac_name
          )
          .attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT ac_id AS id, ac_name as name FROM ac_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    $("#ac_id option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#ac_id").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql =
    "SELECT item_cat_id AS id, item_cat_name as name FROM item_cat_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    $("#item_cat_id option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#item_cat_id").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_item_table() {
  var sql =
    "SELECT item_id AS id, item_name as name, item_cat_name as cat_name, ac_name as ac_name FROM item_group,ac_group,item_cat_group where item_group.ac_id = ac_group.ac_id and item_group.item_cat_id = item_cat_group.item_cat_id";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [{ id: "", name: "", cat_name: "", ac_name: "" }];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      columnDefs: [
        { width: "9%", targets: 0 },
        { width: "10%", targets: 2 },
        { width: "15%", targets: 3 },
      ],
      data: rows,
      columns: [
        { data: "id" },
        { data: "name" },
        { data: "cat_name" },
        { data: "ac_name" },
      ],
    });
  });
}

// FUNCTIONALITIES FOR THE ITEM ENDED

// FUNCTIONALITIES FOR THE PARTY STARTED
function add_party(name, cell, address, city) {
  var stmt = db.connection.prepare(
    "INSERT INTO party_group (party_name,cell,address,city_id) VALUES (?,?,?,?)"
  );
  stmt.run(name, cell, address, city);
  stmt.finalize();
}

function edit_party(id, name, cell, address, city) {
  var stmt = db.connection.prepare(
    "UPDATE party_group SET party_name = ?, cell=?, address=?, city_id=? WHERE party_id = ?"
  );
  stmt.run(name, cell, address, city, id);
  stmt.finalize();
}

function show_add_party() {
  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#party_city option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#party_city").append(
        $("<option>")
          .text(rows[i].id + "-" + rows[i].name)
          .attr("value", rows[i].id)
      );
    }
  });
  return;
}

function show_edit_party() {
  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_party option").remove();
    $("#id_party").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_party").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT city_id AS id, city_name as name FROM city_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#city_party option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#city_party").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
  return;
}

function show_party_table() {
  var sql =
    "SELECT party_id AS id, city_group.city_id, party_name as name, cell, address,city_name as city FROM party_group, city_group where party_group.city_id = city_group.city_id";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [
      {
        id: "",
        name: "",
        cell: "",
        address: "",
        city: "",
        city_id: "",
      },
    ];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      columnDefs: [
        { width: "10%", targets: 1 },
        { width: "10%", targets: 3 },
      ],
      data: rows,
      columns: [
        {
          data: "name",
          render: function (data, type, row) {
            return row.id + " - " + row.name;
          },
        },
        { data: "cell" },
        { data: "address" },
        {
          data: "city",
          render: function (data, type, row) {
            return row.city_id + " - " + row.city;
          },
        },
      ],
    });
  });
  return;
}

// FUNCTIONALITIES FOR THE PARTY ENDED

// FUNCTIONALITIES FOR THE PARTY_rate STARTED
function add_party_rate(price, party, item) {
  var party_rate_exists = db.connection.prepare(
    "SELECT * FROM party_rate_group WHERE party_id = ? AND item_id = ?"
  );
  party_rate_exists.all(party, item, (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      var stmt = db.connection.prepare(
        "UPDATE party_rate_group SET price = ? WHERE party_id = ? AND item_id = ?"
      );
      stmt.run(price, party, item);
      stmt.finalize();
      show_party_rate_table();
    }
    else{
      var stmt = db.connection.prepare(
        "INSERT INTO party_rate_group (price,party_id,item_id) VALUES (?,?,?)"
      );
      stmt.run(price, party, item);
      stmt.finalize();
      show_party_rate_table();
    }
  });
}

function edit_party_rate(id, price, party, item) {
  console.log(price, party, item, id);
  var stmt = db.connection.prepare(
    "UPDATE party_rate_group SET price = ?, party_id=?, item_id=? WHERE party_rate_id = ?"
  );
  stmt.run(price, party, item, id);
  stmt.finalize();
}

function show_add_party_rate() {
  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#rate_party option").remove();
    $("#rate_party").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#rate_party").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT item_id AS id, item_name as name FROM item_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#rate_item option").remove();
    $("#rate_item").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#rate_item").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });
}

function show_edit_party_rate() {
  var sql = "SELECT party_id AS id, party_name as name FROM party_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#party_rate option").remove();

    for (let i = 0; i < rows.length; i++) {
      $("#party_rate").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql = "SELECT item_id AS id, item_name as name FROM item_group";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#item_rate option").remove();
    for (let i = 0; i < rows.length; i++) {
      $("#item_rate").append(
        $("<option>").text(rows[i].name).attr("value", rows[i].id)
      );
    }
  });

  var sql =
    "SELECT party_rate_id as id, price, party_name, item_name FROM party_group, item_group, party_rate_group where party_group.party_id = party_rate_group.party_id and item_group.item_id = party_rate_group.item_id";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#id_rate option").remove();
    $("#id_rate").append($("<option>").text("").attr("value", ""));
    for (let i = 0; i < rows.length; i++) {
      $("#id_rate").append(
        $("<option>")
          .text(
            rows[i].party_name +
              " - " +
              rows[i].item_name +
              " - " +
              rows[i].price
          )
          .attr("value", rows[i].id)
      );
    }
  });
}

function show_party_rate_table() {
  var sql =
    "SELECT party_group.party_id, price, party_name, item_name, item_group.item_id FROM party_group, item_group, party_rate_group where party_group.party_id = party_rate_group.party_id and item_group.item_id = party_rate_group.item_id";
  db.connection.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    $("#my-table").DataTable().clear().destroy();
    $("#my-table").removeClass().addClass("col-md-6");
    rowss = [
      { party_name: "", item_name: "", price: "", party_id: "", item_id: "" },
    ];
    console.log(Object.keys(rows).length);
    for (var i = Object.keys(rows).length; i < 10; i++) {
      rows = rows.concat(rowss);
    }
    $("#my-table").DataTable({
      ordering: false,
      data: rows,
      columns: [
        {
          data: "party_name",
          render: function (data, type, row) {
            return row.party_id + " - " + row.party_name;
          },
        },
        {
          data: "item_name",
          render: function (data, type, row) {
            return row.item_id + " - " + row.item_name;
          },
        },
        { data: "price" },
      ],
    });
  });
}

// FUNCTIONALITIES FOR THE PARTY_rate ENDED

// --------------------------------------------------------------------------- //

function edit_display_party(party_id) {
  var sql = "SELECT * FROM party_group where party_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_party").value = rows[0].party_name;
      document.getElementById("cell_party").value = rows[0].cell;
      document.getElementById("address_party").value = rows[0].address;
      document.getElementById("city_party").value = rows[0].city_id;
    } else {
      document.getElementById("name_party").value = "";
      document.getElementById("cell_party").value = "";
      document.getElementById("address_party").value = "";
      document.getElementById("city_party").selectedIndex = "0";
    }
  });
}

function edit_display_ac(party_id) {
  var sql = "SELECT * FROM ac_group where ac_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_trans").value = rows[0].ac_name;
    } else {
      document.getElementById("name_trans").value = "";
    }
  });
}

function edit_display_bank(party_id) {
  var sql = "SELECT * FROM bank_group where bank_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_trans").value = rows[0].bank_name;
    } else {
      document.getElementById("name_trans").value = "";
    }
  });
}

function edit_display_trans(party_id) {
  var sql = "SELECT * FROM trans_group where trans_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_trans").value = rows[0].trans_name;
    } else {
      document.getElementById("name_trans").value = "";
    }
  });
}

function edit_display_city(party_id) {
  var sql = "SELECT * FROM city_group where city_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_trans").value = rows[0].city_name;
    } else {
      document.getElementById("name_trans").value = "";
    }
  });
}

function edit_display_cat(party_id) {
  var sql = "SELECT * FROM item_cat_group where item_cat_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_trans").value = rows[0].item_cat_name;
    } else {
      document.getElementById("name_trans").value = "";
    }
  });
}

function edit_display_item(party_id) {
  var sql = "SELECT * FROM item_group where item_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("name_item").value = rows[0].item_name;
      document.getElementById("ac_id").value = rows[0].ac_id;
      document.getElementById("item_cat_id").value = rows[0].item_cat_id;
    } else {
      document.getElementById("name_item").value = "";
      document.getElementById("ac_id").selectedIndex = "0";
      document.getElementById("item_cat_id").selectedIndex = "0";
    }
  });
}

function edit_display_rate(party_id) {
  var sql = "SELECT * FROM party_rate_group where party_rate_id=?";
  db.connection.all(sql, [party_id], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length != 0) {
      document.getElementById("price_rate").value = rows[0].price;
      document.getElementById("party_rate").value = rows[0].party_id;
      document.getElementById("item_rate").value = rows[0].item_id;
    } else {
      document.getElementById("price_rate").value = "";
      document.getElementById("party_rate").selectedIndex = "0";
      document.getElementById("item_rate").selectedIndex = "0";
    }
  });
}
