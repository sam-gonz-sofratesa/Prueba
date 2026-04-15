import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('firmas')
export class Firmas {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    // UUID v7 desde Postgres 17, o usa la librería 'uuidv7' de npm
    this.id = require('uuidv7').uuidv7();
  }

  @Column()
  key: string;

  @OneToOne(() => User, (user) => user.firma)
  user: User;
}
