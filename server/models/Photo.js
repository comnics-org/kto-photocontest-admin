/**
 * models/Photos.js

CREATE TABLE `photos` (
  `shortcode` varchar(50) NOT NULL,
  `kind` char(1) DEFAULT 'I' COMMENT 'I:Insta, K:KTO',
  `owner_id` varchar(50) DEFAULT NULL,
  `display_url` varchar(512) NOT NULL,
  `thumbnail_src` varchar(512) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `taken_at_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`shortcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */

const dbPool = require("../libs/mariadbConn");

const Photo = {
    insert: (photo, cb) => {
        dbPool.getConnection(async (conn) => {
            try {
                let result = await conn.query(`
                    INSERT INTO 
                    photos (shortcode, kind, owner_id, display_url, thumbnail_src, username ) 
                    VALUES ('${photo.id}', '${photo.kind}', '${photo.owner_id}', '${photo.display_url}', '${photo.thumbnail_src}', '${photo.username}')
                `);
                conn.end();

                if(cb && typeof cb === 'function') cb(null, rows);
                
            } catch (err) {
                conn.end();
                if(cb && typeof cb === 'function') cb(err);
            }
        });
    },

    selectPhotos: (offset = 0, limit = 9, cb = null) => {
        dbPool.getConnection(async (conn) => {
            try {
                let sql = `SELECT * FROM photos WHERE is_use = 'Y' order by createdAt desc limit ${offset}, ${limit}`;
                let rows = await conn.query(sql);
                conn.end();

                if(cb && typeof cb === 'function') cb(null, rows);
                
            } catch (err) {
                conn.end();
                if(cb && typeof cb === 'function') cb(err);
            }
        });
    },

    deletePhoto: (shortcode) => {
        return new Promise( async (resolve, reject) => {
            dbPool.getConnection(async (conn) => {
                try{
                    let sql = `DELETE FROM photos WHERE shortcode = '${shortcode}'`;
                    let res = await conn.query(sql);
                    resolve(res);
                }catch(err){
                    reject(err);
                }
            });
        });
    },

    disablePhoto: (shortcode) => {
        return new Promise( async (resolve, reject) => {
            dbPool.getConnection(async (conn) => {
                try{
                    let sql = `UPDATE photos SET is_use = 'N' WHERE shortcode = '${shortcode}'`;
                    let res = await conn.query(sql);
                    resolve(res);
                }catch(err){
                    reject(err);
                }
            });
        })
    }

};

module.exports = { Photo };
