const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const pub = path.join(__dirname, "/pub");
  const filepath =
    req.url === "/" ? path.join(pub, "index.html") : path.join(pub, req.url);

  const extname = String(path.extname(filepath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".jpg": "image/jpg",
    ".svg": "image/svg+xml",
  };
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filepath, function (err, data) {
    if (err) {
      fs.readFile(path.join(pub, "index.html"), function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data, "utf-8");
      });
    } else {
      res.writeHead(200, { "Content-type": contentType });
      res.end(data, "utf-8");
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
