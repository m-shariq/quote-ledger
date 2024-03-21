const { app, BrowserWindow, ipcMain } = require("electron");
const { dash } = require("pdfkit");

app.on("ready", function () {
  // LEEDGER WINDOWS DISPLAY FOR LEDGER

  const main_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  main_win.loadURL("file://" + __dirname + "/custom/view/ledger/login.html");
  main_win.on("closed", function (event) {
    app.exit();
  });

  ipcMain.on("login_win", (event, data) => {
    main_win.show();
    main_win.maximize();
    main_win.webContents.send("reload", "r");
    hide(data);
  });

  const dashboard_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  dashboard_win.loadURL(
    "file://" + __dirname + "/custom/view/ledger/index.html"
  );
  dashboard_win.on("closed", function (event) {
    app.exit();
  });

  // MAIN WINDOWS DISPLAY FOR LEDGER

  const saleman_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  saleman_win.loadURL("file://" + __dirname + "/custom/view/main/saleman.html");
  saleman_win.on("close", function (event) {
    event.preventDefault();
    saleman_win.hide();
  });

  const trans_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  trans_win.loadURL(
    "file://" + __dirname + "/custom/view/main/transporter.html"
  );
  trans_win.on("close", function (event) {
    event.preventDefault();
    trans_win.hide();
  });

  const bank_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  bank_win.loadURL("file://" + __dirname + "/custom/view/main/bank.html");
  bank_win.on("close", function (event) {
    event.preventDefault();
    bank_win.hide();
  });

  const ac_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ac_win.loadURL("file://" + __dirname + "/custom/view/main/ac.html");
  ac_win.on("close", function (event) {
    event.preventDefault();
    ac_win.hide();
  });

  const item_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  item_win.loadURL("file://" + __dirname + "/custom/view/main/item.html");
  item_win.on("close", function (event) {
    event.preventDefault();
    item_win.hide();
  });

  const city_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  city_win.loadURL("file://" + __dirname + "/custom/view/main/city.html");
  city_win.on("close", function (event) {
    event.preventDefault();
    city_win.hide();
  });

  const item_detail_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  item_detail_win.loadURL(
    "file://" + __dirname + "/custom/view/main/item_detail.html"
  );
  item_detail_win.on("close", function (event) {
    event.preventDefault();
    item_detail_win.hide();
  });

  const party_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  party_win.loadURL("file://" + __dirname + "/custom/view/main/party.html");
  party_win.on("close", function (event) {
    event.preventDefault();
    party_win.hide();
  });

  const party_rate_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  party_rate_win.loadURL(
    "file://" + __dirname + "/custom/view/main/party_rate.html"
  );
  party_rate_win.on("close", function (event) {
    event.preventDefault();
    party_rate_win.hide();
  });

  const item_cat_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  item_cat_win.loadURL(
    "file://" + __dirname + "/custom/view/main/item_cat.html"
  );
  item_cat_win.on("close", function (event) {
    event.preventDefault();
    item_cat_win.hide();
  });

  const area_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  area_win.loadURL("file://" + __dirname + "/custom/view/main/area.html");
  area_win.on("close", function (event) {
    event.preventDefault();
    area_win.hide();
  });

  ipcMain.on("dashboard_win", (event, data) => {
    dashboard_win.show();
    dashboard_win.maximize();
    dashboard_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("area_win", (event, data) => {
    area_win.show();
    area_win.maximize();
    area_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("item_cat_win", (event, data) => {
    item_cat_win.show();
    item_cat_win.maximize();
    item_cat_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("saleman_win", (event, data) => {
    saleman_win.show();
    saleman_win.maximize();
    saleman_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("ac_win", (event, data) => {
    ac_win.show();
    ac_win.maximize();
    ac_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("bank_win", (event, data) => {
    bank_win.show();
    bank_win.maximize();
    bank_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("item_win", (event, data) => {
    item_win.show();
    item_win.maximize();
    item_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("city_win", (event, data) => {
    city_win.show();
    city_win.maximize();
    city_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("item_detail_win", (event, data) => {
    item_detail_win.show();
    item_detail_win.maximize();
    item_detail_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("party_win", (event, data) => {
    party_win.show();
    party_win.maximize();
    party_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("party_rate_win", (event, data) => {
    party_rate_win.show();
    party_rate_win.maximize();
    party_rate_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("trans_win", (event, data) => {
    trans_win.show();
    trans_win.maximize();
    trans_win.webContents.send("reload", "r");
    hide(data);
  });

  // TRANSACTION WINDOWS DISPLAY FOR LEDGER

  const payment_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  payment_win.loadURL(
    "file://" + __dirname + "/custom/view/transaction/payment/payment.html"
  );
  payment_win.on("close", function (event) {
    event.preventDefault();
    payment_win.hide();
  });

  const receipt_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  receipt_win.loadURL(
    "file://" + __dirname + "/custom/view/transaction/receipt/receipt.html"
  );
  receipt_win.on("close", function (event) {
    event.preventDefault();
    receipt_win.hide();
  });

  const purchase_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  purchase_win.loadURL(
    "file://" + __dirname + "/custom/view/transaction/purchase/purchase.html"
  );
  purchase_win.on("close", function (event) {
    event.preventDefault();
    purchase_win.hide();
  });

  const sale_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  sale_win.loadURL(
    "file://" + __dirname + "/custom/view/transaction/sale/sale.html"
  );
  sale_win.on("close", function (event) {
    event.preventDefault();
    sale_win.hide();
  });

  const sale_return_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  sale_return_win.loadURL(
    "file://" + __dirname + "/custom/view/returns/sale_return.html"
  );
  sale_return_win.on("close", function (event) {
    event.preventDefault();
    sale_return_win.hide();
  });

  const purchase_return_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  purchase_return_win.loadURL(
    "file://" + __dirname + "/custom/view/returns/purchase_return.html"
  );
  purchase_return_win.on("close", function (event) {
    event.preventDefault();
    purchase_return_win.hide();
  });

  ipcMain.on("sale_return_win", (event, data) => {
    sale_return_win.show();
    sale_return_win.maximize();
    sale_return_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("purchase_return_win", (event, data) => {
    purchase_return_win.show();
    purchase_return_win.maximize();
    purchase_return_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("purchase_win", (event, data) => {
    purchase_win.show();
    purchase_win.maximize();
    purchase_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("sale_win", (event, data) => {
    sale_win.show();
    sale_win.maximize();
    sale_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("payment_win", (event, data) => {
    payment_win.show();
    payment_win.maximize();
    payment_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("receipt_win", (event, data) => {
    receipt_win.show();
    receipt_win.maximize();
    receipt_win.webContents.send("reload", "r");
    hide(data);
  });

  // SETTING WINDOWS DISPLAY FOR LEDGER

  const add_user_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  add_user_win.loadURL(
    "file://" + __dirname + "/custom/view/setting/add_user.html"
  );
  add_user_win.on("close", function (event) {
    event.preventDefault();
    add_user_win.hide();
  });

  const update_user_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  update_user_win.loadURL(
    "file://" + __dirname + "/custom/view/setting/update_user.html"
  );
  update_user_win.on("close", function (event) {
    event.preventDefault();
    update_user_win.hide();
  });

  ipcMain.on("add_user_win", (event, data) => {
    add_user_win.show();
    add_user_win.maximize();
    add_user_win.webContents.send("reload", "r");
    hide(data);
  });

  ipcMain.on("update_user_win", (event, data) => {
    update_user_win.show();
    update_user_win.maximize();
    update_user_win.webContents.send("reload", "r");
    hide(data);
  });

  // REPORT WINDOWS DISPLAY FOR LEDGER

  const report_win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    icon: `./icon.png`,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  report_win.loadURL(
    "file://" + __dirname + "/custom/view/reports/report.html"
  );
  report_win.on("close", function (event) {
    event.preventDefault();
    report_win.hide();
  });

  ipcMain.on("report_win", (event, data) => {
    report_win.show();
    report_win.maximize();
    report_win.webContents.send("reload", "r");
    hide(data);
  });

  function hide(data) {
    if (data == "login") {
      main_win.hide();
      dashboard_win.maximize();
    }
    // if (data == "trans") {
    //   trans_win.hide();
    // }
    // if (data == "item_cat") {
    //   item_cat_win.hide();
    // }
    // if (data == "ac") {
    //   ac_win.hide();
    // }
    // if (data == "city") {
    //   city_win.hide();
    // }
    // if (data == "item") {
    //   item_win.hide();
    // }
    // if (data == "saleman") {
    //   saleman_win.hide();
    // }
    // if (data == "area") {
    //   area_win.hide();
    // }
    // if (data == "item_detail") {
    //   item_detail_win.hide();
    // }
    // if (data == "party") {
    //   party_win.hide();
    // }
    // if (data == "party_rate") {
    //   party_rate_win.hide();
    // }
    // if (data == "purchase") {
    //   purchase_win.hide();
    // }
    // if (data == "purchase_return") {
    //   purchase_return_win.hide();
    // }
    // if (data == "sale_return") {
    //   sale_return_win.hide();
    // }
    // if (data == "sale") {
    //   sale_win.hide();
    // }
    // if (data == "payment") {
    //   payment_win.hide();
    // }
    // if (data == "receipt") {
    //   receipt_win.hide();
    // }
    // if (data == "add_user") {
    //   add_user_win.hide();
    // }
    // if (data == "update_user") {
    //   update_user_win.hide();
    // }
    // if (data == "report") {
    //   report_win.hide();
    // }
    // if (data == "bank") {
    //   bank_win.hide();
    // }
  }

  // dashboard_win.webContents.openDevTools();
  main_win.maximize();
});

// ipcMain.on("login",(event,data)=>{
//     var obj = JSON.parse(JSON.stringify(data))
//     const username=obj.username;
//     const password=obj.password;

//     if(username=="" || password==""){
//         event.reply("reply",'Empty Fields')
//     }
//     else{
//         let yes=login(username,password)
//         console.log(yes)
//         event.reply("reply",1)
//     }
// })

// function createWindow(){
//     const win=new BrowserWindow({
//         // height: 580,
//         // width: 600,
//         // resizable: false,
//         // maximizable:false,
//         // autoHideMenuBar: true,
//         webPreferences: {
//             enableRemoteModule: true,
//             nodeIntegration: true,
//             contextIsolation: false,
//         }
//     })
//     win.loadFile('custom/view/main/transporter.html')
//     win.maximize()
//     win.openDevTools();
//     //win.webContents.openDevTools()
// }

// function login(username,password){
//     var query =  "SELECT * FROM `user_group` where Username='"+username+"' and Password='"+password+"'";
//     var out=0;
//     db.connection.query(query, function(err, rows, fields) {
//         if(err){
//             console.log("An error ocurred performing the query.");
//             console.log(err);
//             return;
//         }
//         console.log(rows)
//         out=rows.length
//         console.log(out)
//         if(out==1){

//             const dashboard=new BrowserWindow({
//                 show: false,
//                 webPreferences: {
//                     nodeIntegration: true,
//                     contextIsolation: false,
//                 }
//             })
//             dashboard.maximize()
//             dashboard.loadFile('./custom/index.html')
//         }
//     });
// }

// app.whenReady().then(createWindow)
