import type { IrreversibleMigration, MigrationContext } from '@/databases/types';

const defaultTimestampColumns = ['createdAt', 'updatedAt'];
const tablesWithDefaultTimestamps = [
	'auth_identity',
	'credentials_entity',
	'event_destinations',
	'installed_packages',
	'role',
	'shared_credentials',
	'shared_workflow',
	'tag_entity',
	'user',
	'workflow_entity',
];

const additionalColumns = {
	auth_provider_sync_history: ['endedAt', 'startedAt'],
	execution_entity: ['startedAt', 'stoppedAt', 'waitTill'],
	workflow_statistics: ['latestEvent'],
};

export class MigrateToTimestampZ1692207852593 implements IrreversibleMigration {
	async up({ queryRunner, tablePrefix }: MigrationContext) {
		const changeColumnType = async (tableName: string, columnName: string) =>
			queryRunner.query(
				`ALTER TABLE "${tablePrefix}${tableName}" ALTER COLUMN "${columnName}" TYPE TIMESTAMPTZ(3)`,
			);

		for (const tableName of tablesWithDefaultTimestamps) {
			for (const columnName of defaultTimestampColumns) {
				await changeColumnType(tableName, columnName);
			}
		}
		for (const [tableName, columnNames] of Object.entries(additionalColumns)) {
			for (const columnName of columnNames) {
				await changeColumnType(tableName, columnName);
			}
		}
	}
}
