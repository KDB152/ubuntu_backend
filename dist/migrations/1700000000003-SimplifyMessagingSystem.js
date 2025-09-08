"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplifyMessagingSystem1700000000003 = void 0;
const typeorm_1 = require("typeorm");
class SimplifyMessagingSystem1700000000003 {
    constructor() {
        this.name = 'SimplifyMessagingSystem1700000000003';
    }
    async up(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS conversation_participants');
        await queryRunner.addColumn('conversation', new typeorm_1.TableColumn({
            name: 'type',
            type: 'varchar',
            length: '50',
            default: "'direct'",
        }));
        await queryRunner.addColumn('conversation', new typeorm_1.TableColumn({
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: true,
        }));
        await queryRunner.addColumn('conversation', new typeorm_1.TableColumn({
            name: 'participant1_id',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.addColumn('conversation', new typeorm_1.TableColumn({
            name: 'participant2_id',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.addColumn('conversation', new typeorm_1.TableColumn({
            name: 'class_level',
            type: 'varchar',
            length: '100',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('conversation', new typeorm_1.TableForeignKey({
            columnNames: ['participant1_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('conversation', new typeorm_1.TableForeignKey({
            columnNames: ['participant2_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const conversationTable = await queryRunner.getTable('conversation');
        const foreignKeys = conversationTable.foreignKeys;
        for (const foreignKey of foreignKeys) {
            if (foreignKey.columnNames.includes('participant1_id') ||
                foreignKey.columnNames.includes('participant2_id')) {
                await queryRunner.dropForeignKey('conversation', foreignKey);
            }
        }
        await queryRunner.dropColumn('conversation', 'type');
        await queryRunner.dropColumn('conversation', 'title');
        await queryRunner.dropColumn('conversation', 'participant1_id');
        await queryRunner.dropColumn('conversation', 'participant2_id');
        await queryRunner.dropColumn('conversation', 'class_level');
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'conversation_participants',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'conversation_id',
                    type: 'int',
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                {
                    name: 'groupe_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
    }
}
exports.SimplifyMessagingSystem1700000000003 = SimplifyMessagingSystem1700000000003;
//# sourceMappingURL=1700000000003-SimplifyMessagingSystem.js.map