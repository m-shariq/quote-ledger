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
            label: "PAYMENT",
            shipping: party[0],
            items: purchase_item,
            purchase: purchase[0],
            amounts: amount[0].paid,
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
      "SELECT party_name as party, address, cell , city_name as city FROM party_group, city_group, payment where city_group.city_id=party_group.city_id and payment.party_id=party_group.party_id and payment.payment_id=?",
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
      "SELECT payment_id as id, date FROM payment where payment.payment_id=?",
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
      "SELECT paid from invoice_pay where payment_id=?",
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
      "Select bank,comment,amount from payment_item, payment where payment_item.payment_id=payment.payment_id and payment.payment_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

// ------------------------------------------------------------
