/**
 * models/User.js

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(512) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `del_yn` char(1) DEFAULT 'N',
  `token` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

 */ 

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dbPool  = require('../libs/mariadbConn');

const saltRounds = 10;

const User = {
    comparePassword: (plainPassword, encryptedPawword, callback) => {
        bcrypt.compare(plainPassword, encryptedPawword, (err, isMatch) => {
            if (err) return callback(err);
            callback(null, isMatch);
        });
    },

    generateToken: (user, callback) => {
        let token = jwt.sign(user.id.toString(), "secretToken");
        user.token = token;
        User.updateUser(user, (err) => {
            if (err) return callback(err);
            callback(null, user);
        });
    },

    findByToken: (token, cb) => {
        jwt.verify(token, "secretToken", (err, decoded) => {
            //console.log(decoded);
            dbPool.getConnection(function(conn) {
                conn.query(`SELECT * FROM users WHERE id='${decoded}' AND token = '${token}'`).then((rows) => {
                    conn.end();
                    cb(rows[0]);
                });
    
            })
        });
    },

    register: (user, cb) => {
        dbPool.getConnection(async (conn)=>{
            User.encryptPassword(user.password, async (encryptedPassword)=> {
                try {
                    let rows = await conn.query(`INSERT INTO users(email, name, password) VALUES ('${user.email}', '${user.name}', '${encryptedPassword}')`);
                    conn.end();
                    cb(null, rows);
                } catch (err) {
                    conn.end();
                    cb(err);
                }
            })
        });
    },

    encryptPassword: (password, cb) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
    
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return nexr(err);
                cb(hash);
            });
        });
    },

    getUser: (email, cb) => {
        dbPool.getConnection(async (conn)=>{
            try {
                let rows = await conn.query(`SELECT id, email, password, name FROM users WHERE email = '${email}'`);
                conn.end();
                cb(null, rows[0]);
            } catch (err) {
                conn.end();
                cb(err);
            }
        });
    },

    updateUser: (user, cb) => {
        dbPool.getConnection(async (conn)=>{
            try {
                let rows = await conn.query(`UPDATE users SET email = '${user.email}', password = '${user.password}', name = '${user.name}', token = '${user.token}' WHERE id = '${user.id}'`);
                conn.end();
                cb(null);
            } catch (err) {
                conn.end();
                cb(err);
            }
        });
    },

    findOneAndUpdate: (selectCondition, updateSets, cb) => {
        dbPool.getConnection(async (conn)=>{
            try {
                sql = "UPDATE users SET ";
                for (var key in updateSets) {
                    if (updateSets.hasOwnProperty(key)){
                        sql += `${key} = '${updateSets[key]}'`;
                    }
                };
        
                sql += ` WHERE 1=1 `
                for (var key in selectCondition) {
                    if (selectCondition.hasOwnProperty(key)){
                        sql += ` AND ${key} = '${selectCondition[key]}'`;
                    }
                };
                //console.log(sql);
    
                rows = await conn.query(sql);
                cb(null);
            } catch (err) {
                conn.end();
                cb(err);
            } finally{
                if (conn) conn.end();
            }
        });
    },

    test: (a, b) => {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{
                resolve(a+b);
                //reject("error!!!");
            },2000)
        });
    }

}

// User.test(1,2).then((res)=>{
//     console.log('Result==>', res);
//     return 10;
// }).then((res)=>{
//     console.log('Result==>', res);
// }).catch((err)=>{
//     console.log(err);
// });

module.exports = { User };
