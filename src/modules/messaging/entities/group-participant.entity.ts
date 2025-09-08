import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Group } from './group.entity';
import { User } from '../../users/entities/user.entity';

@Entity('group_participants')
export class GroupParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id' })
  group_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'varchar', length: 50, default: 'member' })
  role: string; // 'member', 'admin', 'moderator'

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Group, group => group.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
