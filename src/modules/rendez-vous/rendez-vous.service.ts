import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RendezVous } from './entities/rendez-vous.entity';

@Injectable()
export class RendezVousService {
  constructor(
    @InjectRepository(RendezVous)
    private rendezVousRepository: Repository<RendezVous>,
  ) {}

  async getRendezVousByParentId(parentId: string, status?: string) {
    const where: any = { parent_id: parentId };
    if (status) {
      where.status = status;
    }
    return this.rendezVousRepository.find({
      where,
      order: { timing: 'DESC' }
    });
  }

  async getAllRendezVous(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.rendezVousRepository.find({
      where,
      order: { timing: 'DESC' }
    });
  }

  async getRendezVousById(id: number) {
    return this.rendezVousRepository.findOne({
      where: { id }
    });
  }
}
