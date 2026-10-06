const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { isGuest } = require('../middleware/auth');
const path = require('path');

router.get('/login', isGuest, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/register', isGuest, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'البريد الإلكتروني مُسجل بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        return res.json({ success: true, message: 'تم إنشاء الحساب بنجاح' });
    } catch (err) {
        return res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        req.session.userId = user.id;
        req.session.userName = user.name;

        return res.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    } catch (err) {
        return res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;