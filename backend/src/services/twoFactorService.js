const { error } = require('console');
const crypto = require('crypto');
const pool  = require('../config/db');
const { sendEmail } = require('../config/email');
const bcrypt = require('bcrypt');



const generateCode = () => {
        //return Math.floor(100000+ Math.random()* 900000).toString();
        return crypto.randomInt(0,1000000).toString().padStart(6,0);
}


const hashCode = async (code) => {
    const salt = 10 ;
    return await bcrypt.hash(code,salt);
}

const createTwoFactorCode = async (userId, userEmail) =>{
        const code = generateCode();
        const expiresAt = new Date(Date.now()+ 10 * 60 * 1000);
        const codeHash =  await hashCode(code);
        //Создаем запись в таблице туфакторскодэ
    const query = `
        INSERT INTO two_factor_codes (user_id, code_hash, expires_at) VALUES ($1,$2,$3)
    `;
    await pool.query(
      'DELETE FROM two_factor_codes WHERE user_id = $1',[userId]);  
    await pool.query(query,[userId, codeHash, expiresAt]);

      // Отправляем код по почте
    await sendEmail({
        to: userEmail,
        subject: 'Код подтверждения входа',
        text: `Ваш код подтверждения: ${code}. Код действителен 10 минут.`,
        html: `<p>Ваш код подтверждения: <strong>${code}</strong></p><p>Код действителен 10 минут.</p>`
    });

    return true;



}

const verifyTwoFactorCode = async (userId, code) =>{
   const query = `
        SELECT id, code_hash, attempts FROM two_factor_codes
        WHERE user_id = $1 AND  expires_at > NOW() ORDER BY created_at DESC, id DESC
        LIMIT 1
   `;

   const result = await pool.query(query,[userId]);

   if (result.rows.length === 0 ) {
    return false;
   }

   const { id, code_hash, attempts } = result.rows[0];

   if (Number(attempts) >= 3) {
       await  pool.query('DELETE FROM two_factor_codes WHERE id = $1', [id]);
        throw new Error('Превышено количество попыток ввода кода. Запросите новый код.');
   }
  // Проверяем код
  const isValid = await bcrypt.compare(code, code_hash);
  
  if (!isValid) {
const attempt = await pool.query(
    `UPDATE two_factor_codes
     SET attempts = attempts + 1
     WHERE id = $1 AND attempts < 3
     RETURNING attempts`,
    [id]
);
if (attempt.rows[0]?.attempts >= 3) {
    await pool.query(
        'DELETE FROM two_factor_codes WHERE id = $1',
        [id]
    );
    throw new Error('Превышено количество попыток ввода кода. Запросите новый код.');
}
return false;
  }
  
  // Удаляем использованный код
const consumed = await pool.query(
    `DELETE FROM two_factor_codes
     WHERE id = $1
       AND expires_at > NOW()
       AND attempts < 3
     RETURNING id`,
    [id]
);
return consumed.rowCount === 1;

}

module.exports = {
  createTwoFactorCode,
  verifyTwoFactorCode
};
    