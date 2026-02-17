import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { ConfigModule } from '@nestjs/config';
import * as schema from './db/schema';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { PollsModule } from './polls/polls.module';
@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot(),
    DrizzlePostgresModule.register({
      postgres: {
        url: process.env.DATABASE_URL!,
      },
      tag: 'DB',
      config: {
        schema: { ...schema },
      },
    }),
    PollsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
