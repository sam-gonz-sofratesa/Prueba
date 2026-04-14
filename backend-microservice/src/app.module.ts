import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuditLogModule } from './audit_log/audit_log.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuditLogModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
