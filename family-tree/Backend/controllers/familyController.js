import db from "../db.js";

export const getFamilyTree = (req, res) => {
  db.query("SELECT * FROM members", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

export const addMember = (req, res) => {
  const { name, gender, parent_id } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO members (name, gender, parent_id, image) VALUES (?, ?, ?, ?)",
    [name, gender, parent_id || null, imagePath],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Member added successfully" });
    }
  );
};
