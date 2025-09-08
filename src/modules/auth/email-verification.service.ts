// src/modules/auth/email-verification.service.ts (VERSION COMPLÈTE)
import { Injectable, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../utils/email.util';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Vérification de la configuration au démarrage
    this.verifyEmailConfig();
  }

  private async verifyEmailConfig() {
    try {
      await this.transporter.verify();
      this.logger.log('✅ Configuration email validée avec succès');
    } catch (error) {
      this.logger.error('❌ Erreur configuration email:', error.message);
    }
  }

  // === VÉRIFICATION D'EMAIL PAR CODE ===
  
  async sendVerificationCode(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    if (user.email_verified) {
      throw new HttpException('Email déjà vérifié', HttpStatus.BAD_REQUEST);
    }

    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15); // Expire dans 15 minutes

    user.email_verification_code = code;
    user.email_verification_code_expiry = expiryTime;
    await this.userRepository.save(user);

    // Envoyer le code par email
    await this.sendVerificationCodeEmail(email, code);

    this.logger.log(`Code de vérification envoyé à ${email}`);
    return { message: 'Code de vérification envoyé par email' };
  }

  async verifyCode(email: string, code: string): Promise<{ message: string; email: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    if (!user.email_verification_code || !user.email_verification_code_expiry) {
      throw new HttpException('Aucun code de vérification trouvé', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > user.email_verification_code_expiry) {
      throw new HttpException('Code de vérification expiré', HttpStatus.BAD_REQUEST);
    }

    if (user.email_verification_code !== code) {
      throw new HttpException('Code de vérification invalide', HttpStatus.BAD_REQUEST);
    }

    // Marquer l'email comme vérifié
    user.email_verified = true;
    user.email_verification_code = null;
    user.email_verification_code_expiry = null;
    await this.userRepository.save(user);

    this.logger.log(`✅ Email vérifié avec succès pour ${email}`);
    return { message: 'Email vérifié avec succès', email };
  }

  // === VÉRIFICATION D'EMAIL PAR LIEN ===
  
  async sendVerificationLink(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    if (user.email_verified) {
      this.logger.warn(`Tentative d'envoi de vérification pour email déjà vérifié: ${email}`);
      // Ne pas révéler que l'email est déjà vérifié pour des raisons de sécurité
      return { message: 'Si un compte existe avec cet email, un lien de vérification a été envoyé' };
    }

    // Générer un token unique
    const token = uuidv4();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 24); // Expire dans 24 heures

    user.verification_token = token;
    user.verification_token_expiry = expiryTime;
    await this.userRepository.save(user);

    // Envoyer l'email avec le lien
    await sendVerificationEmail(email, token);

    this.logger.log(`✅ Lien de vérification envoyé à ${email}`);
    return { message: 'Un lien de vérification a été envoyé à votre adresse email' };
  }

  async verifyToken(token: string): Promise<{ message: string; email: string }> {
    this.logger.log(`🔍 Vérification du token: ${token.substring(0, 8)}...`);
    
    const user = await this.userRepository.findOne({ 
      where: { verification_token: token } 
    });

    if (!user) {
      this.logger.error('❌ Token de vérification invalide ou expiré');
      throw new HttpException('Token de vérification invalide ou expiré', HttpStatus.BAD_REQUEST);
    }

    if (!user.verification_token_expiry || new Date() > user.verification_token_expiry) {
      this.logger.error('❌ Token de vérification expiré');
      throw new HttpException('Token de vérification expiré', HttpStatus.BAD_REQUEST);
    }

    // Marquer l'email comme vérifié
    user.email_verified = true;
    user.verification_token = null;
    user.verification_token_expiry = null;
    await this.userRepository.save(user);

    this.logger.log(`✅ Email vérifié avec succès pour: ${user.email}`);
    return { message: 'Email vérifié avec succès', email: user.email };
  }

  // === RÉINITIALISATION DE MOT DE PASSE PAR CODE ===
  
  async sendPasswordResetCode(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Ne pas révéler si l'utilisateur existe ou non
      return { message: 'Si un compte existe avec cet email, un code de réinitialisation a été envoyé' };
    }

    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15); // Expire dans 15 minutes

    user.password_reset_code = code;
    user.password_reset_code_expiry = expiryTime;
    await this.userRepository.save(user);

    // Envoyer le code par email
    await this.sendPasswordResetCodeEmail(email, code);

    this.logger.log(`Code de réinitialisation envoyé à ${email}`);
    return { message: 'Si un compte existe avec cet email, un code de réinitialisation a été envoyé' };
  }

  async verifyPasswordResetCode(email: string, code: string): Promise<{ message: string; resetToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('Utilisateur non trouvé', HttpStatus.NOT_FOUND);
    }

    if (!user.password_reset_code || !user.password_reset_code_expiry) {
      throw new HttpException('Aucun code de réinitialisation trouvé', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > user.password_reset_code_expiry) {
      throw new HttpException('Code de réinitialisation expiré', HttpStatus.BAD_REQUEST);
    }

    if (user.password_reset_code !== code) {
      throw new HttpException('Code de réinitialisation invalide', HttpStatus.BAD_REQUEST);
    }

    // Générer un token de réinitialisation
    const resetToken = uuidv4();
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + 1); // Expire dans 1 heure

    user.password_reset_token = resetToken;
    user.password_reset_token_expiry = expiryTime;
    user.password_reset_code = null;
    user.password_reset_code_expiry = null;
    await this.userRepository.save(user);

    this.logger.log(`Code de réinitialisation vérifié pour ${email}`);
    return { message: 'Code vérifié avec succès', resetToken };
  }

  // === RÉINITIALISATION DE MOT DE PASSE PAR LIEN ===
  
