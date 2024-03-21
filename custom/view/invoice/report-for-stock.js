const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");
const FileSaver = require("file-saver");

function createInvoiceStock(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  console.log(invoice);

  var stream = doc.pipe(blobStream());

  generateHeader(doc, invoice);
  if (invoice.nar == "") {
    generateCustomerInformation(doc, invoice);
  }
  generateInvoiceTable(doc, invoice);

  doc.end();
  // stream.on("finish", function () {
  //   var blob = stream.toBlob("application/pdf");
  //   var blobURL = URL.createObjectURL(blob);

  //   var params = ["height=" + screen.height, "width=" + screen.width];
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
    .fillColor("#00802b")
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
  let i;
  let x = 0;
  let invoiceTableTop = 73;
  if (invoice.nar == "") {
    invoiceTableTop = 73 + 55;
  }

  doc.font("Helvetica-Bold");
  if (invoice.nar != "") {
    generateTableRow(
      doc,
      invoiceTableTop,
      "Item code",
      "Item Name",
      "Party Name",
      "Quantity",
      true
    );
  } else {
    generateTableRow(
      doc,
      invoiceTableTop,
      "Item code",
      "Item Name",
      "",
      "Quantity",
      false
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

    let position = invoiceTableTop + (x + 1) * 15;
    console.log(i, position);

    if (invoice.nar != "") {
      generateTableRow(
        doc,
        position,
        details.item_id,
        details.item_name,
        details.party_name,
        details.avl_qty,
        true
      );
    } else {
      generateTableRow(
        doc,
        position,
        details.item_id,
        details.item_name,
        "",
        details.avl_qty,
        false
      );
    }
    x++;

    generateHr(doc, position + 10);
  }

  if (invoiceTableTop + (x + 1) * 15 > 770) {
    doc.addPage();
    invoiceTableTop = 30;
    x = 0;
  }

  doc.font("Helvetica");
}

function generateTableRow(
  doc,
  y,
  item_code,
  item_name,
  party_name,
  avl_qty,
  is_party
) {
  if (is_party) {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(party_name, 50, y)
      .text(item_code, 220, y)
      .text(item_name, 270, y)
      .text(avl_qty, 470, y);
  } else {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(item_code, 50, y)
      .text(item_name, 130, y)
      .text(avl_qty, 400, y);
  }
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

module.exports = {
  createInvoiceStock,
};
