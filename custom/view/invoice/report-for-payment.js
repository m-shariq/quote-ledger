const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");
const FileSaver = require("file-saver");

function createInvoice(invoice, path) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const stream = doc.pipe(blobStream());

  generateHeader(doc, invoice);
  if (invoice.nar == "") {
    generateCustomerInformation(doc, invoice);
  }
  generateInvoiceTable(doc, invoice);
  generateFooter(doc, invoice);

  doc.end();
  // stream.on("finish", function () {
  //   const blob = stream.toBlob("application/pdf");
  //   const blobURL = URL.createObjectURL(blob);

  //   const params = ["height=" + screen.height, "width=" + screen.width];
  //   console.log(blobURL);
  //   window.open(blobURL, "report", params);

  //   // FileSaver.saveAs(blob, 'MyFile.pdf');
  // });
  stream.on("finish", function () {
    var blob = stream.toBlob("application/pdf");
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  });
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
    .text("Opening Balance:    RS " + invoice.opening_balance, 380, 103)
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

function generateInvoiceTable(doc, invoice) {
  let a = 0,
    b = 0,
    c;
  let i, j;
  let x = 0;
  let invoiceTableTop = 73 + 55;

  doc.font("Helvetica-Bold");
  if (invoice.nar != "") {
    generateTableRow(
      doc,
      invoiceTableTop,
      "Inv.",
      "Date",
      "Party Name",
      "",
      invoice.sub,
      "Total (RS)"
    );
  } else {
    generateTableRow(
      doc,
      invoiceTableTop,
      "Inv.",
      "Date",
      "Naration",
      "",
      invoice.sub,
      "Total (RS)"
    );
  }
  generateHr(doc, invoiceTableTop + 10);
  doc.font("Helvetica");

  for (i = 0; i < invoice.detail.length; i++) {
    if (invoiceTableTop + (x + 1) * 15 > 770) {
      doc.addPage();
      invoiceTableTop = 30;
      x = 0;
    }

    const details = invoice.detail[i];

    if (details.p) {
      a += Number(details.p);
    } else b += Number(details.r);

    if (a > 0) {
      c = a;
    } else {
      c = b;
    }

    let position = invoiceTableTop + (x + 1) * 15;
    console.log(i, position);

    if (invoice.nar != "") {
      generateTableRow(
        doc,
        position,
        details.id,
        details.date,
        details.party,
        invoice.invoice_type,
        check(details.r),
        c
      );
    } else {
      generateTableRow(
        doc,
        position,
        details.id,
        details.date,
        "",
        invoice.invoice_type,
        check(details.r),
        c
      );
    }

    for (j = 0; j < invoice.items.length; j++) {
      const items = invoice.items[j];
      if (details.id == items.id) {
        if (invoiceTableTop + (x + 1) * 15 > 770) {
          doc.addPage();
          invoiceTableTop = 30;
          x = 0;
        }
        x++;
        position = invoiceTableTop + (x + 1) * 15;

        generateTableInnerRow(
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

  if (invoiceTableTop + (x + 1) * 15 > 770) {
    doc.addPage();
    invoiceTableTop = 30;
    x = 0;
  }

  const duePosition = invoiceTableTop + (x + 1) * 15 + 10;
  doc.font("Helvetica-Bold").fontSize(10);
  generateTableRow(doc, duePosition, "", "", "", "", "TOTAL: (RS)", b + " /-");
  x++;
  if (invoiceTableTop + (x + 1) * 15 > 770) {
    doc.addPage();
    invoiceTableTop = 30;
    x = 0;
  }
  const duePosition1 = invoiceTableTop + (x + 1) * 15 + 10;
  doc.font("Helvetica-Bold").fontSize(10);
  generateTableRow(
    doc,
    duePosition1,
    "",
    "",
    "",
    "",
    "Opening Balance: (RS)",
    "+ " + invoice.opening_balance + " /-"
  );

  x++;
  if (invoiceTableTop + (x + 1) * 15 > 770) {
    doc.addPage();
    invoiceTableTop = 30;
    x = 0;
  }
  const duePosition2 = invoiceTableTop + (x + 1) * 15 + 10;
  doc.font("Helvetica-Bold").fontSize(10);
  generateTableRow(
    doc,
    duePosition2,
    "",
    "",
    "",
    "",
    "Grand Total: (RS)",
    balanceTotal(invoice) + " /-"
  );
  doc.font("Helvetica");
}

function generateFooter(doc, invoice) {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("", 0, 750, { align: "right", width: 500 })

    .text("", 50, 750, { align: "right", width: 500 })

    .text("", 50, 750, { align: "left", width: 500 });
}

function generateTableRow(
  doc,
  y,
  invoice,
  date,
  naration,
  debit,
  credit,
  balance
) {
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(debit + invoice, 50, y)
    .text(date, 35, y, { width: 100, align: "right" })
    .text(naration, 155, y, { width: 300 })
    .text("", 285, y, { width: 0, align: "right" })
    .text(credit, 365, y, { width: 100, align: "right" })
    .text(balance == "Total (RS)"? 'Total (RS)' : parseFloat(balance).toFixed(2) , 440, y, { width: 100, align: "right" });
}

function generateTableInnerRow(doc, y, bank, comment, amount) {
  doc
    .fontSize(7)
    .font("Helvetica-Bold")
    .fillColor("#392714")
    .text(bank, 110, y, { width: 40, align: "left" })
    .text(comment, 150, y, { width: 230, align: "left" })
    .text("RS. " + amount, 380, y, { width: 50, align: "left" })
    .fillColor("#000000");
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function balanceTotal(invoice) {
  let a = 0,
    b = invoice.opening_balance,
    c = 0;
  for (i = 0; i < invoice.detail.length; i++) {
    const details = invoice.detail[i];

    if (details.p) {
      if (details.p != "0") {
        a += Number(details.p);
      }
    } else {
      if (details.r != "0") {
        b += Number(details.r);
      }
    }

    if (a > 0) {
      c = a;
    } else {
      c = b;
    }
  }
  if (invoice.detail.length > 0) {
    return c;
  } else {
    return b;
  }
}

function check(cents) {
  if (cents) {
    return cents;
  } else {
    return 0;
  }
}

module.exports = {
  createInvoice,
};
