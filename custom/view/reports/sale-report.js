//Import the library into your project
var db = require("../../../util/database.js");
// const { createInvoiceP } = require("../invoice/report-for-purchase");

function downloadInvoiceS(date_from, date_to, party_id, item_id, city_id) {
  if (party_id != "" && city_id != "") {
    get_partyS(party_id, function (party) {
      get_purchaseS(
        date_from,
        date_to,
        party_id,
        item_id,
        city_id,
        function (detail) {
          get_purchase_itemS(
            date_from,
            date_to,
            party_id,
            item_id,
            city_id,
            function (purchase_item) {
              get_sumS(party_id, date_from, city_id, function (sum) {
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
                  title: "SALE",
                  party: party[0],
                  items: purchase_item,
                  opening_balance: sums,
                  detail: detail,
                  from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
                  to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
                  sub: "Debit (RS)",
                  invoice_type: "SI",
                  nar: "",
                };

                createInvoiceP(invoice1, "invoice.pdf");
              });
            }
          );
        }
      );
    });
  } else if (party_id == "" && city_id != "") {
    get_purchaseS(date_from, date_to, "", item_id, city_id, function (detail) {
      get_purchase_itemS(
        date_from,
        date_to,
        "",
        item_id,
        city_id,
        function (purchase_item) {
          get_sumS("", date_from, city_id, function (sum) {
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
              title: "SALE",
              items: purchase_item,
              detail: detail,
              opening_balance: sums,
              from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
              to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
              sub: "Debit (RS)",
              invoice_type: "SI",
              nar: "Party Name",
            };

            createInvoiceP(invoice1, "invoice.pdf");
          });
        }
      );
    });
  } else if (party_id != "" && city_id == "") {
    get_partyS(party_id, function (party) {
      get_purchaseS(
        date_from,
        date_to,
        party_id,
        item_id,
        "",
        function (detail) {
          get_purchase_itemS(
            date_from,
            date_to,
            party_id,
            item_id,
            "",
            function (purchase_item) {
              get_sumS(party_id, date_from, "", function (sum) {
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
                  title: "SALE",
                  party: party[0],
                  items: purchase_item,
                  opening_balance: sums,
                  detail: detail,
                  from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
                  to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
                  sub: "Debit (RS)",
                  invoice_type: "SI",
                  nar: "",
                };

                createInvoiceP(invoice1, "invoice.pdf");
              });
            }
          );
        }
      );
    });
  } else {
    get_purchaseS(date_from, date_to, "", item_id, "", function (detail) {
      get_purchase_itemS(
        date_from,
        date_to,
        "",
        item_id,
        "",
        function (purchase_item) {
          get_sumS("", date_from, "", function (sum) {
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
              title: "SALE",
              items: purchase_item,
              detail: detail,
              opening_balance: sums,
              from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
              to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
              sub: "Debit (RS)",
              invoice_type: "SI",
              nar: "Party Name",
            };

            createInvoiceP(invoice1, "invoice.pdf");
          });
        }
      );
    });
  }
}
// --------------------------------------------------------

