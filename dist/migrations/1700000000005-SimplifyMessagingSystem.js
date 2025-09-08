"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplifyMessagingSystem1700000000005 = void 0;
const typeorm_1 = require("typeorm");
class SimplifyMessagingSystem1700000000005 {
    constructor() {
        this.name = 'SimplifyMessagingSystem1700000000005';
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
    }
}
exports.SimplifyMessagingSystem1700000000005 = SimplifyMessagingSystem1700000000005;
//# sourceMappingURL=1700000000005-SimplifyMessagingSystem.js.map