import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';
import { Firmas } from './firmas.entity';
import { FormDato } from 'src/form_datos/entities/form_dato.entity';
import { Responsable } from 'src/responsables/entities/responsable.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    // UUID v7 desde Postgres 17, o usa la librería 'uuidv7' de npm
    this.id = require('uuidv7').uuidv7();
  }

  @Column({ type: 'varchar', length: 125 })
  nombre_apellido: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 15, unique: true })
  codigo_empleado: string;

  @Column({ type: 'varchar', length: 1 })
  sexo: string;

  @Column()
  tipo_identificacion: string;

  @Column({ unique: true })
  numero_identificacion: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ select: false })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
  @ManyToMany(() => Rol, (rol) => rol.users)
  @JoinTable()
  roles: Rol[];

  @ManyToOne(() => Departamento, (departamentos) => departamentos.users)
  departamento: Departamento;

  @ManyToOne(() => Proyecto, (proyectos) => proyectos.users)
  proyecto?: Proyecto;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @OneToOne(() => Firmas, (firma) => firma.user)
  @JoinColumn()
  firma: Firmas;

  @ManyToMany(() => Responsable, (r) => r.user)
  responsables: FormDato[];
}
