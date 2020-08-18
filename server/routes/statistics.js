const express = require('express');
const router = express.Router();

const dbPool = require("../libs/mariadbConn");

router.get('/photo', (req, res) => {
    dbPool.getConnection(async (conn) => {
        try {
            let sql = `select left(createdAt, 10) as createDate, count(*) as cnt from photos group by createDate order by createDate desc`;
            let rows = await conn.query(sql);
            res.json({success: true, data: rows});
        } catch (err) {
            console.log(err);
            res.json({success: false, err: err});
        } finally {
            conn.end();
        }
    
    });
});

router.get('/vote', (req, res) => {
    dbPool.getConnection(async (conn) => {
        try {
            let sql = `select left(createdAt, 10) as createDate, count(*) as cnt from photo_like group by createDate order by createDate desc`;
            let rows = await conn.query(sql);
            res.json({success: true, data: rows});
        } catch (err) {
            console.log(err);
            res.json({success: false, err: err});
        } finally {
            conn.end();
        }
    });
});

module.exports = router;