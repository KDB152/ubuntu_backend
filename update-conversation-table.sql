-- Script pour mettre à jour la table conversation
-- Exécuter ce script directement dans MySQL

-- Supprimer la table conversation_participants si elle existe
DROP TABLE IF EXISTS conversation_participants;

-- Ajouter les nouvelles colonnes à la table conversation
ALTER TABLE conversation 
ADD COLUMN type VARCHAR(50) DEFAULT 'direct',
ADD COLUMN title VARCHAR(255) NULL,
ADD COLUMN participant1_id INT NULL,
ADD COLUMN participant2_id INT NULL,
ADD COLUMN class_level VARCHAR(100) NULL;

-- Ajouter les clés étrangères
ALTER TABLE conversation 
ADD CONSTRAINT FK_conversation_participant1 
FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE conversation 
ADD CONSTRAINT FK_conversation_participant2 
FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE;
