import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "task-api",
    synchronize: false,
    logging: false,
    migrations: [`${__dirname}/migration/*.{ts,js}, ${__dirname}/seeds/*.{ts,js}`], // Adjusted path to migrations folder
    entities: [`${__dirname}/entity/*.{ts,js}`],
})
