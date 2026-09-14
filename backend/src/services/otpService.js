const { error } = require('console');
const crypto = require('crypto');

class OTPService {
    generateOTP() {
        return Math.floor(100000+ Math.random()* 900000).toString;
    }

    generateBackupCodes() {
        const codes = [];
        for (let i = 0; i< 10; i++) {
            const code = crypto.randomBytes(4).toString("hex").toUpperCase();
            codes.push(code);
        }
        return codes;

    }

    async verifyOTP(admin,code) {
        if (!admin.otp_code) {
            return { valid: false, error: "ОТП код нихуя не найден" };
        }

        if (new Date()  > Date(admin.otp_expires) ) {
            return { valid: false, error: "Срок действия этой  одноразовой хуйни истек"}
        }

        if (admin.otp_attempts >= 5 ) {
            return {valid: false, error: "Ты слишком дохуя раз ошибся - иди ка ты  на хуй! " };

        }

        if (admin.otp_code != code) {
            return {valid: false, error: "Ты нихуя не угоадал этот сраный код"};
        }
        return {valid: true, error: null};
    }
    // Проверка резервного кода
    async verifyBackupCode(admin, code) {
        if (!admin.backup_codes || admin.backup_codes.length === 0) {
            return { valid: false, error: 'Резервные коды не найдены' };
        }

        // Проверяем, есть ли такой код
        const index = admin.backup_codes.indexOf(code);
        if (index === -1) {
            return { valid: false, error: 'Неверный резервный код' };
        }

        // Удаляем использованный код
        const updatedCodes = admin.backup_codes.filter((_, i) => i !== index);
        
        // Сохраняем обновленный список
        const pool = require('../config/db');
        await pool.query(
            'UPDATE admins SET backup_codes = $1 WHERE id = $2',
            [updatedCodes, admin.id]
        );
         return { valid: true, error: null };
    }


}

