const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");
const FileSaver = require("file-saver");
const { net } = require("electron");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 15 });

  doc.roundedRect(50, 120, 505, 90, 4).fill("#fcf0e0").fillColor("#444444");
  doc.roundedRect(50, 230, 506, 30, 1).fill("#e1792f").fillColor("#444444");

  var stream = doc.pipe(blobStream());

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

  doc.end();
  stream.on("finish", function () {
    var blob = stream.toBlob("application/pdf");
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  });
}

function generateHeader(doc) {
  doc
    .fillColor("#ed7f35")
    .fontSize(20)
    .text("MECHATRONICS", 50, 40)
    .fontSize(12)
    .text("Engineering Works", 50, 60)
    .fontSize(10)
    .fillColor("#444444")
    .text("Faisalabad, Pakistan, +92 300 966 7709", 50, 80)
    .text("Email: mechatronic78@gmail.com", 50, 95)
    .text("", 50, 80)
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  var top = 0;
  top = 90;
  if (invoice.warranty == "yes") {
    doc
      .font("Helvetica-Bold")
      .fillColor("#ed7f35")
      .fontSize(20)
      .text("Quotation", 450, 45)
      .font("Helvetica")
      .fillColor("#444444");
  } else {
    doc
      .font("Helvetica-Bold")
      .fillColor("#ed7f35")
      .fontSize(20)
      .text("Invoice", 450, 45)
      .font("Helvetica")
      .fillColor("#444444");
  }

  const customerInformationTop = top + 40;

  doc
    .fontSize(10)
    .text("Quotation Number:", 53, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.purchase.id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Quotation Date:", 53, customerInformationTop + 15)
    .text(invoice.purchase.date, 150, customerInformationTop + 15)

    .font("Helvetica-Bold")
    .text(invoice.shipping.party, 350, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 350, customerInformationTop + 15)
    .text(
      invoice.shipping.city + ", " + invoice.shipping.cell,
      350,
      customerInformationTop + 68
    )
    .moveDown();

  // generateHr(doc, customerInformationTop + 80);
}

function generateInvoiceTable(doc, invoice) {
  let i = 0;
  let x;

  var invoiceTableTop = 240;

  doc.font("Helvetica-Bold").fillColor("#FFFFFF");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "",
    "",
    "",
    "Qty",
    "Price (RS)",
    "Disc.",
    "Total (RS)",
    ""
  );
  doc.font("Helvetica").fillColor("#444444");

  var position = 0;
  var price_t = 0;
  var height = 0;
  invoiceTableTop = invoiceTableTop + 30;

  for (x = 0; x < invoice.items.length; x++) {
    const item = invoice.items[x];

    if (x == 0 && invoice.items.length == 1) {
      position = invoiceTableTop;
      height = Math.ceil(doc.heightOfString(item.ac_name));
      invoiceTableTop = invoiceTableTop + height + 30;
    } else if (x == 0 && invoice.items.length > 1) {
      position = invoiceTableTop;
      height = Math.ceil(doc.heightOfString(item.ac_name));
      invoiceTableTop = invoiceTableTop + 30;
    } else {
      position = invoiceTableTop + height;
      invoiceTableTop = invoiceTableTop + height + 30;
      height = Math.ceil(doc.heightOfString(item.ac_name));
    }

    doc.font("Helvetica");
    generateTableRow(
      doc,
      position,
      item.name,
      item.ac_name,
      "",
      "",
      item.quantity,
      formatCurrency(item.price),
      item.discount,
      formatCurrency(item.total),
      ""
    );

    price_t = price_t + parseFloat(item.total);
    i++;
    console.log("Position: " + position);
    console.log("Top: " + invoiceTableTop);
    // if (invoice.items.length > 1 && x > 0) {
      generateHr(doc, position + 23 + height);
    // }
  }

  const subtotalPosition = position + 30 + height
  console.log("Subtotal Position: " + subtotalPosition);
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "",
    "",
    "Subtotal (RS)",
    "",
    price_t.toFixed(2),
    ""
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "",
    "",
    "",
    "Paid To Date (RS)",
    "",
    "0",
    ""
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "",
    "",
    "",
    "Balance Due (RS)",
    "",
    price_t.toFixed(2),
    ""
  );
  doc.font("Helvetica");

  const termsPosition = duePosition + 25;
  doc
    .fillColor("#ed7f35")
    .fontSize(14)
    .text("Terms & Conditions", 50, termsPosition)
    .fontSize(10)
    .fillColor("#444444")
    .text("I. Payment Schedule:", 53)
    .text("1. 50% Advance payment", 60)
    .text("2. 45% At the time of delivery", 60)
    .text("3. 5% After delivery", 60)
    .text("II. One Month after sale service", 53)
    .text(
      "III. The delivery time of 3 months is dependent on the payment schedule mentioned above.",
      53
    )
    .text(
      "IV. There is no warranty for the electrical parts of the machine.",
      53
    )
    .fillColor("#ffffff")
    .text(".", 53)
    .text(".", 53)
    .text(".", 53)
    .fillColor("#444444")
    .text("Authorized Signature", 440)
    .text("", 50, 80)
    .moveDown();
}

function generateTableRow(
  doc,
  y,
  item,
  ac,
  batch,
  expiry,
  quantity,
  price,
  discount,
  total,
  return_quantity
) {
  if (ac == "") {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(item, 53, y)
      .text(batch, 180, y, { width: 100, align: "right" })
      .text(expiry, 240, y, { width: 100, align: "right" })
      .text(quantity, 290, y, { width: 100, align: "right" })
      .text(price, 350, y, { width: 100, align: "right" })
      .text(discount, 390, y, { width: 100, align: "right" })
      .text(total, 455, y, { width: 100, align: "right" })
      .font("Helvetica-Bold")
      .text(return_quantity, 280, y + 10);
  } else {
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(item, 53, y)
      .fontSize(8)
      .text("- Specification:", 54, y + 10)
      .font("Helvetica")
      .text(ac, 60, y + 19)
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(batch, 180, y, { width: 100, align: "right" })
      .text(expiry, 240, y, { width: 100, align: "right" })
      .text(quantity, 290, y, { width: 100, align: "right" })
      .text(price, 350, y, { width: 100, align: "right" })
      .text(discount, 390, y, { width: 100, align: "right" })
      .text(total, 455, y, { width: 100, align: "right" })
      .font("Helvetica-Bold")
      .text(return_quantity, 280, y + 10);
  }
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(555, y).stroke();
}

function formatCurrency(cents) {
  return cents;
}

module.exports = {
  createInvoice,
};
