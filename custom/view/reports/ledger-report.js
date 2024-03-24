//Import the library into your project
var db = require("../../../util/database.js");
const { createInvoiceLe } = require("../invoice/report-for-ledger");

function downloadInvoiceL(date_from, date_to, party_id) {
  // -----------------------------------------------//

  get_partyL(party_id, function (party) {
    get_dateL(date_from, date_to, party_id, function (date) {
      get_purchaseL(date_from, date_to, party_id, function (purchase) {
        get_purchase_itemL(
          date_from,
          date_to,
          party_id,
          function (purchase_item) {
            get_saleL(date_from, date_to, party_id, function (sale) {
              get_sale_itemL(
                date_from,
                date_to,
                party_id,
                function (sale_item) {
                  get_paymentL(
                    date_from,
                    date_to,
                    party_id,
                    function (payment) {
                      get_payment_itemL(
                        date_from,
                        date_to,
                        party_id,
                        function (payment_item) {
                          get_receiptL(
                            date_from,
                            date_to,
                            party_id,
                            function (receipt) {
                              get_receipt_itemL(
                                date_from,
                                date_to,
                                party_id,
                                function (receipt_item) {
                                  get_sale_returnL(
                                    date_from,
                                    date_to,
                                    party_id,
                                    function (sale_return) {
                                      get_purchase_returnL(
                                        date_from,
                                        date_to,
                                        party_id,
                                        function (purchase_return) {
                                          opening_balance(
                                            date_from,
                                            date_to,
                                            party_id,
                                            purchase,
                                            purchase_item,
                                            sale,
                                            sale_item,
                                            payment,
                                            payment_item,
                                            receipt,
                                            receipt_item,
                                            party,
                                            date,
                                            purchase_return,
                                            sale_return
                                          );
                                        }
                                      );
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            });
          }
        );
      });
    });
  });
}
// -------------------------------------------------------- PARTY GROUP ---------------------------------- //

get_partyL = function (party_id, callback) {
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

// -------------------------------------------------------- DATE GROUP ---------------------------------- //

get_dateL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select date from purchase where date>=? and date<=? UNION SELECT date from sale where date>=? and date<=? UNION SELECT date FROM payment where date>=? and date<=? UNION SELECT date from receipt where date>=? and date<=? UNION SELECT return_date as date from sale_return where return_date>=? and return_date<=? UNION SELECT return_date as date from purchase_return where return_date>=? and return_date<=? ORDER by date ASC",
      [
        date_from,
        date_to,
        date_from,
        date_to,
        date_from,
        date_to,
        date_from,
        date_to,
        date_from,
        date_to,
        date_from,
        date_to,
      ],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_saleL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT sale.sale_id as id,trans_name,bilty, date, invoice.payable as credit, invoice.receivable as debit FROM trans_group, sale,invoice where trans_group.trans_id=sale.trans_id and invoice.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? order by sale.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

get_sale_returnL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT ac_group.ac_name,item_group.item_name,sale_item.price, sale_item.discount,sale_return.return_total as credit, sale_return.return_quantity as quantity, sale_return.comment,  sale_return.return_date as date, sale_item.sale_id as id from ac_group, item_group, purchase_item,sale_item, sale_return, sale where sale_item.purchase_item_id = purchase_item.purchase_item_id and sale_item.sale_item_id = sale_return.sale_item_id and item_group.item_id = purchase_item.item_id and ac_group.ac_id = item_group.ac_id and sale.sale_id = sale_item.sale_id and sale_return.return_date >=? and sale_return.return_date<=? and sale.party_id = ? order by sale_return.return_date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

get_purchase_returnL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT ac_group.ac_name,item_group.item_name,purchase_item.price, purchase_item.discount,purchase_return.return_total as debit, purchase_return.return_quantity as quantity, purchase_return.comment, purchase_return.return_date as date, purchase_item.purchase_id as id from ac_group, item_group, purchase_item, purchase_return, purchase where purchase_item.purchase_item_id = purchase_return.purchase_item_id and item_group.item_id = purchase_item.item_id and ac_group.ac_id = item_group.ac_id and purchase.purchase_id = purchase_item.purchase_id and purchase_return.return_date >=? and purchase_return.return_date<=? and purchase.party_id = ? ORDER BY purchase_return.return_date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_sale_itemL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select sale.sale_id as id, ac_name,sale_item.quantity,sale_item.discount,sale_item.price,sale_item.total,item_name as name from ac_group, item_group, sale_item, purchase_item, sale where item_group.ac_id = ac_group.ac_id and purchase_item.purchase_item_id=sale_item.purchase_item_id and purchase_item.item_id=item_group.item_id and sale_item.sale_id=sale.sale_id and sale.status=1 and sale.date>=? and sale.date<=? and sale.party_id=? order by sale.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_purchaseL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT purchase.purchase_id as id,bilty,bilty, date, invoice.payable as credit, invoice.receivable as debit FROM purchase,invoice where invoice.purchase_id=purchase.purchase_id and purchase.status=1 and purchase.date>=? and purchase.date<=? and purchase.party_id=? order by purchase.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_purchase_itemL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select purchase.purchase_id as id,quantity,discount,price,total,item_name as name from item_group, purchase_item, purchase where purchase_item.item_id=item_group.item_id and purchase_item.purchase_id=purchase.purchase_id and purchase.status=1 and purchase.date>=? and purchase.date<=? and purchase.party_id=? order by purchase.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_paymentL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT payment.payment_id as id, date, paid as debit,received as credit FROM payment,invoice_pay where invoice_pay.payment_id=payment.payment_id and payment.status=1 and payment.date>=? and payment.date<=? and payment.party_id=? order by payment.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_payment_itemL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select payment.payment_id as id,bank_name,comment,amount from bank_group, payment_item, payment where bank_group.bank_id=payment_item.bank and payment_item.payment_id=payment.payment_id and payment.status=1 and payment.date>=? and payment.date<=? and payment.party_id=? order by payment.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_receiptL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT receipt.receipt_id as id, date, paid as debit,received as credit FROM receipt,invoice_pay where invoice_pay.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt.party_id=? order by receipt.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_receipt_itemL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select receipt.receipt_id as id,bank_name,comment,amount from bank_group, receipt_item,receipt where bank_group.bank_id=receipt_item.bank and receipt_item.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date>=? and receipt.date<=? and receipt.party_id=? order by receipt.date ASC",
      [date_from, date_to, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// ---------------------------------------------------------------------------------------------------------------------- //

// -------------------------------------------------------- DATE GROUP ---------------------------------- //

get_datePL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "Select date from purchase where date>='1800-01-01' and date<? UNION SELECT date from sale where date>='1800-01-01' and date<? UNION SELECT date FROM payment where date>='1800-01-01' and date<? UNION SELECT date from receipt where date>='1800-01-01' and date<? UNION SELECT return_date as date from purchase_return where return_date>='1800-01-01' and return_date<? UNION SELECT return_date as date from sale_return where return_date>='1800-01-01' and return_date<? ORDER by date ASC",
      [date_from, date_from, date_from, date_from, date_from, date_from],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_salePL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT sale.sale_id as id, date, invoice.payable as credit, invoice.receivable as debit FROM sale,invoice where invoice.sale_id=sale.sale_id and sale.status=1 and sale.date >= '1800-01-01' and sale.date<? and sale.party_id=? order by sale.date ASC",
      [date_from, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

get_sale_returnPL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT sale_item.sale_id as id, sale_return.return_date as date, sale_return.return_total as credit from sale_item, sale_return,sale where sale_item.sale_id = sale.sale_id and sale_item.sale_item_id = sale_return.sale_item_id and sale_return.return_date >= '1800-01-01' and sale_return.return_date<? and sale.party_id=? order by sale_return.return_date ASC",
      [date_from, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

get_purchase_returnPL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT purchase_item.purchase_id as id, purchase_return.return_date as date, purchase_return.return_total as debit from purchase_item, purchase_return,purchase where purchase_item.purchase_id = purchase.purchase_id and purchase_item.purchase_item_id = purchase_return.purchase_item_id and purchase_return.return_date >= '1800-01-01' and purchase_return.return_date<? and purchase.party_id=? order by purchase_return.return_date ASC",
      [date_from, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_purchasePL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT purchase.purchase_id as id, date, invoice.payable as credit, invoice.receivable as debit FROM purchase,invoice where invoice.purchase_id=purchase.purchase_id and purchase.date >= '1800-01-01' and purchase.status=1 and purchase.date<? and purchase.party_id=? order by purchase.date ASC",
      [date_from, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_paymentPL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT payment.payment_id as id, date, paid as debit,received as credit FROM payment,invoice_pay where invoice_pay.payment_id=payment.payment_id and payment.status=1 and payment.date >= '1800-01-01' and payment.date<? and payment.party_id=? order by payment.date ASC",
      [date_from, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// --------------------------------------------------------

get_receiptPL = function (date_from, date_to, party_id, callback) {
  db.connection.serialize(function () {
    db.connection.all(
      "SELECT receipt.receipt_id as id, date, paid as debit,received as credit FROM receipt,invoice_pay where invoice_pay.receipt_id=receipt.receipt_id and receipt.status=1 and receipt.date >= '1800-01-01' and  receipt.date<? and receipt.party_id=? order by receipt.date ASC",
      [date_from, party_id],
      function (err, row) {
        callback(row);
      }
    );
  });
};

// -----------------------------------------------------------

function opening_balance(
  date_from,
  date_to,
  party_id,
  purchase1,
  purchase_item1,
  sale1,
  sale_item1,
  payment1,
  payment_item1,
  receipt1,
  receipt_item1,
  party1,
  date1,
  purchase_return1,
  sale_return1
) {
  let i, d;

  get_datePL(date_from, date_to, party_id, function (date) {
    get_purchasePL(date_from, date_to, party_id, function (purchase) {
      get_salePL(date_from, date_to, party_id, function (sale) {
        get_paymentPL(date_from, date_to, party_id, function (payment) {
          get_receiptPL(date_from, date_to, party_id, function (receipt) {
            get_sale_returnPL(
              date_from,
              date_to,
              party_id,
              function (sale_return) {
                get_purchase_returnPL(
                  date_from,
                  date_to,
                  party_id,
                  function (purchase_return) {
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

                    var opening_balance = 0;
                    var opening_type = "CR";

                    for (d = 0; d < date.length; d++) {
                      for (i = 0; i < purchase_return.length; i++) {
                        if (purchase_return[i].date == date[d].date) {
                          const details = purchase_return[i];

                          var outBalance = calculateBalance(
                            details.debit,
                            0,
                            opening_balance,
                            opening_type
                          );
                          opening_balance = outBalance.final_balance;
                          opening_type = outBalance.final_type;
                        }
                      }

                      for (i = 0; i < sale_return.length; i++) {
                        if (sale_return[i].date == date[d].date) {
                          const details = sale_return[i];

                          var outBalance = calculateBalance(
                            0,
                            details.credit,
                            opening_balance,
                            opening_type
                          );
                          opening_balance = outBalance.final_balance;
                          opening_type = outBalance.final_type;
                        }
                      }

                      for (i = 0; i < purchase.length; i++) {
                        if (purchase[i].date == date[d].date) {
                          const details = purchase[i];

                          var outBalance = calculateBalance(
                            details.debit,
                            details.credit,
                            opening_balance,
                            opening_type
                          );
                          opening_balance = outBalance.final_balance;
                          opening_type = outBalance.final_type;
                        }
                      }

                      for (i = 0; i < sale.length; i++) {
                        if (sale[i].date == date[d].date) {
                          const details = sale[i];

                          var outBalance = calculateBalance(
                            details.debit,
                            details.credit,
                            opening_balance,
                            opening_type
                          );
                          opening_balance = outBalance.final_balance;
                          opening_type = outBalance.final_type;
                        }
                      }

                      for (i = 0; i < payment.length; i++) {
                        if (payment[i].date == date[d].date) {
                          const details = payment[i];

                          var outBalance = calculateBalance(
                            details.debit,
                            details.credit,
                            opening_balance,
                            opening_type
                          );
                          opening_balance = outBalance.final_balance;
                          opening_type = outBalance.final_type;
                        }
                      }

                      for (i = 0; i < receipt.length; i++) {
                        if (receipt[i].date == date[d].date) {
                          const details = receipt[i];

                          var outBalance = calculateBalance(
                            details.debit,
                            details.credit,
                            opening_balance,
                            opening_type
                          );
                          opening_balance = outBalance.final_balance;
                          opening_type = outBalance.final_type;
                        }
                      }
                    }

                    const invoice1 = {
                      title: "LEDGER",
                      party: party1[0],
                      from_date: d_f1 + "-" + d_f2 + "-" + d_from.getFullYear(),
                      to_date: d_t1 + "-" + d_t2 + "-" + d_to.getFullYear(),
                      opening_balance: opening_balance,
                      opening_type: opening_type,
                      dates: date1,

                      purchase_item: purchase_item1,
                      purchase_detail: purchase1,
                      purchase_return: purchase_return1,

                      sale_item: sale_item1,
                      sale_detail: sale1,
                      sale_return: sale_return1,

                      payment_item: payment_item1,
                      payment_detail: payment1,

                      receipt_item: receipt_item1,
                      receipt_detail: receipt1,
                    };

                    createInvoiceLe(invoice1, "invoice.pdf");
                  }
                );
              }
            );
          });
        });
      });
    });
  });
}

function calculateBalance(debit, credit, balance, type) {
  if (!debit) {
    debit = 0;
  }
  if (!credit) {
    credit = 0;
  }

  debit = parseInt(debit);
  credit = parseInt(credit);

  console.log("debit: " + debit);
  console.log("credit: " + credit);
  console.log("balance: " + balance);
  console.log("type: " + type);

  var balanceCr = 0;
  var balanceDe = 0;
  var final_type = "";
  var final_balance = 0;

  if (type == "CR") {
    balanceCr = balance;
  } else {
    balanceDe = balance;
  }

  console.log("balanceCr: " + balanceCr);
  console.log("balanceDe: " + balanceDe);

  if (balanceCr > 0) {
    if (debit > 0 && debit <= balanceCr) {
      final_balance = balanceCr - debit;
      final_type = "CR";
    } else if (debit > 0 && debit > balanceCr) {
      final_balance = debit - balanceCr;
      final_type = "DR";
    } else if (credit > 0) {
      final_balance = balanceCr + credit;
      final_type = "CR";
    }
  } else {
    if (credit > 0 && credit <= balanceDe) {
      final_balance = balanceDe - credit;
      final_type = "DR";
    } else if (credit > 0 && credit > balanceDe) {
      final_balance = credit - balanceDe;
      final_type = "CR";
    } else if (debit > 0) {
      final_balance = balanceDe + debit;
      final_type = "DR";
    }
  }

  console.log("final_balance: " + final_balance);
  console.log("final_type: " + final_type);

  if (debit == 0 && credit == 0) {
    final_balance = balance;
    final_type = type;
  }

  return {
    final_balance: final_balance,
    final_type: final_type,
  };
}
