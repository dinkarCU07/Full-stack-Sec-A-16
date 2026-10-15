const express = require('express');
const app = express();

app.use(express.json());

let students = [];
let nextId = 1;

app.post('/students', (req, res) => {
    const { name, email, age } = req.body;

    if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !Number.isInteger(age) ||
        age < 1 ||
        age > 120
    ) {
        return res.status(400).json({
            error: 'Invalid input'
        });
    }

    const exists = students.some(
        student =>
            student.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (exists) {
        return res.status(409).json({
            error: 'Email already exists'
        });
    }

    const student = {
        id: nextId++,
        name: name.trim(),
        email: email.trim(),
        age
    };

    students.push(student);
    res.status(201).json(student);
});

app.get('/students', (req, res) => {
    let result = students;

    if (req.query.minAge !== undefined) {
        const minAge = Number(req.query.minAge);

        if (!Number.isInteger(minAge) || minAge < 0) {
            return res.status(400).json({
                error: 'Invalid input'
            });
        }

        result = students.filter(student => student.age >= minAge);
    }

    res.status(200).json(result);
});

app.get('/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(item => item.id === id);

    if (!Number.isInteger(id) || id < 1 || !student) {
        return res.status(404).json({
            error: 'Student not found'
        });
    }

    res.status(200).json(student);
});

app.delete('/students/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(student => student.id === id);

    if (!Number.isInteger(id) || id < 1 || index === -1) {
        return res.status(404).json({
            error: 'Student not found'
        });
    }

    students.splice(index, 1);
    res.status(204).end();
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});