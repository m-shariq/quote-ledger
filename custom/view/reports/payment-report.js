//Import the library into your project
var db = require("../../../util/database.js");
const { createInvoice } = require("../invoice/report-for-payment");

function downloadInvoiceP(date_from, date_to, party_id, city_id) {
  if (party_id != "") {
    get_partyP(party_id, function (party) {
      get_purchaseP(date_from, date_to, party_id, city_id, function (detail) {
        get_purchase_itemP(
          date_from,
          date_to,
          party_id,
          city_id,
          function (payment_item) {
            get_sumPy(party_id, date_from, function (sum) {
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
                title: "PAYMENT",
                party: party[0],
                items: payment_item,
                detail: detail,
                opening_balance: sums,
                from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
                to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
                sub: "Debit (RS)",
                invoice_type: "PYI",
                nar: "",
              };

              createInvoice(invoice1, "invoice.pdf");
            });
          }
        );
      });
    });
  } else {
    get_purchaseP(date_from, date_to, "", city_id, function (detail) {
      get_purchase_itemP(
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
              title: "PAYMENT",
              items: payment_item,
              detail: detail,
              opening_balance: sums,
              from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
              to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
              sub: "Debit (RS)",
              invoice_type: "PYI",
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

get_partyP = function (party_id, callback) {
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

get_purchaseP = function (date_from, date_to, party_id, city_id, callback) {
  if (party_id != "") {
    if (city_id && city_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT(payment.payment_id) as id, party_name as party, address, cell , city_name as city, date, paid as r,received as p FROM party_group, city_group, payment, invoice_pay, payment_item where payment_item.payment_id = payment.payment_id and invoice_pay.payment_id=payment.payment_id and city_group.city_id=party_group.city_id and payment.party_id=party_group.party_id and payment.status=1 and payment.date>=? and payment.date<=? and payment.party_id=? and payment_item.city_id = ? order by payment.date ASC",
          [date_from, date_to, party_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT payment.payment_id as id, party_name as party, address, cell , city_name as city, date, paid as r,received as p FROM party_group, city_group, payment,invoice_pay where invoice_pay.payment_id=payment.payment_id and city_group.city_id=party_group.city_id and payment.party_id=party_group.party_id and payment.status=1 and payment.date>=? and payment.date<=? and payment.party_id=? order by payment.date ASC",
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
          "SELECT payment.payment_id as id, party_name as party, address, cell , city_name as city, date, paid as r,received as p FROM party_group, city_group, payment,invoice_pay, payment_item where payment_item.payment_id = payment.payment_id and invoice_pay.payment_id=payment.payment_id and city_group.city_id=party_group.city_id and payment.party_id=party_group.party_id and payment.status=1 and payment.date>=? and payment.date<=? and payment_item.city_id = ? order by party_name ASC, date ASC",
          [date_from, date_to, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT payment.payment_id as id, party_name as party, address, cell , city_name as city, date, paid as r,received as p FROM party_group, city_group, payment,invoice_pay where invoice_pay.payment_id=payment.payment_id and city_group.city_id=party_group.city_id and payment.party_id=party_group.party_id and payment.status=1 and payment.date>=? and payment.date<=? order by party_name ASC, date ASC",
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

get_purchase_itemP = function (
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
          "Select payment.payment_id as id,bank_name,comment,amount from bank_group, payment_item, payment where bank_group.bank_id=payment_item.bank and payment_item.payment_id=payment.payment_id and payment.status=1 and payment.date>=? and payment.date<=? and payment.party_id=? and payment_item.city_id = ? order by payment.date ASC",
          [date_from, date_to, party_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select payment.payment_id as id,bank_name,comment,amount from bank_group, payment_item, payment where bank_group.bank_id=payment_item.bank and payment_item.payment_id=payment.payment_id and payment.status=1 and payment.date>=? and payment.date<=? and payment.party_id=? order by payment.date ASC",
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
          "Select payment.payment_id as id,bank_name,comment,amount from bank_group, payment_item, payment where bank_group.bank_id=payment_item.bank and payment_item.payment_id=payment.payment_id and payment.status=1 and payment.date>=? and payment.date<=? and payment_item.city_id=? order by payment.date ASC",
          [date_from, date_to, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select payment.payment_id as id,bank_name,comment,amount from bank_group, payment_item, payment where bank_group.bank_id=payment_item.bank and payment_item.payment_id=payment.payment_id and payment.status=1 and payment.date>=? and payment.date<=? order by payment.date ASC",
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

get_sumPy = function (party_id, date_from, callback) {
  if (party_id != "") {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(paid) as sum from invoice_pay, payment where payment.payment_id = invoice_pay.payment_id and date > '2000-12-12' and payment.party_id = ? and date < ?",
        [party_id, date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  } else {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(paid) as sum from invoice_pay, payment where payment.payment_id = invoice_pay.payment_id and date > '2000-12-12' and date < ?",
        [date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  }
};
