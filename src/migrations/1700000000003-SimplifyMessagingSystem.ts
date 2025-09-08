import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class SimplifyMessagingSystem1700000000003 implements MigrationInterface {
  name = 'SimplifyMessagingSystem1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Supprimer la table conversation_participants
    await queryRunner.query('DROP TABLE IF EXISTS conversation_participants');

    // Ajouter les colonnes nécessaires à la table conversation
    await queryRunner.addColumn(
      'conversation',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        length: '50',
        default: "'direct'", // 'direct', 'group', 'class'
      }),
    );

    await queryRunner.addColumn(
      'conversation',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'conversation',
      new TableColumn({
        name: 'participant1_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'conversation',
      new TableColumn({
        name: 'participant2_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'conversation',
      new TableColumn({
        name: 'class_level',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );

    // Créer les clés étrangères pour les participants
    await queryRunner.createForeignKey(
      'conversation',
      new TableForeignKey({
        columnNames: ['participant1_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'conversation',
      new TableForeignKey({
        columnNames: ['participant2_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les clés étrangères
    const conversationTable = await queryRunner.getTable('conversation');
    const foreignKeys = conversationTable.foreignKeys;
    
    for (const foreignKey of foreignKeys) {
      if (foreignKey.columnNames.includes('participant1_id') || 
          foreignKey.columnNames.includes('participant2_id')) {
        await queryRunner.dropForeignKey('conversation', foreignKey);
      }
    }

    // Supprimer les colonnes ajoutées
    await queryRunner.dropColumn('conversation', 'type');
    await queryRunner.dropColumn('conversation', 'title');
    await queryRunner.dropColumn('conversation', 'participant1_id');
    await queryRunner.dropColumn('conversation', 'participant2_id');
    await queryRunner.dropColumn('conversation', 'class_level');

    // Recréer la table conversation_participants
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
  }
}
