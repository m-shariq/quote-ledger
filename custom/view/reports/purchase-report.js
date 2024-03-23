//Import the library into your project
var db = require("../../../util/database.js");
const { createInvoiceP } = require("../invoice/report-for-purchase");

function downloadInvoicePu(date_from, date_to, party_id, item_id) {
  if (party_id != "") {
    get_partyPu(party_id, function (party) {
      get_purchasePu(date_from, date_to, party_id, item_id, function (detail) {
        get_purchase_itemPu(
          date_from,
          date_to,
          party_id,
          item_id,
          function (purchase_item) {
            get_sumP(party_id, date_from, function (sum) {
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
                title: "ORDERS",
                party: party[0],
                items: purchase_item,
                detail: detail,
                opening_balance: sums,
                from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
                to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
                sub: "Credit (RS)",
                invoice_type: "OI",
                nar: "",
              };

              createInvoiceP(invoice1, "invoice.pdf");
            });
          }
        );
      });
    });
  } else {
    get_purchasePu(date_from, date_to, "", item_id, function (detail) {
      get_purchase_itemPu(
        date_from,
        date_to,
        "",
        item_id,
        function (purchase_item) {
          get_sumP("", date_from, function (sum) {
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
              title: "PURCHASE",
              items: purchase_item,
              detail: detail,
              opening_balance: sums,
              from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
              to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
              sub: "Credit (RS)",
              invoice_type: "PI",
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

get_partyPu = function (party_id, callback) {
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

get_purchasePu = function (date_from, date_to, party_id, item_id, callback) {
  if (party_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT DISTINCT purchase.purchase_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.receivable as received, invoice.payable as paid FROM trans_group, purchase_item, party_group, city_group, purchase,invoice where trans_group.trans_id=purchase.trans_id and invoice.purchase_id=purchase.purchase_id and city_group.city_id=party_group.city_id and purchase.party_id=party_group.party_id and purchase.status=1 and  purchase.purchase_id = purchase_item.purchase_id and purchase.date>=? and purchase.date<=? and purchase.party_id=? and purchase_item.item_id=? order by purchase.date ASC",
          [date_from, date_to, party_id, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT purchase.purchase_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.receivable as received, invoice.payable as paid FROM trans_group, party_group, city_group, purchase,invoice where trans_group.trans_id=purchase.trans_id and invoice.purchase_id=purchase.purchase_id and city_group.city_id=party_group.city_id and purchase.party_id=party_group.party_id and purchase.status=1 and purchase.date>=? and purchase.date<=? and purchase.party_id=? order by purchase.date ASC",
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
          "SELECT DISTINCT purchase.purchase_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.receivable as received, invoice.payable as paid FROM trans_group, purchase_item, party_group, city_group, purchase,invoice where trans_group.trans_id=purchase.trans_id and invoice.purchase_id=purchase.purchase_id and city_group.city_id=party_group.city_id and purchase.party_id=party_group.party_id and purchase.status=1 and  purchase.purchase_id = purchase_item.purchase_id and purchase.date>=? and purchase.date<=? and purchase_item.item_id=? order by party_name ASC, date ASC",
          [date_from, date_to, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "SELECT purchase.purchase_id as id,trans_name,bilty, party_name as party, address, cell , city_name as city, date, invoice.receivable as received, invoice.payable as paid FROM trans_group, party_group, city_group, purchase,invoice where trans_group.trans_id=purchase.trans_id and invoice.purchase_id=purchase.purchase_id and city_group.city_id=party_group.city_id and purchase.party_id=party_group.party_id and purchase.status=1 and purchase.date>=? and purchase.date<=? order by party_name ASC, date ASC",
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

get_purchase_itemPu = function (
  date_from,
  date_to,
  party_id,
  item_id,
  callback
) {
  if (party_id != "") {
    if (item_id && item_id != "") {
      db.connection.serialize(function () {
        db.connection.all(
          "Select purchase.purchase_id as id,ac_name,quantity,return_quantity,discount,batch,expiry,price,total,item_name as name from ac_group, item_group, purchase_item, purchase where item_group.ac_id = ac_group.ac_id and purchase_item.item_id=item_group.item_id and purchase_item.purchase_id=purchase.purchase_id and purchase.status=1 and purchase.date>=? and purchase.date<=? and purchase.party_id=? and purchase_item.item_id=? order by purchase.date ASC",
          [date_from, date_to, party_id, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select purchase.purchase_id as id, ac_name,quantity,discount,return_quantity,batch,expiry,price,total,item_name as name from item_group,ac_group, purchase_item, purchase where item_group.ac_id = ac_group.ac_id and purchase_item.item_id=item_group.item_id and purchase_item.purchase_id=purchase.purchase_id and purchase.status=1 and purchase.date>=? and purchase.date<=? and purchase.party_id=? order by purchase.date ASC",
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
          "Select purchase.purchase_id as id,ac_name,quantity,discount,return_quantity,batch,expiry,price,total,item_name as name from ac_group, item_group, purchase_item, purchase where item_group.ac_id = ac_group.ac_id and purchase_item.item_id=item_group.item_id and purchase_item.purchase_id=purchase.purchase_id and purchase.status=1 and purchase.date>=? and purchase.date<=? and purchase_item.item_id=? order by purchase.date ASC",
          [date_from, date_to, item_id],
          function (err, row) {
            callback(row);
          }
        );
      });
    } else {
      db.connection.serialize(function () {
        db.connection.all(
          "Select purchase.purchase_id as id,ac_name,quantity,discount,return_quantity,batch,expiry,price,total,item_name as name from ac_group, item_group, purchase_item, purchase where item_group.ac_id = ac_group.ac_id and purchase_item.item_id=item_group.item_id and purchase_item.purchase_id=purchase.purchase_id and purchase.status=1 and purchase.date>=? and purchase.date<=? order by purchase.date ASC",
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

get_sumP = function (party_id, date_from, callback) {
  if (party_id != "") {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(receivable) as sum from invoice, purchase where purchase.purchase_id = invoice.purchase_id and date > '2000-12-12' and purchase.party_id = ? and date < ?",
        [party_id, date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  } else {
    db.connection.serialize(function () {
      db.connection.all(
        "SELECT sum(receivable) as sum from invoice, purchase where purchase.purchase_id = invoice.purchase_id and date > '2000-12-12' and date < ?",
        [date_from],
        function (err, row) {
          callback(row);
        }
      );
    });
  }
};
