const { sendEmail } = require('./src/config/email');

const testEmail =  async () => {
    try {
        console.log('Отправка тестового письма....');
            const result = await sendEmail({
                to: 'hz@cheburnetu.net', // Замените на ваш email
                subject: 'Тестовое письмо из radius-manager',
                text: 'Это тестовое письмо для проверки работы почтовой службы.',
                html: '<p>Это <strong>тестовое письмо</strong> для проверки работы почтовой службы.</p>'
    });
                console.log('Письмо успешно отправлено! ID:', result.messageId);
                console.log('Проверьте ваш почтовый ящик.');

    } catch (error) {
        console.error('Ошибка при отправке письма : ', error);
    }
}



testEmail();