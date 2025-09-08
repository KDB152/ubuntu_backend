const { createConnection } = require('typeorm');
const { Groupe } = require('./dist/modules/messaging/entities/groupe.entity');
const { ConversationParticipant } = require('./dist/modules/messaging/entities/conversation-participant.entity');
const { Conversation } = require('./dist/modules/messaging/entities/conversation.entity');
const { User } = require('./dist/modules/users/entities/user.entity');
const { Student } = require('./dist/modules/students/entities/student.entity');
const { Parent } = require('./dist/modules/parents/entities/parent.entity');
const { ParentStudent } = require('./dist/modules/relations/entities/parent-student.entity');

async function populateMessagingGroups() {
  const connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'chrono_carto',
    entities: [Groupe, ConversationParticipant, Conversation, User, Student, Parent, ParentStudent],
    synchronize: false,
  });

  try {
    console.log('🚀 Début du peuplement des groupes de messagerie...');

    // Récupérer l'admin
    const adminUser = await connection.getRepository(User).findOne({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      throw new Error('Aucun utilisateur admin trouvé');
    }

    console.log(`✅ Admin trouvé: ${adminUser.firstName} ${adminUser.lastName}`);

    // Créer les 7 groupes (4 terminale + 3 première)
    const classLevels = [
      'Terminale groupe 1',
      'Terminale groupe 2', 
      'Terminale groupe 3',
      'Terminale groupe 4',
      '1ère groupe 1',
      '1ère groupe 2',
      '1ère groupe 3'
    ];

    const createdGroups = [];

    for (const classLevel of classLevels) {
      // Vérifier si le groupe existe déjà
      let groupe = await connection.getRepository(Groupe).findOne({
        where: { class_level: classLevel }
      });

      if (!groupe) {
        // Créer le groupe
        groupe = connection.getRepository(Groupe).create({
          title: `Groupe ${classLevel}`,
          class_level: classLevel
        });
        groupe = await connection.getRepository(Groupe).save(groupe);
        console.log(`✅ Groupe créé: ${groupe.title}`);
      } else {
        console.log(`ℹ️  Groupe existant: ${groupe.title}`);
      }

      createdGroups.push(groupe);

      // Récupérer tous les étudiants de cette classe
      const students = await connection.getRepository(Student).find({
        where: { class_level: classLevel },
        relations: ['user']
      });

      console.log(`📚 ${students.length} étudiants trouvés pour ${classLevel}`);

      // Créer la conversation pour le groupe
      let conversation = await connection.getRepository(Conversation).findOne({
        where: { groupe_id: groupe.id }
      });

      if (!conversation) {
        conversation = connection.getRepository(Conversation).create({
          groupe_id: groupe.id
        });
        conversation = await connection.getRepository(Conversation).save(conversation);
        console.log(`✅ Conversation créée pour le groupe ${groupe.title}`);
      }

      // Ajouter l'admin au groupe
      let adminParticipant = await connection.getRepository(ConversationParticipant).findOne({
        where: { 
          user_id: adminUser.id,
          conversation_id: conversation.id
        }
      });

      if (!adminParticipant) {
        adminParticipant = connection.getRepository(ConversationParticipant).create({
          conversation_id: conversation.id,
          user_id: adminUser.id,
          groupe_id: groupe.id
        });
        await connection.getRepository(ConversationParticipant).save(adminParticipant);
        console.log(`✅ Admin ajouté au groupe ${groupe.title}`);
      }

      // Ajouter tous les étudiants au groupe
      for (const student of students) {
        let studentParticipant = await connection.getRepository(ConversationParticipant).findOne({
          where: { 
            user_id: student.user_id,
            conversation_id: conversation.id
          }
        });

        if (!studentParticipant) {
          studentParticipant = connection.getRepository(ConversationParticipant).create({
            conversation_id: conversation.id,
            user_id: student.user_id,
            groupe_id: groupe.id
          });
          await connection.getRepository(ConversationParticipant).save(studentParticipant);
        }
      }

      console.log(`✅ ${students.length} étudiants ajoutés au groupe ${groupe.title}`);
    }

    // Les conversations de groupe sont déjà créées dans la boucle précédente

    // Créer les conversations individuelles admin-parent
    const parents = await connection.getRepository(Parent).find({
      relations: ['user']
    });

    console.log(`👨‍👩‍👧‍👦 ${parents.length} parents trouvés`);

    for (const parent of parents) {
      // Vérifier si une conversation existe déjà entre admin et ce parent
      let conversation = await connection.getRepository(Conversation).findOne({
        where: [
          { groupe_id: null }
        ]
      });

      // Vérifier les participants de cette conversation
      if (conversation) {
        const participants = await connection.getRepository(ConversationParticipant).find({
          where: { conversation_id: conversation.id }
        });

        const hasAdmin = participants.some(p => p.user_id === adminUser.id);
        const hasParent = participants.some(p => p.user_id === parent.user_id);

        if (hasAdmin && hasParent) {
          console.log(`ℹ️  Conversation existante entre admin et ${parent.user.firstName} ${parent.user.lastName}`);
          continue;
        }
      }

      // Créer une nouvelle conversation
      conversation = connection.getRepository(Conversation).create({
        groupe_id: null
      });
      conversation = await connection.getRepository(Conversation).save(conversation);

      // Ajouter l'admin à la conversation
      const adminParticipant = connection.getRepository(ConversationParticipant).create({
        conversation_id: conversation.id,
        user_id: adminUser.id
      });
      await connection.getRepository(ConversationParticipant).save(adminParticipant);

      // Ajouter le parent à la conversation
      const parentParticipant = connection.getRepository(ConversationParticipant).create({
        conversation_id: conversation.id,
        user_id: parent.user_id
      });
      await connection.getRepository(ConversationParticipant).save(parentParticipant);

      console.log(`✅ Conversation créée entre admin et ${parent.user.firstName} ${parent.user.lastName}`);
    }

    // Créer les conversations parent-enfant
    const parentStudentRelations = await connection.getRepository(ParentStudent).find({
      relations: ['parent', 'student', 'parent.user', 'student.user']
    });

    console.log(`🔗 ${parentStudentRelations.length} relations parent-enfant trouvées`);

    for (const relation of parentStudentRelations) {
      // Vérifier que les relations existent
      if (!relation.parent || !relation.student || !relation.parent.user || !relation.student.user) {
        console.log(`⚠️  Relation parent-enfant incomplète, ignorée`);
        continue;
      }

      // Vérifier si une conversation existe déjà entre ce parent et cet enfant
      let conversation = await connection.getRepository(Conversation).findOne({
        where: { groupe_id: null }
      });

      if (conversation) {
        const participants = await connection.getRepository(ConversationParticipant).find({
          where: { conversation_id: conversation.id }
        });

        const hasParent = participants.some(p => p.user_id === relation.parent.user_id);
        const hasStudent = participants.some(p => p.user_id === relation.student.user_id);

        if (hasParent && hasStudent) {
          console.log(`ℹ️  Conversation existante entre ${relation.parent.user.firstName} et ${relation.student.user.firstName}`);
          continue;
        }
      }

      // Créer une nouvelle conversation
      conversation = connection.getRepository(Conversation).create({
        groupe_id: null
      });
      conversation = await connection.getRepository(Conversation).save(conversation);

      // Ajouter le parent à la conversation
      const parentParticipant = connection.getRepository(ConversationParticipant).create({
        conversation_id: conversation.id,
        user_id: relation.parent.user_id
      });
      await connection.getRepository(ConversationParticipant).save(parentParticipant);

      // Ajouter l'étudiant à la conversation
      const studentParticipant = connection.getRepository(ConversationParticipant).create({
        conversation_id: conversation.id,
        user_id: relation.student.user_id
      });
      await connection.getRepository(ConversationParticipant).save(studentParticipant);

      console.log(`✅ Conversation créée entre ${relation.parent.user.firstName} et ${relation.student.user.firstName}`);
    }

    console.log('🎉 Peuplement des groupes de messagerie terminé avec succès!');
    console.log(`📊 Résumé:`);
    console.log(`   - ${createdGroups.length} groupes créés`);
    console.log(`   - ${parents.length} conversations admin-parent créées`);
    console.log(`   - ${parentStudentRelations.length} conversations parent-enfant créées`);

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await connection.close();
  }
}

populateMessagingGroups();