async sendPasswordResetLink(email: string): Promise<{ success: boolean; message: string }> {
  const user = await this.userRepository.findOne({ where: { email } });
  
  if (!user) {
    throw new NotFoundException('Utilisateur non trouvé');
  }

  // Générer un token unique
  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

  // Sauvegarder le token dans la base de données
  user.password_reset_token = resetToken;
  user.password_reset_token_expiry = resetTokenExpiry;
  await this.userRepository.save(user);

  // Envoyer l'email avec le token
  await this.sendPasswordResetEmailWithToken(email, resetToken);

  return {
    success: true,
    message: 'Un lien de réinitialisation a été envoyé à votre adresse email'
  };
}
  // Méthode supprimée car non utilisée

  // === MÉTHODES PRIVÉES POUR L'ENVOI D'EMAILS ===

  private async sendVerificationCodeEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Chrono Carto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Code de vérification - Chrono Carto',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code de vérification - Chrono Carto</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #2563eb; margin-bottom: 30px;">Code de vérification 🔑</h1>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Voici votre code de vérification pour finaliser votre inscription sur Chrono-Carto :
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 30px 0; border: 2px dashed #2563eb;">
              <h2 style="font-size: 36px; color: #2563eb; margin: 0; letter-spacing: 5px; font-family: monospace;">
                ${code}
              </h2>
            </div>
            
            <p style="font-size: 14px; color: #f59e0b; background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ⏰ <strong>Ce code expire dans 15 minutes</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #888;">
              Si vous n'avez pas créé de compte sur Chrono-Carto, veuillez ignorer cet email.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Code de vérification envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi code à ${email}:`, error);
      throw new HttpException('Erreur lors de l\'envoi de l\'email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async sendPasswordResetCodeEmail(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: `"Chrono Carto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Code de réinitialisation - Chrono Carto',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code de réinitialisation - Chrono Carto</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #dc2626; margin-bottom: 30px;">🔒 Code de réinitialisation</h1>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Voici votre code de réinitialisation pour changer votre mot de passe :
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 30px 0; border: 2px dashed #dc2626;">
              <h2 style="font-size: 36px; color: #dc2626; margin: 0; letter-spacing: 5px; font-family: monospace;">
                ${code}
              </h2>
            </div>
            
            <p style="font-size: 14px; color: #f59e0b; background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ⏰ <strong>Ce code expire dans 15 minutes</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #888;">
              Si vous n'avez pas demandé de réinitialisation, veuillez ignorer cet email.
            </p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Code de réinitialisation envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi code reset à ${email}:`, error);
      throw new HttpException('Erreur lors de l\'envoi de l\'email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async sendPasswordResetEmailWithToken(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"Chrono Carto" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Chrono Carto',
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation mot de passe - Chrono Carto</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #dc2626; margin-bottom: 30px;">🔒 Réinitialisation de mot de passe</h1>
          
          <p style="font-size: 16px; margin-bottom: 30px;">
            Vous avez demandé à réinitialiser votre mot de passe sur Chrono-Carto.
            Cliquez sur le bouton ci-dessous pour continuer.
          </p>
          
          <div style="margin: 40px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              🔑 Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p style="font-size: 14px; color: #f59e0b; background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ⏰ <strong>Ce lien expirera dans 1 heure</strong>
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
            <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #888;">
            Si vous n'avez pas demandé de réinitialisation, veuillez ignorer cet email.<br>
            Votre mot de passe restera inchangé.
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Email de réinitialisation envoyé à ${email}`);
  } catch (error) {
    console.error(`❌ Erreur d'envoi email de réinitialisation à ${email}:`, error);
    throw new HttpException(
      'Erreur lors de l\'envoi de l\'email de réinitialisation',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
  }