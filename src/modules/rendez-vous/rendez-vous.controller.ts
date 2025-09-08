import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { RendezVousService } from './rendez-vous.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/rendez-vous')
@UseGuards(JwtAuthGuard)
export class RendezVousController {
  constructor(private readonly rendezVousService: RendezVousService) {}

  @Get()
  async getRendezVous(
    @Req() req: any,
    @Query('parentId') parentId?: string,
    @Query('status') status?: string
  ) {
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Si parentId est fourni, récupérer les rendez-vous pour ce parent
    if (parentId) {
      return this.rendezVousService.getRendezVousByParentId(parentId, status);
    }

    // Sinon, récupérer tous les rendez-vous selon le rôle de l'utilisateur
    if (currentUserRole === 'admin') {
      return this.rendezVousService.getAllRendezVous(status);
    } else if (currentUserRole === 'parent') {
      // Pour les parents, récupérer leurs propres rendez-vous
      return this.rendezVousService.getRendezVousByParentId(currentUserId.toString(), status);
    }

    return [];
  }
}
