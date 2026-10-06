const express = require("express");
const session = require("express-session");
const path = require("path");
const db = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// دالة لإنشاء الجداول تلقائياً في قاعدة البيانات
async function initDB() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                client_name VARCHAR(100) NOT NULL,
                service_name VARCHAR(100) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                status ENUM('active', 'pending', 'cancelled') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log("تم التأكد من وجود الجداول بنجاح!");
    } catch (err) {
        console.error("خطأ أثناء إنشاء الجداول:", err.message);
    }
}

app.use("/", authRoutes);
app.use("/", dashboardRoutes);

app.get("/", (req, res) => { res.redirect("/login"); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await initDB();
    console.log(`Server is running on port ${PORT}`);
});