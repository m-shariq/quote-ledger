const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");
const FileSaver = require("file-saver");

function createInvoiceLe(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 10 });
  var stream = doc.pipe(blobStream());
  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  doc.end();

  stream.on("finish", function () {
    var blob = stream.toBlob("application/pdf");
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  });


  
  // stream.on("finish", function () {
  //   var blob = stream.toBlob("application/pdf");
  //   var blobURL = URL.createObjectURL(blob);
  //   var params = ["height=" + screen.height, "width=" + screen.width];
  //   window.open(blobURL, "report", params);
  // });
}

function generateHeader(doc, invoice) {
  doc
    .fillColor("#e60000")
    .fontSize(17)
    .text(invoice.title, 50, 30)
    .fontSize(11)
    .fillColor("#00802b")
    .text("FROM: " + invoice.from_date, 420, 43)
    .text("TO: " + invoice.to_date, 420, 63)
    .fillColor("#000000")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(
      "Opening Balance:    RS " +
        invoice.opening_balance +
        "(" +
        invoice.opening_type +
        ")",
      370,
      103
    )
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(invoice.party.party, 50, 73)
    .font("Helvetica")
    .text(invoice.party.address, 50, 73 + 15)
    .text(invoice.party.city + ", " + invoice.party.cell, 50, 73 + 30);
  generateHr(doc, 73 + 50);
}

