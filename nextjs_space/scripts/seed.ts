
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create test admin user (required for testing)
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      averageCycleLength: 28,
      averagePeriodLength: 5
    }
  });

  // Create example user for testing
  const mariePassword = await bcrypt.hash('marie123', 10);
  const marieUser = await prisma.user.upsert({
    where: { email: 'marie@example.com' },
    update: {},
    create: {
      email: 'marie@example.com',
      hashedPassword: mariePassword,
      firstName: 'Marie',
      lastName: 'Dupont',
      averageCycleLength: 30,
      averagePeriodLength: 4,
      dateOfBirth: new Date('1990-05-15')
    }
  });

  // Create sample educational content
  const educationalContent = [
    {
      title: 'Comprendre votre cycle menstruel',
      category: 'cycle-basics',
      content: `Le cycle menstruel est un processus naturel qui se répète environ tous les 28 jours chez la plupart des femmes. Il se compose de quatre phases principales :

**Phase menstruelle (jours 1-5)** : C'est le début de votre cycle, marqué par les règles. L'endomètre (muqueuse utérine) se détache, provoquant les saignements.

**Phase folliculaire (jours 1-13)** : Vos ovaires préparent un ovule pour l'ovulation. Les hormones FSH et LH commencent à augmenter.

**Phase d'ovulation (jour 14)** : L'ovule mature est libéré par l'ovaire. C'est votre période la plus fertile.

**Phase lutéale (jours 15-28)** : L'endomètre s'épaissit en préparation d'une éventuelle grossesse. Si la fécondation n'a pas lieu, le cycle recommence.

Chaque femme est unique, et la durée de votre cycle peut varier entre 21 et 35 jours.`,
      summary: 'Découvrez les quatre phases du cycle menstruel et leur importance pour votre fertilité.',
      tags: ['cycle', 'règles', 'ovulation', 'hormones'],
      readTime: 3
    },
    {
      title: 'Identifier votre période fertile',
      category: 'fertility',
      content: `La période fertile correspond aux jours où vous avez le plus de chances de concevoir. Elle comprend généralement :

**Les 5 jours précédant l'ovulation** : Les spermatozoïdes peuvent survivre jusqu'à 5 jours dans le tractus génital féminin.

**Le jour de l'ovulation** : L'ovule ne survit que 12 à 24 heures après sa libération.

**Signes d'ovulation à surveiller :**
- Augmentation de la température corporelle basale
- Changement dans la glaire cervicale (plus claire et élastique)
- Douleur pelvienne légère d'un côté
- Augmentation de la libido
- Sensibilité des seins

**Calcul approximatif :**
Pour un cycle de 28 jours, l'ovulation se produit généralement vers le 14e jour. Votre période fertile s'étend donc du 9e au 15e jour de votre cycle.`,
      summary: 'Apprenez à identifier votre période fertile pour optimiser vos chances de conception.',
      tags: ['fertilité', 'ovulation', 'conception', 'température'],
      readTime: 4
    },
    {
      title: 'Suivre votre température corporelle basale',
      category: 'symptoms',
      content: `La température corporelle basale (TCB) est votre température au repos, prise dès le réveil avant toute activité.

**Comment prendre votre TCB :**
1. Utilisez un thermomètre basal (plus précis)
2. Prenez votre température à la même heure chaque matin
3. Restez au lit, ne vous levez pas avant la mesure
4. Notez la température immédiatement

**Interprétation des courbes :**
- **Phase pré-ovulatoire** : Température plus basse (36,1-36,4°C)
- **Après l'ovulation** : Augmentation de 0,2-0,6°C qui persiste
- **Pattern biphasique** : Indication d'un cycle ovulatoire

**Facteurs pouvant affecter la TCB :**
- Maladie ou fièvre
- Sommeil perturbé
- Alcool ou stress
- Changements d'horaires`,
      summary: 'Maîtrisez la prise et l\'interprétation de votre température corporelle basale.',
      tags: ['température', 'ovulation', 'suivi', 'fertilitué'],
      readTime: 5
    },
    {
      title: 'Comprendre la glaire cervicale',
      category: 'symptoms',
      content: `La glaire cervicale est un indicateur naturel de votre fertilité qui change tout au long de votre cycle.

**Évolution de la glaire selon les phases :**

**Après les règles :** Souvent absente ou très peu présente (période "sèche").

**Phase pré-ovulatoire :** 
- Commence collante et opaque
- Devient progressivement plus abondante
- Texture crémeuse, couleur blanchâtre

**Période fertile (ovulation) :**
- Glaire abondante et très élastique
- Transparente comme le blanc d'œuf cru
- Sensation de glissement et d'humidité

**Après l'ovulation :**
- Redevient épaisse et collante
- Diminue progressivement en quantité

**Comment observer :**
1. Vérifiez avant d'uriner
2. Utilisez du papier toilette propre
3. Observez la couleur, texture et élasticité
4. Notez vos observations quotidiennement`,
      summary: 'Apprenez à observer et interpréter les changements de votre glaire cervicale.',
      tags: ['glaire', 'cervicale', 'fertilité', 'ovulation'],
      readTime: 4
    },
    {
      title: 'Nutrition et fertilité',
      category: 'nutrition',
      content: `Une alimentation équilibrée joue un rôle crucial dans l'optimisation de votre fertilité.

**Nutriments essentiels :**

**Acide folique (400-800 µg/jour) :**
- Légumes verts à feuilles, légumineuses
- Important avant et pendant la grossesse

**Fer :**
- Viandes maigres, épinards, haricots
- Prévient l'anémie et soutient l'ovulation

**Oméga-3 :**
- Poissons gras, noix, graines de lin
- Régule les hormones et réduit l'inflammation

**Vitamine D :**
- Exposition au soleil, poissons gras
- Influence la qualité ovocytaire

**Aliments à privilégier :**
- Fruits et légumes colorés
- Céréales complètes
- Protéines de qualité
- Produits laitiers entiers avec modération

**À limiter :**
- Alcool et caféine excessive
- Aliments ultra-transformés
- Sucres raffinés`,
      summary: 'Découvrez les nutriments essentiels et les habitudes alimentaires favorables à la fertilité.',
      tags: ['nutrition', 'fertilité', 'vitamines', 'alimentation'],
      readTime: 6
    }
  ];

  console.log('📚 Creating educational content...');
  
  // First, clear existing educational content
  await prisma.educationalContent.deleteMany({});
  
  for (const content of educationalContent) {
    await prisma.educationalContent.create({
      data: content
    });
  }

  // Create sample cycle and symptoms for Marie
  console.log('📅 Creating sample data for Marie...');
  
  const now = new Date();
  const cycleStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  const sampleCycle = await prisma.menstrualCycle.create({
    data: {
      userId: marieUser.id,
      startDate: cycleStart,
      endDate: new Date(cycleStart.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      cycleLength: 30,
      periodLength: 4,
      ovulationDate: new Date(cycleStart.getTime() + 14 * 24 * 60 * 60 * 1000), // Day 14
      isRegular: true,
      notes: 'Cycle régulier avec ovulation normale'
    }
  });

  // Add some sample symptoms
  const sampleSymptoms = [
    {
      date: cycleStart,
      temperature: 36.2,
      flowHeaviness: 'medium',
      cramps: 6,
      mood: 'irritable',
      energy: 4
    },
    {
      date: new Date(cycleStart.getTime() + 1 * 24 * 60 * 60 * 1000),
      temperature: 36.1,
      flowHeaviness: 'heavy',
      cramps: 7,
      mood: 'sad',
      energy: 3
    },
    {
      date: new Date(cycleStart.getTime() + 13 * 24 * 60 * 60 * 1000),
      temperature: 36.3,
      cervicalMucus: 'creamy',
      mood: 'happy',
      energy: 8
    },
    {
      date: new Date(cycleStart.getTime() + 14 * 24 * 60 * 60 * 1000),
      temperature: 36.6,
      cervicalMucus: 'egg-white',
      mood: 'happy',
      energy: 9
    }
  ];

  for (const symptom of sampleSymptoms) {
    await prisma.dailySymptom.create({
      data: {
        userId: marieUser.id,
        cycleId: sampleCycle.id,
        ...symptom
      }
    });
  }

  // Create sample reminders
  console.log('⏰ Creating sample reminders...');
  
  await prisma.reminder.create({
    data: {
      userId: marieUser.id,
      title: 'Prendre la température',
      description: 'N\'oubliez pas de prendre votre température corporelle basale',
      type: 'temperature',
      scheduledDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      isRecurring: true,
      recurringType: 'daily'
    }
  });

  await prisma.reminder.create({
    data: {
      userId: marieUser.id,
      title: 'Période fertile',
      description: 'Vous entrez dans votre période fertile',
      type: 'ovulation',
      scheduledDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      isRecurring: true,
      recurringType: 'monthly'
    }
  });

  console.log('✅ Seed completed successfully!');
  console.log(`👤 Admin user: john@doe.com / johndoe123`);
  console.log(`👤 Test user: marie@example.com / marie123`);
  console.log(`📚 Created ${educationalContent.length} educational articles`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
