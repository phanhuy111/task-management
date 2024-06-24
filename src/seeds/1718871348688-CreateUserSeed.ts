import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserSeed1718871348688 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO users (id, name, age)
        VALUES
            ('1', 'Huy', 50),
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users;
        `);
    }

}