// MAIN WORK
function generateInvoiceTable(doc, invoice) {
  let i, j, d;
  let x = 0;
  let invoiceTableTop = 73 + 55;

  var opening_balance = invoice.opening_balance;
  var opening_type = invoice.opening_type;

  doc.font("Helvetica-Bold");

  generateTableRow(
    doc,
    invoiceTableTop,
    "Inv.",
    "Date",
    "Naration",
    "Debit (RS)",
    "Credit (RS)",
    "Balance (RS)",
    "",
    ""
  );

  generateHr(doc, invoiceTableTop + 10);
  doc.font("Helvetica");

  // ----------------------------------- //--------------------------------------------------//

  for (d = 0; d < invoice.dates.length; d++) {
    for (i = 0; i < invoice.purchase_detail.length; i++) {
      if (invoice.purchase_detail[i].date == invoice.dates[d].date) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }

        const details = invoice.purchase_detail[i];
        let position = invoiceTableTop + (x + 1) * 15;

        var outBalance = calculateBalance(
          details.debit,
          details.credit,
          opening_balance,
          opening_type
        );
        opening_balance = outBalance.final_balance;
        opening_type = outBalance.final_type;

        generateTableRow(
          doc,
          position,
          details.id,
          details.date,
          "Trans: " + details.trans_name + " , Bilty #: " + details.bilty,
          check(details.debit),
          check(details.credit),
          opening_balance,
          "PI",
          opening_type
        );
        for (j = 0; j < invoice.purchase_item.length; j++) {
          const items = invoice.purchase_item[j];
          if (details.id == items.id) {
            if (invoiceTableTop + (x + 1) * 15 > 770) {
              doc.addPage();
              invoiceTableTop = 30;
              x = 0;
            }
            x++;
            position = invoiceTableTop + (x + 1) * 15;

            generateTableInnerRowPurchase(
              doc,
              position,
              items.name,
              items.ac_name,
              items.quantity,
              items.price,
              items.discount,
              items.total
            );
          }
        }
        x++;
        generateHr(doc, position + 10);
      }
    }

    for (i = 0; i < invoice.purchase_return.length; i++) {
      if (invoice.purchase_return[i].date == invoice.dates[d].date) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }

        const details = invoice.purchase_return[i];
        let position = invoiceTableTop + (x + 1) * 15;

        var outBalance = calculateBalance(
          details.debit,
          0,
          opening_balance,
          opening_type
        );
        opening_balance = outBalance.final_balance;
        opening_type = outBalance.final_type;

        generateTableRow(
          doc,
          position,
          details.id,
          details.date,
          "Return against P Inv # " + details.id,
          check(details.debit),
          check(0),
          opening_balance,
          "RPI",
          opening_type
        );

        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }
        x++;
        position = invoiceTableTop + (x + 1) * 15;

        generateTableInnerRowPurchase(
          doc,
          position,
          details.item_name,
          details.ac_name,
          details.quantity,
          details.price,
          details.discount,
          details.debit + "      " + "NOTE: " + details.comment
        );
        x++;
        generateHr(doc, position + 10);
      }
    }

    for (i = 0; i < invoice.sale_detail.length; i++) {
      if (invoice.sale_detail[i].date == invoice.dates[d].date) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }

        const details = invoice.sale_detail[i];
        let position = invoiceTableTop + (x + 1) * 15;

        var outBalance = calculateBalance(
          details.debit,
          details.credit,
          opening_balance,
          opening_type
        );
        opening_balance = outBalance.final_balance;
        opening_type = outBalance.final_type;

        generateTableRow(
          doc,
          position,
          details.id,
          details.date,
          "Trans: " + details.trans_name + " , Bilty #: " + details.bilty,
          check(details.debit),
          check(details.credit),
          opening_balance,
          "SI",
          opening_type
        );
        for (j = 0; j < invoice.sale_item.length; j++) {
          const items = invoice.sale_item[j];
          if (details.id == items.id) {
            if (invoiceTableTop + (x + 1) * 15 > 770) {
              doc.addPage();
              invoiceTableTop = 30;
              x = 0;
            }
            x++;
            position = invoiceTableTop + (x + 1) * 15;

            generateTableInnerRowPurchase(
              doc,
              position,
              items.name,
              items.ac_name,
              items.quantity,
              items.price,
              items.discount,
              items.total
            );
          }
        }
        x++;
        generateHr(doc, position + 10);
      }
    }

    for (i = 0; i < invoice.sale_return.length; i++) {
      if (invoice.sale_return[i].date == invoice.dates[d].date) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }

        const details = invoice.sale_return[i];
        let position = invoiceTableTop + (x + 1) * 15;

        var outBalance = calculateBalance(
          0,
          details.credit,
          opening_balance,
          opening_type
        );
        opening_balance = outBalance.final_balance;
        opening_type = outBalance.final_type;

        generateTableRow(
          doc,
          position,
          details.id,
          details.date,
          "Return against S Inv # " + details.id,
          check(0),
          check(details.credit),
          opening_balance,
          "RSI",
          opening_type
        );

        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }
        x++;
        position = invoiceTableTop + (x + 1) * 15;

        generateTableInnerRowPurchase(
          doc,
          position,
          details.item_name,
          details.ac_name,
          details.quantity,
          details.price,
          details.discount,
          details.credit + "      " + "NOTE: " + details.comment
        );
        x++;
        generateHr(doc, position + 10);
      }
    }

    for (i = 0; i < invoice.payment_detail.length; i++) {
      if (invoice.payment_detail[i].date == invoice.dates[d].date) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }

        const details = invoice.payment_detail[i];
        let position = invoiceTableTop + (x + 1) * 15;

        var outBalance = calculateBalance(
          details.debit,
          details.credit,
          opening_balance,
          opening_type
        );
        opening_balance = outBalance.final_balance;
        opening_type = outBalance.final_type;

        generateTableRow(
          doc,
          position,
          details.id,
          details.date,
          "",
          check(details.debit),
          check(details.credit),
          opening_balance,
          "PYI",
          opening_type
        );
        for (j = 0; j < invoice.payment_item.length; j++) {
          const items = invoice.payment_item[j];
          if (details.id == items.id) {
            if (invoiceTableTop + (x + 1) * 15 > 770) {
              doc.addPage();
              invoiceTableTop = 30;
              x = 0;
            }
            x++;
            position = invoiceTableTop + (x + 1) * 15;

            generateTableInnerRowPayment(
              doc,
              position,
              items.bank_name,
              items.comment,
              items.amount
            );
          }
        }
        x++;
        generateHr(doc, position + 10);
      }
    }

    for (i = 0; i < invoice.receipt_detail.length; i++) {
      if (invoice.receipt_detail[i].date == invoice.dates[d].date) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }

        const details = invoice.receipt_detail[i];
        let position = invoiceTableTop + (x + 1) * 15;

        var outBalance = calculateBalance(
          details.debit,
          details.credit,
          opening_balance,
          opening_type
        );
        opening_balance = outBalance.final_balance;
        opening_type = outBalance.final_type;

        generateTableRow(
          doc,
          position,
          details.id,
          details.date,
          "",
          check(details.debit),
          check(details.credit),
          opening_balance,
          "RI",
          opening_type
        );
        for (j = 0; j < invoice.receipt_item.length; j++) {
          const items = invoice.receipt_item[j];
          if (details.id == items.id) {
            if (invoiceTableTop + (x + 1) * 15 > 770) {
              doc.addPage();
              invoiceTableTop = 30;
              x = 0;
            }
            x++;
            position = invoiceTableTop + (x + 1) * 15;

            generateTableInnerRowPayment(
              doc,
              position,
              items.bank_name,
              items.comment,
              items.amount
            );
          }
        }
        x++;
        generateHr(doc, position + 10);
      }
    }
  }

  if (invoiceTableTop + (x + 1) * 15 > 770) {
    doc.addPage();
    invoiceTableTop = 30;
    x = 0;
  }
  const duePosition = invoiceTableTop + (x + 1) * 15 + 10;
  doc.font("Helvetica-Bold").fontSize(10);
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "",
    "",
    "TOTAL: (RS)",
    opening_balance + " (" + opening_type + ") /-",
    "",
    ""
  );
  doc.font("Helvetica");
}

