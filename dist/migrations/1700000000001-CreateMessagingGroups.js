"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessagingGroups1700000000001 = void 0;
const typeorm_1 = require("typeorm");
class CreateMessagingGroups1700000000001 {
    constructor() {
        this.name = 'CreateMessagingGroups1700000000001';
    }
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'groups',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
                {
                    name: 'description',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'class_level',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'type',
                    type: 'varchar',
                    length: '50',
                    default: "'class'",
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
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
            name: 'group_participants',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'group_id',
                    type: 'int',
                },
                {
                    name: 'user_id',
                    type: 'int',
                },
                {
                    name: 'role',
                    type: 'varchar',
                    length: '50',
                    default: "'member'",
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.addColumn('conversations', new typeorm_1.TableColumn({
            name: 'group_id',
            type: 'int',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('group_participants', new typeorm_1.TableForeignKey({
            columnNames: ['group_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'groups',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('group_participants', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('conversations', new typeorm_1.TableForeignKey({
            columnNames: ['group_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'groups',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const conversationsTable = await queryRunner.getTable('conversations');
        const groupForeignKey = conversationsTable.foreignKeys.find(fk => fk.columnNames.indexOf('group_id') !== -1);
        if (groupForeignKey) {
            await queryRunner.dropForeignKey('conversations', groupForeignKey);
        }
        const groupParticipantsTable = await queryRunner.getTable('group_participants');
        const groupParticipantsForeignKeys = groupParticipantsTable.foreignKeys;
        for (const foreignKey of groupParticipantsForeignKeys) {
            await queryRunner.dropForeignKey('group_participants', foreignKey);
        }
        await queryRunner.dropColumn('conversations', 'group_id');
        await queryRunner.dropTable('group_participants');
        await queryRunner.dropTable('groups');
    }
}
exports.CreateMessagingGroups1700000000001 = CreateMessagingGroups1700000000001;
//# sourceMappingURL=1700000000001-CreateMessagingGroups.js.map