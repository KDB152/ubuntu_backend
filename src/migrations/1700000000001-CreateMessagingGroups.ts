import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateMessagingGroups1700000000001 implements MigrationInterface {
  name = 'CreateMessagingGroups1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer la table groups
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Créer la table group_participants
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Ajouter les colonnes group_id à la table conversations
    await queryRunner.addColumn(
      'conversations',
      new TableColumn({
        name: 'group_id',
        type: 'int',
        isNullable: true,
      }),
    );

    // Créer les clés étrangères pour group_participants
    await queryRunner.createForeignKey(
      'group_participants',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'group_participants',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Créer la clé étrangère pour conversations.group_id
    await queryRunner.createForeignKey(
      'conversations',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les clés étrangères
    const conversationsTable = await queryRunner.getTable('conversations');
    const groupForeignKey = conversationsTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('group_id') !== -1,
    );
    if (groupForeignKey) {
      await queryRunner.dropForeignKey('conversations', groupForeignKey);
    }

    const groupParticipantsTable = await queryRunner.getTable('group_participants');
    const groupParticipantsForeignKeys = groupParticipantsTable.foreignKeys;
    for (const foreignKey of groupParticipantsForeignKeys) {
      await queryRunner.dropForeignKey('group_participants', foreignKey);
    }

    // Supprimer la colonne group_id de conversations
    await queryRunner.dropColumn('conversations', 'group_id');

    // Supprimer les tables
    await queryRunner.dropTable('group_participants');
    await queryRunner.dropTable('groups');
  }
}
