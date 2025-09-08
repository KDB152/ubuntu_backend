import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'student_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'parent_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'seances_total',
            type: 'int',
            default: 0,
          },
          {
            name: 'seances_non_payees',
            type: 'int',
            default: 0,
          },
          {
            name: 'seances_payees',
            type: 'int',
            default: 0,
          },
          {
            name: 'montant_total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'montant_paye',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'montant_restant',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'prix_seance',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 40,
          },
          {
            name: 'statut',
            type: 'varchar',
            length: '50',
            default: "'en_attente'",
          },
          {
            name: 'date_derniere_presence',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'date_dernier_paiement',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'student_first_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'student_last_name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'class_level',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'parent_first_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'parent_last_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'date_creation',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['student_id'],
            referencedTableName: 'students',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['parent_id'],
            referencedTableName: 'parents',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payments');
  }
}
