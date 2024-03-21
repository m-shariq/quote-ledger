//Import the library into your project
var db = require("../../../../util/database.js");
const { createInvoice } = require("../../invoice/purchase-for-invoice.js");

function downloadInvoice(invoice_id, warranty) {
  get_party(invoice_id, function (party) {
    get_amount(invoice_id, function (amount) {
      get_purchase(invoice_id, function (purchase) {
        get_purchase_item(invoice_id, function (purchase_item) {
          console.log(purchase_item);

          const invoice1 = {
            label: "SALE",
            shipping: party[0],
            items: purchase_item,
            purchase: purchase[0],
            amounts: amount[0].receivable,
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
      "SELECT party_name as party, address, cell , city_name as city FROM party_group, city_group, sale where city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.sale_id=?",
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
      "SELECT sale_id as id, trans_name as trans, date, bilty FROM trans_group, sale where trans_group.trans_id=sale.trans_id and sale.sale_id=?",
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
      "SELECT receivable from invoice where sale_id=?",
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
      "Select item_name as name, ac_name, sale_item.batch, sale_item.expiry, sale_item.quantity, sale_item.price, sale_item.discount, sale_item.total,  sale_item.return_quantity from sale_item,purchase_item, item_group, ac_group where ac_group.ac_id=item_group.ac_id and sale_item.purchase_item_id=purchase_item.purchase_item_id and purchase_item.item_id = item_group.item_id and sale_id=?",
      [invoice_id],
      function (err, row) {
        callback(row);
      }
    );
  });
}

// ------------------------------------------------------------
