const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { isAuth } = require('../middleware/auth');
const path = require('path');

router.get('/dashboard', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

router.get('/api/user-info', isAuth, (req, res) => {
    res.json({ name: req.session.userName });
});

router.get('/api/subscriptions', isAuth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY id DESC', [req.session.userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'خطأ في جلب البيانات' });
    }
});

router.post('/api/subscriptions', isAuth, async (req, res) => {
    try {
        const { client_name, service_name, price, status } = req.body;
        if (!client_name || !service_name || !price) {
            return res.status(400).json({ error: 'جميع البيانات مطلوبة' });
        }

        await db.query(
            'INSERT INTO subscriptions (user_id, client_name, service_name, price, status) VALUES (?, ?, ?, ?, ?)',
            [req.session.userId, client_name, service_name, price, status || 'active']
        );

        res.json({ success: true, message: 'تم إضافة الاشتراك بنجاح' });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ أثناء الإضافة' });
    }
});

router.delete('/api/subscriptions/:id', isAuth, async (req, res) => {
    try {
        await db.query('DELETE FROM subscriptions WHERE id = ? AND user_id = ?', [req.params.id, req.session.userId]);
        res.json({ success: true, message: 'تم الحذف بنجاح' });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ أثناء الحذف' });
    }
});

module.exports = router;