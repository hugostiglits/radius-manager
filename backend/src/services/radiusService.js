const pool = require('../config/db');

class RadiusService {

    async getUsers(limit= 20, offset=0) {

        const query = `SELECT 
                    r.username,
                    MAX(r.value) AS password,
                    COALESCE(string_agg(g.groupname, ', '), '') AS groups
                    FROM radcheck r
                    LEFT JOIN radusergroup g ON r.username = g.username
                    WHERE r.attribute = 'Cleartext-Password'
                    GROUP BY r.username
                    ORDER BY r.username
                    LIMIT $1 OFFSET $2;`

        const {rows} =  await pool.query(query,[limit,offset]);
        return rows ;
                
    }
    async getUser(username) {
        const query = `
                SELECT 
                r.username,
                (SELECT value from radcheck WHERE username = r.username and attribute = 'Cleartext-Password' LIMIT 1) as PASSWORD,
                COALESCE(
                    (SELECT string_agg(groupname, ', ') FROM radusergroup WHERE username = r.username ),''
                ) as groups
                FROM radcheck r
                WHERE r.username = $1 and r.attribute = 'Cleartext-Password'
                GROUP BY r.username
                `;
        const { rows }  = await pool.query(query,[username]);
        console.log('getUser rows:', rows);
        console.log('zero item: ',   rows[0]);
        return rows[0] || null;



    }
    async createUser(username, password, groupname=null) {

        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            //проверка существования
            const check = await client.query(
                'SELECT username FROM radcheck WHERE username = $1 and attribute = $2',
                [username, "Cleartext-Password"]
            );
            if (check.rows.length > 0) {
                throw new Error('User already exist');
            }
            //Добавляем пользователя в радчек
            await client.query(
                'INSERT INTO radcheck (username, attribute, op, value) VALUES ($1,$2,$3,$4)',[username,"Cleartext-Password",':=', password]
            );
            //Если указана группа  - добавляем в radusergroup
            if (groupname) {
                await client.query(
                    'INSERT INTO radusergroup (username,groupname, priority) VALUES ($1,$2,1)', [username, groupname]
                );
            }
            await client.query('COMMIT');
            return (username, {group: groupname || null});

        } catch (err) {
            await client.query('ROLLBACK');
            throw err; 
        } finally {
            client.release();
        }

    }
    async updatePassword(username, newPassword) {
        const result = await pool.query(
            'UPDATE radcheck set value = $1 WHERE username = $2 and attribute = $3',
            [newPassword,username,"Cleartext-Password"]);
        return result.rowCount > 0;
    }
    //Удалить пощльзователя из всез таблиц
    async deleteUser(username) { 
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                await client.query('DELETE FROM radcheck where username         = $1',  [username]);
                await client.query('DELETE FROM radreply WHERE username         = $1',  [username]);
                await client.query('DELETE FROM radusergroup WHERE username     = $1',  [username]);
                await client.query('DELETE FROM radgroupcheck WHERE username    = $1',  [username]);
                await client.query('DELETE FROM radgroupreply WHERE username    = $1',  [username]);
                await client.query('COMMIT');
            } catch (err) {
                    await client.query('ROLLBACK');
            } finally {
                client.release();
            }
    }
    


}

module.exports = new RadiusService;