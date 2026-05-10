/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    this.logger.log('Attempting to connect to MongoDB...');

    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to MongoDB database!');

      // Optional: Test the connection by running a simple query
      const dbStats = await this.$runCommandRaw({ dbStats: 1 });
      this.logger.log(
        `📊 Database: ${process.env.DATABASE_URL?.split('/').pop() || 'MongoDB'}`,
      );
    } catch (error) {
      this.logger.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from MongoDB...');
    await this.$disconnect();
    this.logger.log('Disconnected from MongoDB');
  }
}
