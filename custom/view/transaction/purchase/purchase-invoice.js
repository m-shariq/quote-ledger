//Import the library into your project
var db = require("../../../../util/database.js");
const { createInvoice } = require("../../invoice/purchase-for-invoice.js");

function downloadInvoice(invoice_id, warranty) {
  get_party(invoice_id, function (party) {
    get_amount(invoice_id, function (amount) {
      get_purchase(invoice_id, function (purchase) {
        get_purchase_item(invoice_id, function (purchase_item) {
          console.log(party);
          const invoice1 = {
            label: "Quotation",
            shipping: party[0],
            items: purchase_item,
            purchase: purchase[0],
            amounts: 0,
            subtotal: 8000,
            paid: 0,
            invoice_nr: 1234,
            warranty: warranty,
          };

          createInvoice(invoice1, "invoice.pdf");
        });
      });
    });
  });
}
// --------------------------------------------------------

function get_party(invoice_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT party_name as party, address, cell , city_name as city FROM party_group, city_group, purchase where city_group.city_id=party_group.city_id and purchase.party_id=party_group.party_id and purchase.purchase_id=?",
      [1],
      function (err, row) {
        console.log(row);
        callback(row);
      }
    );
  });
}

// --------------------------------------------------------

function get_purchase(invoice_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT purchase_id as id, date, bilty FROM purchase where purchase.purchase_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

function get_amount(invoice_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT receivable from invoice where purchase_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

// --------------------------------------------------------

function get_purchase_item(invoice_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select item_name as name, item_group.description as ac_name, batch, expiry, quantity, price, discount, total, return_quantity from purchase_item, item_group where purchase_item.item_id=item_group.item_id and purchase_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

// ------------------------------------------------------------
