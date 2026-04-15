import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { CommonModule } from 'src/common/common.module';
import { Proyecto } from '../proyecto/entities/proyecto.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { R2Module } from 'src/files/r2/r2.module';
import { Firmas } from './entities/firmas.entity';
@Module({
  imports: [
    ConfigModule,
    R2Module,
    TypeOrmModule.forFeature([User, Departamento, Proyecto, Rol, Firmas]),
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '6h' },
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class UserModule {}
