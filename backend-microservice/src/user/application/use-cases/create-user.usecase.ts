import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/ports/user.repository.interface';
import { IPasswordService } from '../../../auth/domain/ports/password.service.interface';
import { UserEntity } from '../../domain/entities/user.entity';

export interface CreateUserInput {
  nombre_apellido:       string;
  codigo_empleado:       string;
  sexo:                  string;
  tipo_identificacion:   string;
  numero_identificacion: string;
  password:              string;
  isActive?:             boolean;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IPasswordService')
    private readonly passwordSvc: IPasswordService,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const existsByCodigo = await this.userRepo.findByCodigo(input.codigo_empleado);
    if (existsByCodigo) throw new ConflictException('El código de empleado ya está registrado');

    const existsByIdentificacion = await this.userRepo.findByNumeroIdentificacion(input.numero_identificacion);
    if (existsByIdentificacion) throw new ConflictException('El número de identificación ya está registrado');

    const passwordHash = await this.passwordSvc.hash(input.password);

    return this.userRepo.create(
      new UserEntity({
        nombre_apellido:       input.nombre_apellido,
        codigo_empleado:       input.codigo_empleado,
        sexo:                  input.sexo,
        tipo_identificacion:   input.tipo_identificacion,
        numero_identificacion: input.numero_identificacion,
        passwordHash,
        isActive:              input.isActive ?? true,
      }),
    );
  }
}
