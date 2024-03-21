const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream");
const FileSaver = require("file-saver");
const { net } = require("electron");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 10 });

  var stream = doc.pipe(blobStream());

  if (invoice.warranty == "yes") {
    generateHeader(doc);
  }
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

  if (invoice.warranty == "no") {
    var loc = 750;
    generateHr(doc, loc - 15);
    generateFooter(doc, invoice, "", loc, "");
    generateHr(doc, loc + 20);
  } else {
    var loc = 650;
    const head =
      "WARRANTY FORM 2A (See Rules 19 & 30 ) Warranty U/S 23(1)(i) of the drug Act 1976";

    // const explain =
    //   "I, Faisal Khalid being a person resident in pakistan carrying on business under The Name of FAISAL PHARMACEUTICAL INDUSTRIES, at 602-B Small Industrial Estate, Sargodha Road, Faisalabad do hereby give this Warranty that the Drugs/ Medicines here under described as sold by me / specified & contained in the bill of sale/ invoice do not contravene in any way the provision of section 23 (I) of the drugs Act- 1976";

    generateHr(doc, loc - 15);
    // generateFooter(doc, invoice, head, loc, explain);
    generateFooter(doc, invoice, head, loc, "");
    generateHr(doc, loc + 20);
  }

  doc.end();
  stream.on("finish", function () {
    var blob = stream.toBlob("application/pdf");
    var blobURL = URL.createObjectURL(blob);
    window.open(blobURL);
  });
  // stream.on("finish", function () {
  //   var blob = stream.toBlob("application/pdf");
  //   var blobURL = URL.createObjectURL(blob);
  //   window.open(blobURL);

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
  var top = 0;
  if (invoice.warranty == "yes") {
    top = 105;
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .text(invoice.label, 433, top + 10)
      .font("Helvetica")
      .fontSize(12)
      .text("INVOICE", 480, top + 12);
  } else {
    top = 40;
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(invoice.label, 50, top)
      .font("Helvetica")
      .fontSize(15)
      .text("INVOICE", 480, top + 10);
  }

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
    .text("Bilty Number:", 50, customerInformationTop + 30)
    .text(invoice.purchase.bilty, 150, customerInformationTop + 30)
    .text("Transporter:", 50, customerInformationTop + 45)
    .text(invoice.purchase.trans, 150, customerInformationTop + 45)

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

  var invoiceTableTop = 0;

  if (invoice.warranty == "yes") {
    invoiceTableTop = 225;
  } else {
    invoiceTableTop = 160;
  }

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Qty",
    "BNS",
    "Item",
    "Packing",
    "Batch",
    "Expiry",
    "Price (RS)",
    "G. Amount (RS)",
    "Disc.",
    "Sale Tax",
    "Net. Total (RS)"
  );
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
    generateTableRow(
      doc,
      position,
      item.quantity,
      "",
      item.name,
      item.ac_name,
      item.batch,
      item.expiry,
      formatCurrency(item.price),
      formatCurrency(item.price),
      item.discount,
      "",
      formatCurrency(item.total)
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
    invoice.amounts
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
    "0"
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
    invoice.amounts
  );
  doc.font("Helvetica");
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
  qty,
  bns,
  item,
  pack,
  batch,
  expiry,
  price,
  g_amount,
  disc,
  sale_tax,
  net_amount
) {
  doc
    .fontSize(7)

    .text(qty, 10, y)
    .text(bns, 40, y)
    .text(item, 70, y, { width: 80, align: "right" })
    .text(pack, 150, y, { width: 30, align: "right" })
    .text(batch, 180, y, { width: 40, align: "right" })
    .text(expiry, 220, y, { width: 40, align: "right" })
    .text(price, 260, y, { width: 40, align: "right" })
    .text(g_amount, 300, y, { width: 40, align: "right" })
    .text(disc, 350, y, { width: 50, align: "right" })
    .text(sale_tax, 400, y, { width: 50, align: "right" })
    .text(net_amount, 450, y, { width: 50, align: "right" });
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
