import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT) ?? 5432,
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres',
        database: process.env.DB_NAME ?? 'BooklyDB',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.PRODUCTION === 'true' ? false : true,
        logging: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
