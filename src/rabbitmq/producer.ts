import * as amqp from 'amqplib/callback_api';

const QUEUE = 'tasks';

export const sendTaskToQueue = (task: any) => {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(QUEUE, { durable: true });
            channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(task)), { persistent: true });
            console.log(" [x] Sent '%s'", task);
        });
    });
};
