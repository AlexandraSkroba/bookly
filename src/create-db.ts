import { DataSource } from "typeorm";

const dbConfig = {
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    migrationsRun: true,
    createDatabase: true,
    logging: true,
    synchronize: false,
};

console.log(dbConfig)

export const createDBIfNotExists = async (): Promise<void> => {
  const dbOptions = dbConfig;
  const { createDatabase, database } = dbOptions;

  if (!createDatabase) {
    return;
  }

  const dataSource = new DataSource({
    type: 'postgres',
    ...dbOptions,
    database: 'postgres'
  });

  await dataSource.initialize();

  const result = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname = '${database}'`
  );

  if (!result.length) {
    console.log(`Creating database with name "${database}"`);
    await dataSource.query(`CREATE DATABASE "${database}"`);
  }

  await dataSource.destroy();
}
