const sqlite3 = require('sqlite3').verbose();

// Crear conexión a la base de datos
let db = new sqlite3.Database('./students.sqlite', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the students database.');
});

// Consulta SQL para crear la tabla
const sqlQuery = `CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
)`;

// Ejecutar la consulta
db.run(sqlQuery, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Table "students" created successfully');
});

// Cerrar la conexión cuando hayamos terminado
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Closed the database connection.');
});