// EXTRA FUNCTIONS

function generateTableRow(
  doc,
  y,
  invoice,
  date,
  naration,
  debit,
  credit,
  balance,
  title,
  type
) {
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(title + invoice, 50, y)
    .text(date, 90, y, { width: 100, align: "left" })
    .text(naration, 155, y, { width: 300 })
    .text(debit, 285, y, { width: 100, align: "right" })
    .text(credit, 365, y, { width: 100, align: "right" })
    .text(balance == "Balance (RS)"? 'Balance (RS)' : parseFloat(balance).toFixed(2) + " " + type, 440, y, { width: 100, align: "right" });
}

function generateTableInnerRowPurchase(
  doc,
  y,
  name,
  ac,
  quantity,
  price,
  discount,
  total
) {
  doc
    .fontSize(7)
    .font("Helvetica-Bold")
    .fillColor("#392714")
    .text(name + " - " + ac, 80, y, { width: 200, align: "left" })
    .text("Q: " + quantity, 260, y, { width: 30, align: "left" })
    .text("RS. " + price + "/Q", 290, y, { width: 100, align: "left" })
    .text("D: " + discount + "%", 340, y, { width: 35, align: "left" })
    .text("RS. " + total, 380, y, { align: "left" })
    .fillColor("#000000");
}

function generateTableInnerRowPayment(doc, y, bank, comment, amount) {
  doc
    .fontSize(7)
    .font("Helvetica-Bold")
    .fillColor("#392714")
    .text(bank, 80, y, { width: 40, align: "left" })
    .text(comment, 120, y, { width: 220, align: "left" })
    .text("RS. " + amount, 360, y, { width: 100, align: "left" })
    .fillColor("#000000");
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function calculateBalance(debit, credit, balance, type) {
  if (!debit) {
    debit = 0;
  }
  if (!credit) {
    credit = 0;
  }

  debit = Number(debit);
  credit = Number(credit);
  balance = Number(balance);

  if (credit == 0 && debit == 0) {
    return { final_balance: balance, final_type: type };
  }

  var balanceCr = 0;
  var balanceDe = 0;
  var final_type = "";
  var final_balance = 0;

  if (type == "CR") {
    balanceCr = balance;
  } else {
    balanceDe = balance;
  }

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

  return {
    final_balance: final_balance,
    final_type: final_type,
  };
}

function check(cents) {
  if (cents) {
    return cents;
  } else {
    return 0;
  }
}

module.exports = {
  createInvoiceLe,
};
