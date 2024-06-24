import * as amqp from 'amqplib/callback_api';
import { AppDataSource } from '../data-source';
import { Task } from '../entity/Task';

const QUEUE = 'tasks';

export const consumeTasks = () => {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(QUEUE, { durable: true });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE);

            channel.consume(QUEUE, async (msg) => {
                if (msg !== null) {
                    const task = JSON.parse(msg.content.toString());
                    await AppDataSource.initialize();
                    const taskRepository = AppDataSource.getRepository(Task);

                    const newTask = new Task();
                    newTask.file_path = task.file_path;
                    newTask.file_type = task.file_type;
                    newTask.status = 'assigned';
                    newTask.assigned_to = task.assigned_to;

                    await taskRepository.save(newTask);
                    console.log(" [x] Received %s", task);
                    
                    channel.ack(msg);
                }
            }, { noAck: false });
        });
    });
};
