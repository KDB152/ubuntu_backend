-- Migration pour supprimer les colonnes inutilisées des tables quizzes, questions et quiz_questions

-- Supprimer les colonnes de la table quizzes
ALTER TABLE quizzes DROP COLUMN IF EXISTS pass_score;
ALTER TABLE quizzes DROP COLUMN IF EXISTS tags;
ALTER TABLE quizzes DROP COLUMN IF EXISTS randomize_questions;
ALTER TABLE quizzes DROP COLUMN IF EXISTS total_points;

-- Supprimer la colonne points de la table questions
ALTER TABLE questions DROP COLUMN IF EXISTS points;

-- Supprimer la colonne points de la table quiz_questions (si elle existe)
ALTER TABLE quiz_questions DROP COLUMN IF EXISTS points;
