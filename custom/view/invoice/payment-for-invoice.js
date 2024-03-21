const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");
const FileSaver = require("file-saver");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  var stream = doc.pipe(blobStream());

  console.log(invoice);
  // generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

  generateHr(doc, 735);
  generateFooter(doc, invoice);
  generateHr(doc, 770);

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

  //   // FileSaver.saveAs(blob, 'MyFile.pdf');
  // });
}

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("SHARIQ HEALTH CARE", 50, 40)
    .fontSize(10)
    .text("Faisalabad, Pakistan, +92 300 966 7709", 50, 95)
    .text("Email: shariqhealthcare28@gmail.com", 50, 110)
    .text("", 50, 80)
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  var top = 40;
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(invoice.label, 50, top)
    .font("Helvetica")
    .fontSize(15)
    .text("INVOICE", 480, top + 10);

  generateHr(doc, top + 25);

  const customerInformationTop = top + 40;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.purchase.id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(invoice.purchase.date, 150, customerInformationTop + 15)

    .font("Helvetica-Bold")
    .text(invoice.shipping.party, 400, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 400, customerInformationTop + 15)
    .text(
      invoice.shipping.city + ", " + invoice.shipping.cell,
      400,
      customerInformationTop + 50
    )
    .moveDown();

  generateHr(doc, customerInformationTop + 70);
}

function generateInvoiceTable(doc, invoice) {
  let i = 0;
  let x;
  let invoiceTableTop = 160;

  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Bank", "Comment", "Total (RS)");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (x = 0; x < invoice.items.length; x++) {
    if (invoiceTableTop + (i + 1) * 30 > 620) {
      doc.addPage();
      invoiceTableTop = 50;
      i = 0;
    }
    const item = invoice.items[x];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, position, item.bank, item.comment, item.amount);
    i++;
    generateHr(doc, position + 20);
  }

  if (invoiceTableTop + (i + 1) * 30 > 620) {
    doc.addPage();
    invoiceTableTop = 50;
    i = 0;
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(doc, subtotalPosition, "", "Subtotal (RS)", invoice.amounts);

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(doc, paidToDatePosition, "", "Paid To Date (RS)", "0");

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, duePosition, "", "Balance Due (RS)", invoice.amounts);
  doc.font("Helvetica");
}

function generateFooter(doc, invoice) {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("TOTAL: (RS)", 0, 750, { align: "right", width: 500 })

    .text(invoice.amounts + " /-", 50, 750, { align: "right", width: 500 })

    .text(doConvert(invoice.amounts), 50, 750, { align: "left", width: 500 });
}

function generateTableRow(doc, y, bank, comment, amount) {
  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .text(bank, 50, y)
    .text(comment, 130, y, { width: 200, align: "right" })
    .text(amount, 430, y, { width: 100, align: "right" });
  // .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
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
