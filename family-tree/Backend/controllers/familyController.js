import db from "../db.js";

export const getFamilyTree = (req, res) => {
  db.query("SELECT * FROM members", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

export const addMember = (req, res) => {
  const { name, gender, parent_id } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql =
    "INSERT INTO members (name, gender, parent_id, image) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, gender, parent_id || null, image], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      id: result.insertId,
      name,
      gender,
      parent_id,
      image,
    });
  });
};
