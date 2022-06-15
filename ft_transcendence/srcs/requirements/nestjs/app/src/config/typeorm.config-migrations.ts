import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  logging: process.env.DEBUG === 'true', // if DEBUG === true then this is true.

  type: 'postgres',
  host: 'postgres',
  port: parseInt(process.env.POSTGRES_HOST_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  entities: [__dirname + '/../modules/**/entities/*.entity.js'],
  migrations: [__dirname + '/../migrations/*{.ts, .js}'],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: __dirname + '/../migrations',
  },
};

export default typeOrmConfig;