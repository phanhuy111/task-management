import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTasksSeed1719208870080 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO tasks (id, file_path, file_type, status, assigned_to, created_at, updated_at)
        VALUES
            ('1', '/src/entity', '/node_modules/@acuminous', 'pending', 'Huy', 1719246435486, 1719246435486),
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM tasks;
        `);
    }

}
