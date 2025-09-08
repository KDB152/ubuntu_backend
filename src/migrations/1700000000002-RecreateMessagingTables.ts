import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class RecreateMessagingTables1700000000002 implements MigrationInterface {
  name = 'RecreateMessagingTables1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les tables existantes si elles existent
    await queryRunner.query('DROP TABLE IF EXISTS messages');
    await queryRunner.query('DROP TABLE IF EXISTS conversations');
    await queryRunner.query('DROP TABLE IF EXISTS group_participants');
    await queryRunner.query('DROP TABLE IF EXISTS groups');

    // Créer la table groupes
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Créer la table conversation_participants
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Créer la table conversation
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Créer la table messages
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Créer les clés étrangères
    await queryRunner.createForeignKey(
      'conversation_participants',
      new TableForeignKey({
        columnNames: ['conversation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'conversation',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'conversation_participants',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'conversation',
      new TableForeignKey({
        columnNames: ['groupe_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groupes',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'conversation',
      new TableForeignKey({
        columnNames: ['last_message_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'messages',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['sender_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['recipient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['groupe_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groupes',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'messages',
      new TableForeignKey({
        columnNames: ['conversation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'conversation',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les clés étrangères
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

    // Supprimer les tables
    await queryRunner.dropTable('messages');
    await queryRunner.dropTable('conversation');
    await queryRunner.dropTable('conversation_participants');
    await queryRunner.dropTable('groupes');
  }
}
