import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ErrorServicesService } from 'src/common/error-services/error-services';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/rol/entities/rol.entity';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { R2Service } from 'src/files/r2/r2.service';
import { FileName } from 'src/files/dto/file-name.dto';
import { Firmas } from './entities/firmas.entity';
import { UserParamsDto } from './dto/user-params.dto';
import { DEFAULT_PAGE_SIZE } from 'src/common/constantes/constantes';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Firmas)
    private readonly firmaRepository: Repository<Firmas>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorServices: ErrorServicesService,
    private readonly jwtService: JwtService,
    private readonly r2: R2Service,
  ) {}

  private readonly logger = new Logger('UserService');

  private generateTempPassword(): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '@$!%*?&._-';
    const all = upper + lower + digits + special;

    // Garantiza al menos uno de cada tipo requerido
    const required = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)],
    ];

    // Completa hasta 10 caracteres con caracteres aleatorios
    const rest = Array.from(
      { length: 6 },
      () => all[Math.floor(Math.random() * all.length)],
    );

    // Mezcla para que los caracteres requeridos no siempre estén al inicio
    return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
  }

  async register(createUserDto: CreateUserDto) {
    //Funcion que permite a los supervisores registrar a los usuarios con columnas limitadas
    try {
      const temp_password = this.generateTempPassword();
      const hash = bcrypt.hashSync(temp_password, 10);
      const rolesIds = createUserDto.rolId?.length ? createUserDto.rolId : [1];
      const { rolId, departamentoId, proyectoId, ...rest } = createUserDto;

      const user = this.userRepository.create({
        ...rest,
        password: hash,
        roles: rolesIds.map((users) => ({ id: users })),
        departamento: { id: departamentoId },
        proyecto: { id: proyectoId },
      });

      const savedUser = await this.userRepository.save(user);

      const { password: _password, ...userSafe } = savedUser;

      return {
        user: userSafe,
      };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async registerAdmin(createUserAdminDto: CreateUserAdminDto) {
    //Funcion encargada de registrar un usuario junto a todas sus columnas
    try {
      const rolesIds = createUserAdminDto.rolId?.length
        ? createUserAdminDto.rolId
        : [1];
      const { password, rolId, departamentoId, proyectoId, ...rest } =
        createUserAdminDto;

      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password.trim(), 10),
        roles: rolesIds.map((users) => ({ id: users })),
        departamento: { id: departamentoId },
        proyecto: proyectoId ? { id: proyectoId } : undefined,
      });

      const savedUser = await this.userRepository.save(user);

      const { password: _password, ...userSafe } = savedUser;

      return {
        user: userSafe,
      };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    //Funcion encargada de loguear al usuario
    try {
      const { codigo_empleado, password } = loginUserDto;

      const user = await this.userRepository.findOne({
        where: { codigo_empleado: codigo_empleado, isActive: true },
        select: [
          'id',
          'nombre_apellido',
          'codigo_empleado',
          'password',
          'sexo',
          'tipo_identificacion',
          'numero_identificacion',
          'isActive',
        ],
        relations: { roles: true, departamento: true, proyecto: true },
      });
      if (!user) {
        throw new NotFoundException({
          message: `El usuario o la contraseña es incorrecta. Intente de nuevo.`,
          status: 404,
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new NotFoundException({
          message: `El usuario o la contraseña es incorrecta. Intente de nuevo.`,
          status: 404,
        });
      }

      const { password: password_, ...rest } = user;
      return {
        user: rest,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async me(userCache: User) {
    //Funcion encargada de relogear al usuario
    try {
      const user = await this.userRepository.findOne({
        where: { codigo_empleado: userCache.codigo_empleado, isActive: true },
        relations: { roles: true, departamento: true, proyecto: true },
      });
      if (!user) {
        throw new NotFoundException({
          message: `El usuario o la contraseña es incorrecta. Intente de nuevo.`,
          status: 404,
        });
      }

      const { password: password_, ...rest } = user;
      return {
        user: rest,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findAll(dto: UserParamsDto, inactivo: boolean = true) {
    //Funcion encargada de traer todos los usuarios ya sean activos o inactivos
    try {
      const { departamento, proyecto, rol, limit, page } = dto;
      const [user, total] = await this.userRepository.findAndCount({
        where: {
          isActive: inactivo,
          departamento: departamento ? { id: departamento } : undefined,
          proyecto: proyecto ? { id: proyecto } : undefined,
          roles: rol ? rol.map((rol) => ({ id: rol })) : undefined,
        },
        relations: {
          departamento: true,
          roles: true,
          proyecto: true,
          firma: true,
        },
        take: limit,
        skip: (page - 1) * limit,
      });

      const lastPage = Math.ceil(total / limit);
      return {
        data: user,
        meta: { page, total, lastPage },
      };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async findOne(id: string, isActive: boolean = true) {
    //Funcion encargada de buscar por id tanto activos como inactivos
    try {
      const user = await this.userRepository.findOne({
        where: { id, isActive: isActive },
        relations: { roles: true, departamento: true, proyecto: true },
      });
      if (!user) {
        throw new NotFoundException({
          message: `El usuario con id ${id} no existe`,
          status: 404,
        });
      }
      return user;
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  // async updatePassword(id: string, newPassword: string) {
  //   //Funcion encargada de actualizar la contraseña del usuario.
  //   try {
  //     const before = await this.userRepository.findOneBy({ id });
  //     if (!before) {
  //       throw new NotFoundException({
  //         message: `El user con id ${id} no existe`,
  //         status: 404,
  //       });
  //     }
  //     const hashed = bcrypt.hashSync(newPassword.trim(), 10);
  //     const merged = this.userRepository.merge(before, { password: hashed }); //Se hace de esta manera y no con un update, para asi poder mantener un correcto registro en el audit_log
  //     await this.userRepository.save(merged);
  //     return { message: 'Usuario actualizado con éxito', ok: true };
  //   } catch (e) {
  //     this.errorServices.handleError(e, this.logger);
  //   }
  // }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = dto;

    // 1. Validación cruzada de campos
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'La nueva contraseña y su confirmación no coinciden',
      );
    }

    // 2. Verificar que la nueva contraseña sea diferente a la actual
    if (currentPassword === newPassword) {
      throw new BadRequestException(
        'La nueva contraseña no puede ser igual a la actual',
      );
    }

    // 3. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        password: true, // 👈 se pide explícitamente
      },
    });

    if (!user) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }

    // 4. Verificar contraseña actual
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // 5. Hashear y guardar
    const hashed = bcrypt.hashSync(newPassword.trim(), 10);
    const merged = this.userRepository.merge(user, { password: hashed });
    await this.userRepository.save(merged);

    return { message: 'Contraseña actualizada con éxito', ok: true };
  }

  async updateFirma(id: string, file: Express.Multer.File) {
    //funcion encargada de actualizar la firma del usuario
    try {
      const file_image = new FileName(id, 'Firmas', file.buffer, 'user');
      const key = await this.r2.uploadImage(file_image);

      const user = await this.userRepository.findOne({
        where: { id },
        relations: { firma: true },
      });

      if (!user) {
        throw new NotFoundException({
          message: `El usuario con id ${id} no existe`,
          status: 404,
        });
      }

      const firma = user.firma
        ? { ...user.firma, key }
        : this.firmaRepository.create({ key, user });

      const savedFirma = await this.firmaRepository.save(firma);
      if (!user.firma) {
        user.firma = savedFirma;
      }

      await this.userRepository.save(user);

      const url = await this.r2.urlFirmada(key, 300);

      return { ok: true, key, url };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async updateRol(id: string, roles: string[]) {
    try {
      const before = await this.userRepository.findOne({
        where: { id },
        relations: { roles: true },
      });

      if (!before) {
        throw new NotFoundException({
          message: `El user con id ${id} no existe`,
          status: 404,
        });
      }

      const merged = this.userRepository.merge(before, {
        roles: roles.map((roleId) => ({ id: roleId })),
        updatedAt: new Date(),
      });

      await this.userRepository.save(merged);

      return { message: 'Usuario actualizado con éxito', ok: true };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async getFirmaUrl(id: string, tiempo: number) {
    //Funcion encargada de traer la firma del usuario en una signed url
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: { firma: true },
      });
      if (!user?.firma) return { url: null };

      const url = await this.r2.urlFirmada(user.firma.key, tiempo);
      return { url };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async updateAdmin(id: string, updateUserAdminDto: UpdateUserAdminDto) {
    //Funcion encargada de actualizar los usuarios junto con todas sus columnas
    try {
      const rol = await this.userRepository.update(id, updateUserAdminDto);
      return rol;
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }

  async eliminarRestaurar(id: string, isActivev: boolean = true) {
    //Funcion encargada de eliminar y restaurar a los usuarios
    try {
      const user = await this.userRepository.findOne({
        where: { id, isActive: isActivev },
      });
      if (!user) {
        throw new NotFoundException({
          message: `El usuario con id ${id} no existe`,
          status: 404,
        });
      }

      const merge = this.userRepository.merge(user, { isActive: !isActivev });
      await this.userRepository.save(merge);
      return {
        message: `El usuario con id ${id} ha sido ${isActivev == true ? 'eliminado' : 'restaurado'} correctamente`,
        statusCode: 200,
      };
    } catch (e) {
      this.errorServices.handleError(e, this.logger);
    }
  }
}
