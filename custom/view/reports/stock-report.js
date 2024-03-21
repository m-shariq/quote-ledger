//Import the library into your project
var db = require("../../../util/database.js");
const { createInvoiceStock } = require("../invoice/report-for-stock.js");

function downloadInvoiceStock(party_id, item_id) {
  if (party_id != "") {
    get_partyStock(party_id, function (party) {
      get_quantityStock(party_id, item_id, function (detail) {
        const invoice1 = {
          title: "STOCK REPORT",
          party: party[0],
          detail: detail,
          nar: "",
        };

        createInvoiceStock(invoice1, "invoice.pdf");
      });
    });
  } else {
    get_quantityStock("", item_id, function (detail) {
      const invoice1 = {
        title: "STOCK REPORT",
        detail: detail,
        nar: "Party Name",
      };

      createInvoiceStock(invoice1, "invoice.pdf");
    });
  }
}
// --------------------------------------------------------

get_partyStock = function (party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT party_name as party, address, cell , city_name as city FROM party_group, city_group where city_group.city_id=party_group.city_id and party_id=?",
      [party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_quantityStock = function (party_id, item_id, callback) {
  if (party_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sum(available_quantity) as avl_qty, item_group.item_id, item_name, party_name from party_group, item_group,purchase_item, purchase where party_group.party_id=purchase.party_id and item_group.item_id=purchase_item.item_id and purchase.purchase_id=purchase_item.purchase_id and item_group.item_id=? and party_group.party_id=?  GROUP by item_group.item_id order by item_name ASC",
          [item_id, party_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sum(available_quantity) as avl_qty, item_group.item_id, item_name, party_name from party_group, item_group,purchase_item, purchase where party_group.party_id=purchase.party_id and item_group.item_id=purchase_item.item_id and purchase.purchase_id=purchase_item.purchase_id and party_group.party_id=?  GROUP by item_group.item_id order by item_name ASC",
          [party_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sum(available_quantity) as avl_qty, item_group.item_id, item_name, party_name from party_group, item_group,purchase_item, purchase where party_group.party_id=purchase.party_id and item_group.item_id=purchase_item.item_id and purchase.purchase_id=purchase_item.purchase_id and item_group.item_id=?  GROUP by item_group.item_id order by item_name ASC",
          [item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sum(available_quantity) as avl_qty, item_group.item_id, item_name, party_name from party_group, item_group,purchase_item, purchase where party_group.party_id=purchase.party_id and item_group.item_id=purchase_item.item_id and purchase.purchase_id=purchase_item.purchase_id  GROUP by item_group.item_id order by item_name ASC",
          [],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  }
};