get_partyS = function (party_id, callback) {
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

get_purchaseS = function (
  date_from,
  date_to,
  party_id,
  item_id,
  city_id,
  callback
) {
  if (party_id != "" && city_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice, sale_item, purchase_item where trans_group.trans_id=sale.trans_id and sale_item.sale_id = sale.sale_id and sale_item.purchase_item_id = purchase_item.purchase_item_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? and purchase_item.item_id=? and city_group.city_id=? order by sale.date ASC",
          [date_from, date_to, party_id, item_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice where trans_group.trans_id=sale.trans_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? and city_group.city_id=? order by sale.date ASC",
          [date_from, date_to, party_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else if (party_id == "" && city_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice, sale_item, purchase_item where trans_group.trans_id=sale.trans_id and sale_item.sale_id = sale.sale_id and sale_item.purchase_item_id = purchase_item.purchase_item_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and purchase_item.item_id=? and city_group.city_id=? order by party_name ASC, date ASC",
          [date_from, date_to, item_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice where trans_group.trans_id=sale.trans_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and city_group.city_id=? order by party_name ASC, date ASC",
          [date_from, date_to, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else if (party_id != "" && city_id == "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice, sale_item, purchase_item where trans_group.trans_id=sale.trans_id and sale_item.sale_id = sale.sale_id and sale_item.purchase_item_id = purchase_item.purchase_item_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? and purchase_item.item_id=? order by sale.date ASC",
          [date_from, date_to, party_id, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice where trans_group.trans_id=sale.trans_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? order by sale.date ASC",
          [date_from, date_to, party_id],
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
          "SELECT DISTINCT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice, sale_item, purchase_item where trans_group.trans_id=sale.trans_id and sale_item.sale_id = sale.sale_id and sale_item.purchase_item_id = purchase_item.purchase_item_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? and purchase_item.item_id=? order by party_name ASC, date ASC",
          [date_from, date_to, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT sale.sale_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.payable as paid, invoice.receivable as received FROM trans_group, party_group, city_group, sale,invoice where trans_group.trans_id=sale.trans_id and invoice.sale_id=sale.sale_id and city_group.city_id=party_group.city_id and sale.party_id=party_group.party_id and sale.status=1 and sale.date>=? and sale.date<=? order by party_name ASC, date ASC",
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

get_purchase_itemS = function (
  date_from,
  date_to,
  party_id,
  item_id,
  city_id,
  callback
) {
  if (party_id != "" && city_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id, ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale,party_group where party_group.party_id=sale.party_id and item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? and purchase_item.item_id=? and party_group.city_id=? order by sale.date ASC",
          [date_from, date_to, party_id, item_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id,ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale,party_group where party_group.party_id=sale.party_id and item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? and party_group.city_id=? order by sale.date ASC",
          [date_from, date_to, party_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else if (party_id == "" && city_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id,ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale,party_group where party_group.party_id=sale.party_id and item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and purchase_item.item_id=? and party_group.city_id=?",
          [date_from, date_to, item_id, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id,ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from item_group, sale_item, purchase_item, sale, ac_group,party_group where party_group.party_id=sale.party_id and item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and party_group.city_id=?",
          [date_from, date_to, city_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    }
  } else if (party_id != "" && city_id == "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id, ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale where item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? and purchase_item.item_id=? order by sale.date ASC",
          [date_from, date_to, party_id, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id,ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale where item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? order by sale.date ASC",
          [date_from, date_to, party_id],
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
          "Select sale.sale_id as id,ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale where item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and purchase_item.item_id=? ",
          [date_from, date_to, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select sale.sale_id as id,ac_name,sale_item.quantity,sale_item.discount,sale_item.return_quantity,sale_item.batch,sale_item.expiry,sale_item.price,sale_item.total,item_name as name from item_group, sale_item, purchase_item, sale, ac_group where item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=?",
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

get_sumS = function (party_id, date_from, city_id, callback) {
  if (party_id != "" && city_id != "") {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(receivable) as sum from invoice, sale,party_group where party_group.party_id=sale.party_id and sale.sale_id = invoice.sale_id and date > '2000-12-12' and sale.party_id = ? and date < ? and party_group.city_id = ?",
        [party_id, date_from, city_id],
        function (err, row) {
          callback(row);
        }
      );
    });
  } else if (party_id == "" && city_id != "") {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(receivable) as sum from invoice, sale,party_group where party_group.party_id=sale.party_id and sale.sale_id = invoice.sale_id and date > '2000-12-12' and date < ? and party_group.city_id = ?",
        [date_from, city_id],
        function (err, row) {
          callback(row);
        }
      );
    });
  } else if (party_id != "" && city_id == "") {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(receivable) as sum from invoice, sale,party_group where party_group.party_id=sale.party_id and sale.sale_id = invoice.sale_id and date > '2000-12-12' and sale.party_id = ? and date < ?",
        [party_id, date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  } else {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(receivable) as sum from invoice, sale where sale.sale_id = invoice.sale_id and date > '2000-12-12' and date < ?",
        [date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  }
};
