const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { isUtf8 } = require("buffer");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/files/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) {
        return res.status(500).send("Error reading file");
      }
      res.render("show", { filename: req.params.filename, filedata: filedata });
    }
  );
});

app.get("/edit/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) {
        return res.status(500).send("Error reading file");
      }
      res.render("edit", { filename: req.params.filename, filedata: filedata });
    }
  );
});

app.get("/editTask/:filename", function (req, res) {
  fs.readFile(
    `./files/${req.params.filename}`,
    "utf-8",
    function (err, filedata) {
      if (err) {
        return res.status(500).send("Error reading file");
      }
      console.log(filedata);
      res.render("editTask", {
        filename: req.params.filename,
        filedata: filedata,
      });
    }
  );
});

app.post("/editTask", (req, res) => {
    const { filename, prev } = req.body; // Destructure to get filename and prev data
  
    fs.writeFile(`./files/${filename}`, prev, function (err) {
      if (err) {
        return res.status(500).send("Error writing file");
      }
      res.redirect("/"); // Redirect after writing the file
    });
  });
  

app.post("/editName", (req, res) => {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("")}.txt`,
    function (err) {
      if (err) {
        console.log("Error renaming file:", err);
        return res.status(500).send("Error renaming file.");
      }
      res.redirect("/");
    }
  );
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) {
      // Handle error gracefully
      console.error("Error deleting file:", err);
      return res.status(500).send("Error deleting file."); // Send a response to the client
    }
    res.redirect("/"); // Redirect if the file is successfully deleted
  });
});

app.post("/create", (req, res) => {
    const fileName = req.body.title
      .split(" ")
      .map(
        (word, index) =>
          index === 0
            ? word.toUpperCase() // Lowercase the first word
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter of subsequent words
      )
      .join("") + ".txt"; // Make sure to add the file extension here
  
    fs.writeFile(`./files/${fileName}`, req.body.task, function (err) {
      if (err) {
        console.error("Error creating file:", err);
        return res.status(500).send("Error creating file.");
      }
      res.redirect("/"); // Redirect after file creation
    });
  });
  

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
