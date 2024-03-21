//Import the library into your project
var db = require("../../../util/database.js");
// const { createInvoice } = require("../invoice/report-for-payment");

function downloadInvoiceR(date_from, date_to, party_id, city_id) {
  if (party_id != "") {
    get_partyR(party_id, function (party) {
      get_purchaseR(date_from, date_to, party_id, city_id, function (detail) {
        get_purchase_itemR(
          date_from,
          date_to,
          party_id,
          city_id,
          function (payment_item) {
            get_sumR(party_id, date_from, function (sum) {
              let sums = 0;

              if (sum[0].sum) {
                sums = sum[0].sum;
              }

              var d_from = new Date(date_from);
              var d_to = new Date(date_to);

              var d_f1 = "";

              if (d_from.getDate().toLocaleString().length == 1) {
                d_f1 = "0" + d_from.getDate();
              } else {
                d_f1 = d_from.getDate();
              }

              var d_f2 = "";
              var yes = d_from.getMonth() + 1;

              if (yes.toLocaleString().length == 1) {
                d_f2 = "0" + yes;
              } else {
                d_f2 = +yes;
              }

              // ------------

              var d_t1 = "";

              if (d_to.getDate().toLocaleString().length == 1) {
                d_t1 = "0" + d_to.getDate();
              } else {
                d_t1 = d_to.getDate();
              }

              var d_t2 = "";
              var yes = d_to.getMonth() + 1;

              if (yes.toLocaleString().length == 1) {
                d_t2 = "0" + yes;
              } else {
                d_t2 = +yes;
              }

              const invoice1 = {
                title: "RECEIPT",
                party: party[0],
                items: payment_item,
                detail: detail,
                opening_balance: sums,
                from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
                to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
                sub: "Credit (RS)",
                invoice_type: "RI",
                nar: "",
              };

              createInvoice(invoice1, "invoice.pdf");
            });
          }
        );
      });
    });
  } else {
    get_purchaseR(date_from, date_to, "", city_id, function (detail) {
      get_purchase_itemR(
        date_from,
        date_to,
        "",
        city_id,
        function (payment_item) {
          get_sumPy("", date_from, function (sum) {
            let sums = 0;

            if (sum[0].sum) {
              sums = sum[0].sum;
            }

            var d_from = new Date(date_from);
            var d_to = new Date(date_to);

            var d_f1 = "";

            if (d_from.getDate().toLocaleString().length == 1) {
              d_f1 = "0" + d_from.getDate();
            } else {
              d_f1 = d_from.getDate();
            }

            var d_f2 = "";
            var yes = d_from.getMonth() + 1;

            if (yes.toLocaleString().length == 1) {
              d_f2 = "0" + yes;
            } else {
              d_f2 = +yes;
            }

            // ------------

            var d_t1 = "";

            if (d_to.getDate().toLocaleString().length == 1) {
              d_t1 = "0" + d_to.getDate();
            } else {
              d_t1 = d_to.getDate();
            }

            var d_t2 = "";
            var yes = d_to.getMonth() + 1;

            if (yes.toLocaleString().length == 1) {
              d_t2 = "0" + yes;
            } else {
              d_t2 = +yes;
            }

            const invoice1 = {
              title: "RECEIPT",
              items: payment_item,
              detail: detail,
              opening_balance: sums,
              from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
              to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
              sub: "Credit (RS)",
              invoice_type: "RI",
              nar: "Party Name",
            };

            createInvoice(invoice1, "invoice.pdf");
          });
        }
      );
    });
  }
}
// --------------------------------------------------------

get_partyR = function (party_id, callback) {
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

get_purchaseR = function (date_from, date_to, party_id, city_id, callback) {
  if (party_id != "") {
    if (city_id && city_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT(receipt.receipt_id) as id, party_name as party, address, cell , city_name as city, date, paid as p, received as r FROM party_group, city_group, receipt,invoice_pay, receipt_item where receipt_item.receipt_id = receipt.receipt_id and invoice_pay.receipt_id=receipt.receipt_id and city_group.city_id=party_group.city_id and receipt.party_id=party_group.party_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt.party_id=? and receipt_item.city_id = ? order by receipt.date ASC",
          [date_from, date_to, party_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT receipt.receipt_id as id, party_name as party, address, cell , city_name as city, date, paid as p, received as r FROM party_group, city_group, receipt,invoice_pay where invoice_pay.receipt_id=receipt.receipt_id and city_group.city_id=party_group.city_id and receipt.party_id=party_group.party_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt.party_id=? order by receipt.date ASC",
          [date_from, date_to, party_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else {
    if (city_id && city_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT(receipt.receipt_id) as id, party_name as party, address, cell , city_name as city, date, paid as p, received as r FROM party_group, city_group, receipt,invoice_pay, receipt_item where receipt_item.receipt_id = receipt.receipt_id and invoice_pay.receipt_id=receipt.receipt_id and city_group.city_id=party_group.city_id and receipt.party_id=party_group.party_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt_item.city_id = ? order by party_name ASC, date ASC",
          [date_from, date_to, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT receipt.receipt_id as id, party_name as party, address, cell , city_name as city, date, paid as p, received as r FROM party_group, city_group, receipt,invoice_pay where invoice_pay.receipt_id=receipt.receipt_id and city_group.city_id=party_group.city_id and receipt.party_id=party_group.party_id and receipt.status=1 and receipt.date>=? and receipt.date<=? order by party_name ASC, date ASC",
          [date_from, date_to],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  }
};

// --------------------------------------------------------

get_purchase_itemR = function (
  date_from,
  date_to,
  party_id,
  city_id,
  callback
) {
  if (party_id != "") {
    if (city_id && city_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select receipt.receipt_id as id,bank_name,comment,amount from bank_group, receipt_item, receipt where bank_group.bank_id=receipt_item.bank and receipt_item.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt.party_id=? and receipt_item.city_id = ? order by receipt.date ASC",
          [date_from, date_to, party_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select receipt.receipt_id as id,bank_name,comment,amount from bank_group, receipt_item, receipt where bank_group.bank_id=receipt_item.bank and receipt_item.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt.party_id=? order by receipt.date ASC",
          [date_from, date_to, party_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else {
    if (city_id && city_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select receipt.receipt_id as id,bank_name,comment,amount from bank_group, receipt_item, receipt where bank_group.bank_id=receipt_item.bank and receipt_item.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt_item.city_id = ? order by receipt.date ASC",
          [date_from, date_to, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select receipt.receipt_id as id,bank_name,comment,amount from bank_group, receipt_item, receipt where bank_group.bank_id=receipt_item.bank and receipt_item.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date>=? and receipt.date<=? order by receipt.date ASC",
          [date_from, date_to],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  }
};

// --------------------------------------------------------

get_sumR = function (party_id, date_from, callback) {
  if (party_id != "") {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(received) as sum from invoice_pay, receipt where receipt.receipt_id = invoice_pay.receipt_id and date > '2000-12-12' and receipt.party_id = ? and date < ?",
        [party_id, date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  } else {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(received) as sum from invoice_pay, receipt where receipt.receipt_id = invoice_pay.receipt_id and date > '2000-12-12' and date < ?",
        [date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  }
};
