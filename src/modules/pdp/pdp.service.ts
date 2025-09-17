import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pdp } from './entities/pdp.entity';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PdpService {
  private readonly uploadPath = path.join(__dirname, '..', '..', '..', 'uploads', 'profiles');

  constructor(
    @InjectRepository(Pdp)
    private pdpRepository: Repository<Pdp>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Créer le dossier d'upload s'il n'existe pas
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadProfilePicture(userId: number, file: Express.Multer.File): Promise<Pdp> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, SVG, GIF, WebP');
    }

    // Vérifier la taille (10 Mo max)
    const maxSize = 10 * 1024 * 1024; // 10 Mo en bytes
    if (file.size > maxSize) {
      throw new BadRequestException('Fichier trop volumineux. Taille maximum: 10 Mo');
    }

    // Supprimer l'ancienne photo de profil s'il y en a une
    await this.deleteProfilePicture(userId);

    // Générer un nom unique pour le fichier
    const fileExtension = path.extname(file.originalname);
    const storedName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, storedName);

    console.log('📁 Chemin d\'upload:', this.uploadPath);
    console.log('📁 Chemin complet du fichier:', filePath);
    console.log('📁 Dossier existe:', fs.existsSync(this.uploadPath));

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
      console.log('📁 Dossier créé:', this.uploadPath);
    }

    // Sauvegarder le fichier
    fs.writeFileSync(filePath, file.buffer);
    console.log('💾 Fichier sauvegardé:', filePath);

    // Déterminer le type de fichier pour l'enum
    let fileType: 'JPEG' | 'PNG' | 'SVG' | 'GIF' | 'WebP';
    switch (file.mimetype) {
      case 'image/jpeg':
        fileType = 'JPEG';
        break;
      case 'image/png':
        fileType = 'PNG';
        break;
      case 'image/svg+xml':
        fileType = 'SVG';
        break;
      case 'image/gif':
        fileType = 'GIF';
        break;
      case 'image/webp':
        fileType = 'WebP';
        break;
      default:
        throw new BadRequestException('Type de fichier non reconnu');
    }

    // Créer l'entrée en base de données
    const pdp = this.pdpRepository.create({
      userId,
      fileName: file.originalname,
      storedName,
      filePath,
      fileType,
      fileSize: file.size,
    });

    return await this.pdpRepository.save(pdp);
  }

  async getProfilePicture(userId: number): Promise<Pdp | null> {
    return await this.pdpRepository.findOne({ where: { userId } });
  }

  async deleteProfilePicture(userId: number): Promise<void> {
    const pdp = await this.pdpRepository.findOne({ where: { userId } });
    
    if (pdp) {
      // Supprimer le fichier physique
      if (fs.existsSync(pdp.filePath)) {
        fs.unlinkSync(pdp.filePath);
      }
      
      // Supprimer l'entrée en base de données
      await this.pdpRepository.remove(pdp);
    }
  }

  async getProfilePicturePath(userId: number): Promise<string | null> {
    const pdp = await this.getProfilePicture(userId);
    return pdp ? pdp.filePath : null;
  }

  async getProfilePictureUrl(userId: number): Promise<string | null> {
    const pdp = await this.getProfilePicture(userId);
    if (!pdp) return null;
    
    // Retourner l'URL complète avec le port du backend
    const backendUrl = process.env.BACKEND_URL || 'http://51.77.195.224:3001';
    return `${backendUrl}/uploads/profiles/${pdp.storedName}`;
  }
}
