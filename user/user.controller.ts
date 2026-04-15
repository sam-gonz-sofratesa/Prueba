import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth, ValidRoles } from './interfaces';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseUUIDPipe } from '@nestjs/common';
import { UserParamsDto, UserRolDto } from './dto/user-params.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { allRoles } from 'src/common/constantes/constantes';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Auth(ValidRoles.supervisor, ValidRoles.admin)
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('register/admin')
  @Auth(ValidRoles.admin)
  registerIt(@Body() createUserAdminDto: CreateUserAdminDto) {
    return this.userService.registerAdmin(createUserAdminDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  findAll(@Query() userParamsDto: UserParamsDto) {
    return this.userService.findAll(userParamsDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('me')
  @Auth(...allRoles)
  me(@GetUser() user: User) {
    return this.userService.me(user);
  }

  @Get('inactivo')
  @Auth(ValidRoles.admin)
  findAllInactivo(@Query() userParamsDto: UserParamsDto) {
    return this.userService.findAll(userParamsDto, false);
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id/inactivo')
  @Auth(ValidRoles.admin)
  findOneInactivo(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id, false);
  }

  @Patch(':id/password')
  @Auth(...allRoles)
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, dto);
  }

  @Patch(':id/rol')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  updateRol(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UserRolDto) {
    return this.userService.updateRol(id, dto.userRolsIds);
  }

  @Get(':id/firma')
  @Auth(...allRoles)
  getFirmaUrl(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getFirmaUrl(id, 300);
  }

  @Patch(':id/firma')
  @UseInterceptors(FileInterceptor('firma'))
  @Auth(ValidRoles.tecnico, ValidRoles.supervisor, ValidRoles.admin)
  updateFirma(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || file.mimetype !== 'image/png') {
      throw new BadRequestException('Solo se permiten PNG');
    }
    return this.userService.updateFirma(id, file);
  }

  @Patch(':id/admin')
  @Auth(ValidRoles.admin)
  updateAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserAdminDto: UpdateUserAdminDto,
  ) {
    return this.userService.updateAdmin(id, updateUserAdminDto);
  }

  @Delete(':id/eliminar')
  @Auth(ValidRoles.admin, ValidRoles.supervisor)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.eliminarRestaurar(id);
  }

  @Put(':id/restaurar') //Volver activo un user
  @Auth(ValidRoles.admin)
  restaurar(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.eliminarRestaurar(id, false);
  }
}
