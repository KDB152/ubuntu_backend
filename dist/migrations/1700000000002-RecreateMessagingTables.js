"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecreateMessagingTables1700000000002 = void 0;
const typeorm_1 = require("typeorm");
class RecreateMessagingTables1700000000002 {
    constructor() {
        this.name = 'RecreateMessagingTables1700000000002';
    }
    async up(queryRunner) {
        await queryRunner.query('DROP TABLE IF EXISTS messages');
        await queryRunner.query('DROP TABLE IF EXISTS conversations');
        await queryRunner.query('DROP TABLE IF EXISTS group_participants');
        await queryRunner.query('DROP TABLE IF EXISTS groups');
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'groupes',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'class_level',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                },
            ],
        }), true);
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
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'conversation',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'groupe_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'last_message_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'messages',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'sender_id',
                    type: 'int',
                },
                {
                    name: 'recipient_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'groupe_id',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'conversation_id',
                    type: 'int',
                },
                {
                    name: 'content',
                    type: 'text',
                },
                {
                    name: 'message_type',
                    type: 'varchar',
                    length: '50',
                    default: "'text'",
                },
                {
                    name: 'is_read',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'file_path',
                    type: 'varchar',
                    length: '500',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('conversation_participants', new typeorm_1.TableForeignKey({
            columnNames: ['conversation_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'conversation',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('conversation_participants', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('conversation', new typeorm_1.TableForeignKey({
            columnNames: ['groupe_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'groupes',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('conversation', new typeorm_1.TableForeignKey({
            columnNames: ['last_message_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'messages',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('messages', new typeorm_1.TableForeignKey({
            columnNames: ['sender_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('messages', new typeorm_1.TableForeignKey({
            columnNames: ['recipient_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('messages', new typeorm_1.TableForeignKey({
            columnNames: ['groupe_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'groupes',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('messages', new typeorm_1.TableForeignKey({
            columnNames: ['conversation_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'conversation',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const conversationParticipantsTable = await queryRunner.getTable('conversation_participants');
        if (conversationParticipantsTable) {
            const foreignKeys = conversationParticipantsTable.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('conversation_participants', foreignKey);
            }
        }
        const conversationTable = await queryRunner.getTable('conversation');
        if (conversationTable) {
            const foreignKeys = conversationTable.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('conversation', foreignKey);
            }
        }
        const messagesTable = await queryRunner.getTable('messages');
        if (messagesTable) {
            const foreignKeys = messagesTable.foreignKeys;
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey('messages', foreignKey);
            }
        }
        await queryRunner.dropTable('messages');
        await queryRunner.dropTable('conversation');
        await queryRunner.dropTable('conversation_participants');
        await queryRunner.dropTable('groupes');
    }
}
exports.RecreateMessagingTables1700000000002 = RecreateMessagingTables1700000000002;
//# sourceMappingURL=1700000000002-RecreateMessagingTables.js.map