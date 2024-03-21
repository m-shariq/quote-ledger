//Import the library into your project
var db = require("../../../../util/database.js");
const { createInvoice } = require("../../invoice/payment-for-invoice.js");

function downloadInvoice(invoice_id) {
  get_party(invoice_id, function (party) {
    get_amount(invoice_id, function (amount) {
      get_purchase(invoice_id, function (purchase) {
        get_purchase_item(invoice_id, function (purchase_item) {
          console.log(purchase_item);

          const invoice1 = {
            label: "RECEIPT",
            shipping: party[0],
            items: purchase_item,
            purchase: purchase[0],
            amounts: amount[0].received,
            subtotal: 8000,
            paid: 0,
            invoice_nr: 1234,
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
      "SELECT party_name as party, address, cell , city_name as city FROM party_group, city_group, receipt where city_group.city_id=party_group.city_id and receipt.party_id=party_group.party_id and receipt.receipt_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

// --------------------------------------------------------

function get_purchase(invoice_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT receipt_id as id, date FROM receipt where receipt.receipt_id=?",
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
      "SELECT received from invoice_pay where receipt_id=?",
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
      "Select bank,comment,amount from receipt_item, receipt where receipt_item.receipt_id=receipt.receipt_id and receipt.receipt_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

// ------------------------------------------------------------
