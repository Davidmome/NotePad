const path = require("path");
const express = require("express");
const fs = require("fs");

const db = path.join(__dirname, "/db");
const mainPath = path.join(__dirname, "/public");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(mainPath, "notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(db, "db.json"));
  return res.body;
});

app.get("*", function (req, res) {
  res.sendFile(path.join(mainPath, "index.html"));
});

app.post("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf-8", function (err, savedNotes) {
    savedNotes = JSON.parse(savedNotes);
    if (err) {
      return console.log(err);
    }
    var newNote = req.body;
    newNote.id = Date.now();
    savedNotes.push(newNote);
    fs.writeFile("./db/db.json",
      JSON.stringify(savedNotes),
      function (err, savedNotes) {
        res.json({});
      }
    );
  });
});

app.delete("/api/notes/:id", function (req, res) {
  var savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  var noteId = req.params.id;
  var newId = 0;

  savedNotes = savedNotes.filter((currentNote) => {
    return currentNote.id != noteId;
  });
  for (currentNote of savedNotes) {
    currentNote.id = newId.toString();
    newId++;
  }
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  return res.json(savedNotes);
});

app.listen(PORT, function () {
  console.log("App listening on PORT:" + PORT);
});
