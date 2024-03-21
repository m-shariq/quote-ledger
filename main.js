const ipc = require("electron").ipcRenderer;

// ledger folder
function dashboard(page) {
  if (page == "dashboard") {
    page = "s";
  }
  ipc.send("dashboard_win", page);
}

function login(page) {
  ipc.send("login_win", page);
}

// Main Folder
function city(page) {
  if (page == "city") {
    page = "s";
  }
  ipc.send("city_win", page);
}

function saleman(page) {
  if (page == "saleman") {
    page = "s";
  }
  ipc.send("saleman_win", page);
}

function bank(page) {
  if (page == "bank") {
    page = "s";
  }
  ipc.send("bank_win", page);
}

function item_cat(page) {
  if (page == "item_cat") {
    page = "s";
  }
  ipc.send("item_cat_win", page);
}

function ac(page) {
  if (page == "ac") {
    page = "s";
  }
  ipc.send("ac_win", page);
}

function item(page) {
  if (page == "item") {
    page = "s";
  }
  ipc.send("item_win", page);
}

function item_detail(page) {
  if (page == "item_detail") {
    page = "s";
  }
  ipc.send("item_detail_win", page);
}

function party(page) {
  if (page == "party") {
    page = "s";
  }
  ipc.send("party_win", page);
}

function party_rate(page) {
  if (page == "party_rate") {
    page = "s";
  }
  ipc.send("party_rate_win", page);
}

function trans(page) {
  if (page == "trans") {
    page = "s";
  }
  ipc.send("trans_win", page);
}

function area(page) {
  if (page == "area") {
    page = "s";
  }
  ipc.send("area_win", page);
}

// Transaction Folder
function purchase(page) {
  if (page == "purchase") {
    page = "s";
  }
  ipc.send("purchase_win", page);
}

function purchase_return(page) {
  if (page == "purchase_return") {
    page = "s";
  }
  ipc.send("purchase_return_win", page);
}

function sale_return(page) {
  if (page == "sale_return") {
    page = "s";
  }
  ipc.send("sale_return_win", page);
}

function sale(page) {
  if (page == "sale") {
    page = "s";
  }
  ipc.send("sale_win", page);
}

function payment(page) {
  if (page == "payment") {
    page = "s";
  }
  ipc.send("payment_win", page);
}

function receipt(page) {
  if (page == "receipt") {
    page = "s";
  }
  ipc.send("receipt_win", page);
}

// Report Folder
function report(page) {
  if (page == "report") {
    page = "s";
  }
  ipc.send("report_win", page);
}

// Setting Folder
function add_user(page) {
  if (page == "add_user") {
    page = "s";
  }
  ipc.send("add_user_win", page);
}

function update_user(page) {
  if (page == "update_user") {
    page = "s";
  }
  ipc.send("update_user_win", page);
}
