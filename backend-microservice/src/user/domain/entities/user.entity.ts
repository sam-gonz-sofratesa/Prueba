export class UserEntity {
  id?:                    string;
  nombre_apellido:        string;
  codigo_empleado:        string;
  sexo:                   string;
  tipo_identificacion:    string;
  numero_identificacion:  string;
  isActive:               boolean;
  passwordHash:           string;
  createdAt?:             Date;
  updatedAt?:             Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
