const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
let db = new sqlite3.Database('./students.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the students database.');
});

// Ruta para estudiantes
app.route('/students')
    .get((req, res) => {
        // GET request para todos los estudiantes
        db.all("SELECT * FROM students", [], (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            });
        });
    })
    .post((req, res) => {
        // POST request para crear un estudiante
        const { firstname, lastname, gender, age } = req.body;
        db.run(
            `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`,
            [firstname, lastname, gender, age],
            function (err) {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.json({
                    "message": "success",
                    "data": { id: this.lastID },
                    "text": `Student with id: ${this.lastID} created successfully`
                });
            }
        );
    });

// Ruta para un estudiante específico
app.route('/student/:id')
    .get((req, res) => {
        // GET request para un estudiante
        const id = req.params.id;
        db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            if (row) {
                res.json({
                    "message": "success",
                    "data": row
                });
            } else {
                res.status(404).json({ "message": "Student not found" });
            }
        });
    })
    .put((req, res) => {
        // PUT request para actualizar un estudiante
        const id = req.params.id;
        const { firstname, lastname, gender, age } = req.body;
        
        db.run(
            `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`,
            [firstname, lastname, gender, age, id],
            function (err) {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.json({
                    "message": "success",
                    "data": {
                        id: id,
                        firstname: firstname,
                        lastname: lastname,
                        gender: gender,
                        age: age
                    },
                    "changes": this.changes
                });
            }
        );
    })
    .delete((req, res) => {
        // DELETE request para eliminar un estudiante
        const id = req.params.id;
        db.run(
            `DELETE FROM students WHERE id = ?`,
            [id],
            function (err) {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.json({
                    "message": "success",
                    "text": `The Student with id: ${id} has been deleted.`,
                    "changes": this.changes
                });
            }
        );
    });

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});