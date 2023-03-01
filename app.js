const fs = require("fs"); // fs = filesystem
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

//////////////////////////////// FILES

// Sync -> blocking the code

// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("File written!");

// Async -> non-blocking

// const textInputAsync = fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//   if (err) {
//     return console.log("ERROR: " + err);
//   }
//   console.log(data);
// });

// console.log("Reading file...");

// Callback hell
// const textInputAsync = fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(".txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been created😀");
//       });
//     });
//   });
// });

// console.log("Reading file...");

//////////////////////////////// SERVER

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObject
      .map((element) => replaceTemplate(templateCard, element))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>This page is not available!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000!");
});
