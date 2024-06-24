import 'reflect-metadata';
import express = require("express");
import { AppDataSource } from './data-source';
import { Task } from './entity/Task';
import { sendTaskToQueue } from './rabbitmq/producer';
import { consumeTasks } from './rabbitmq/consumer';

const app = express();
const PORT = 3000;

app.use(express.json());

AppDataSource.initialize().then(async () => {
    console.log('Data Source has been initialized!');

    // Endpoint to create a new task
    app.post('/tasks', async (req, res) => {
        const { file_path, file_type } = req.body;
        const task = new Task();
        task.file_path = file_path;
        task.file_type = file_type;

        const taskRepository = AppDataSource.getRepository(Task);
        await taskRepository.save(task);

        sendTaskToQueue(task);
        res.status(201).send(task);
    });

    // Endpoint to mark task as completed
    app.put('/tasks/:id/complete', async (req, res) => {
        const taskId = parseInt(req.params.id);
        const taskRepository = AppDataSource.getRepository(Task);

        const task = await taskRepository.findOneBy({ id: taskId });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        task.status = 'completed';
        await taskRepository.save(task);

        res.send({ message: 'Task completed' });
    });

    // Start consuming tasks
    consumeTasks();

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
