import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  create(entity: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByCodigo(codigo_empleado: string): Promise<UserEntity | null>;
  findByNumeroIdentificacion(numero_identificacion: string): Promise<UserEntity | null>;
  update(id: string, partial: Partial<UserEntity>): Promise<UserEntity>;
}
