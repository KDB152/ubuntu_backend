"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.error('Erreur configuration SMTP:', error);
    }
    else {
        console.log('Configuration SMTP valide');
    }
});
async function sendVerificationEmail(to, token) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const url = `${backendUrl}/auth/verify-token?token=${token}`;
    try {
        const info = await transporter.sendMail({
            from: `"Chrono Carto" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Vérifiez votre adresse email pour Chrono-Carto',
            html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification d'email - Chrono Carto</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #2563eb; margin-bottom: 30px;">Bienvenue sur Chrono-Carto ! 🎓</h1>
            
            <p style="font-size: 16px; margin-bottom: 30px;">
              Merci de vous être inscrit sur notre plateforme d'Histoire-Géographie.
              Pour finaliser votre inscription, veuillez vérifier votre adresse email.
            </p>
            
            <div style="margin: 40px 0;">
              <a href="${url}" 
                 style="display: inline-block; background: #2563eb; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                ✅ Vérifier mon email
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
              <a href="${url}" style="color: #2563eb; word-break: break-all;">${url}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #888;">
              Si vous n'avez pas créé de compte sur Chrono-Carto, veuillez ignorer cet email.
            </p>
          </div>
        </body>
        </html>
      `,
        });
        console.log(`✅ Email de vérification envoyé à ${to}`);
        console.log(`📧 URL de vérification: ${url}`);
        console.log(`📬 Message ID: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error(`❌ Erreur d'envoi email de vérification à ${to}:`, error);
        throw error;
    }
}
async function sendPasswordResetEmail(to, token) {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    try {
        const info = await transporter.sendMail({
            from: `"Chrono Carto" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Réinitialisation de votre mot de passe Chrono-Carto',
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
              <a href="${url}" 
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
              <a href="${url}" style="color: #dc2626; word-break: break-all;">${url}</a>
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
        });
        console.log(`✅ Email de réinitialisation envoyé à ${to}`);
        console.log(`📧 URL de réinitialisation: ${url}`);
        console.log(`📬 Message ID: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error(`❌ Erreur d'envoi email de réinitialisation à ${to}:`, error);
        throw error;
    }
}
//# sourceMappingURL=email.util.js.map