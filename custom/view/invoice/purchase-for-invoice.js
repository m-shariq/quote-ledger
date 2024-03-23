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
    .text("Email: shariqhealthcare28@gmail.com", 50, 95)
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

  for (x = 0; x < invoice.items.length; x++) {
    if (invoiceTableTop + (i + 1) * 30 > 620) {
      doc.addPage();
      invoiceTableTop = 50;
      i = 0;
    }
    const item = invoice.items[x];
    const position = invoiceTableTop + (i + 1) * 30;
    doc.font("Helvetica");
    if (item.return_quantity > 0) {
      var return_q = "RETURNED QUANTITY: " + item.return_quantity;
    } else {
      var return_q = "";
    }
    generateTableRow(
      doc,
      position,
      item.name,
      " - " + item.ac_name,
      "",
      "",
      item.quantity,
      formatCurrency(item.price),
      item.discount,
      formatCurrency(item.total),
      return_q
    );

    i++;
    generateHr(doc, position + 20);
  }

  if (invoiceTableTop + (i + 1) * 30 > 620) {
    doc.addPage();
    invoiceTableTop = 50;
    i = 0;
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
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
    invoice.amounts,
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
    invoice.amounts,
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
    .text("III. The delivery time of 3 months is dependent on the payment schedule mentioned above.", 53)
    .text("IV. There is no warranty for the electrical parts of the machine.", 53)
    .fillColor("#ffffff")
    .text(".", 53)
    .text(".", 53)
    .text(".", 53)
    .fillColor("#444444")
    .text("Authorized Signature", 440)
    .text("", 50, 80)
    .moveDown();

}

function generateFooter(doc, invoice, warranty, loc, explain) {
  if (invoice.warranty == "yes") {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("TOTAL: (RS)", 0, loc, { align: "right", width: 480 })

      .text(invoice.amounts + " /-", 50, loc, { align: "right", width: 500 })

      .text(doConvert(invoice.amounts), 50, loc, { align: "left", width: 500 })
      .fontSize(9)
      .font("Helvetica-Bold")

      .text(warranty, 50, loc + 45, {
        align: "left",
        width: 500,
        underline: true,
      })

      .fontSize(9)
      .font("Helvetica")

      .text(explain, 50, loc + 70, { align: "left", width: 330 })

      .fontSize(10)
      .font("Helvetica-Bold")

      .text("Authorized Signature", 440, loc + 125, {
        align: "left",
        width: 330,
      })
      .underline(430, 0, 120, loc + 119);
  } else {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("TOTAL: (RS)", 0, loc, { align: "right", width: 480 })

      .text(invoice.amounts + " /-", 50, loc, { align: "right", width: 500 })

      .text(doConvert(invoice.amounts), 50, loc, { align: "left", width: 500 });
  }
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
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(item + ac, 53, y)
    .text(batch, 180, y, { width: 100, align: "right" })
    .text(expiry, 240, y, { width: 100, align: "right" })
    .text(quantity, 290, y, { width: 100, align: "right" })
    .text(price, 350, y, { width: 100, align: "right" })
    .text(discount, 390, y, { width: 100, align: "right" })
    .text(total, 455, y, { width: 100, align: "right" })
    .font("Helvetica-Bold")
    .text(return_quantity, 280, y + 10);
  // .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(555, y).stroke();
}

function formatCurrency(cents) {
  return cents;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

function doConvert(numberIn) {
  console.log(numberIn);
  var numberInput = Number(numberIn);

  let oneToTwenty = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  let tenth = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (numberInput.toString().length > 7) return;
  console.log(numberInput);
  //let num = ('0000000000'+ numberInput).slice(-10).match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  let num = ("0000000" + numberInput)
    .slice(-7)
    .match(/^(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
  console.log(num);
  if (!num) return;

  let outputText =
    num[1] != 0
      ? (oneToTwenty[Number(num[1])] ||
          `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}`) + "Million "
      : "";

  outputText +=
    num[2] != 0
      ? (oneToTwenty[Number(num[2])] ||
          `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}`) + "Hundred "
      : "";
  outputText +=
    num[3] != 0
      ? (oneToTwenty[Number(num[3])] ||
          `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`) + "Thousand "
      : "";
  outputText +=
    num[4] != 0
      ? (oneToTwenty[Number(num[4])] ||
          `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) + "Hundred "
      : "";
  outputText +=
    num[5] != 0
      ? oneToTwenty[Number(num[5])] ||
        `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `
      : "";

  console.log(outputText);
  return outputText + "RUPEES ONLY.";
}

module.exports = {
  createInvoice,
};
