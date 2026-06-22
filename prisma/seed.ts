// prisma/seed.ts
import { PrismaClient, ProductRarity, ProductCondition, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeding de base de datos...')

  // ==============================================
  // 1. Crear Colecciones (Sets)
  // ==============================================
  console.log('📦 Creando colecciones...')

  const sets = await Promise.all([
    prisma.set.upsert({
      where: { name: 'Paldea Evolved' },
      update: {},
      create: {
        name: 'Paldea Evolved',
        releaseDate: new Date('2023-06-09'),
        logoUrl: 'https://images.pexels.com/photos/1037994/pexels-photo-1037994.jpeg',
      },
    }),
    prisma.set.upsert({
      where: { name: '151' },
      update: {},
      create: {
        name: '151',
        releaseDate: new Date('2023-09-22'),
        logoUrl: 'https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg',
      },
    }),
    prisma.set.upsert({
      where: { name: 'Obsidian Flames' },
      update: {},
      create: {
        name: 'Obsidian Flames',
        releaseDate: new Date('2023-08-11'),
        logoUrl: 'https://images.pexels.com/photos/1037996/pexels-photo-1037996.jpeg',
      },
    }),
  ])

  console.log(`✅ ${sets.length} colecciones creadas`)

  // ==============================================
  // 2. Crear Productos (Cartas Pokémon)
  // ==============================================
  console.log('🃏 Creando productos...')

  const products = [
    {
      name: 'Charizard ex',
      slug: 'charizard-ex-paldea',
      description: 'El poderoso Pokémon Dragón/Fuego. Su ataque "Garra Ardiente" causa 200 de daño.',
      price: 49.99,
      stock: 15,
      imageUrl: 'https://images.pexels.com/photos/1037997/pexels-photo-1037997.jpeg',
      rarity: ProductRarity.SUPER_RARA,
      condition: ProductCondition.MINT,
      type: 'Pokémon',
      hp: 220,
      attack: 180,
      weakness: 'Agua',
      evolution: 'Charmeleon',
      setId: sets[0].id,
    },
    {
      name: 'Mewtwo VSTAR',
      slug: 'mewtwo-vstar-151',
      description: 'El legendario Pokémon psíquico. Su habilidad "Poder Oculto" lo hace imparable.',
      price: 35.50,
      stock: 8,
      imageUrl: 'https://images.pexels.com/photos/1037998/pexels-photo-1037998.jpeg',
      rarity: ProductRarity.RARA,
      condition: ProductCondition.NEAR_MINT,
      type: 'Pokémon',
      hp: 280,
      attack: 250,
      weakness: 'Fantasma',
      evolution: 'Mewtwo',
      setId: sets[1].id,
    },
    {
      name: 'Pikachu ex',
      slug: 'pikachu-ex-obsidian',
      description: 'El Pokémon eléctrico más famoso. ¡Siempre listo para la batalla!',
      price: 29.99,
      stock: 20,
      imageUrl: 'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg',
      rarity: ProductRarity.RARA,
      condition: ProductCondition.MINT,
      type: 'Pokémon',
      hp: 180,
      attack: 120,
      weakness: 'Tierra',
      evolution: 'Pichu',
      setId: sets[2].id,
    },
    {
      name: 'Gengar ex',
      slug: 'gengar-ex-paldea',
      description: 'El Pokémon Sombra. Aterroriza a sus oponentes con su sonrisa siniestra.',
      price: 42.00,
      stock: 12,
      imageUrl: 'https://images.pexels.com/photos/1038000/pexels-photo-1038000.jpeg',
      rarity: ProductRarity.SUPER_RARA,
      condition: ProductCondition.MINT,
      type: 'Pokémon',
      hp: 250,
      attack: 210,
      weakness: 'Siniestro',
      evolution: 'Haunter',
      setId: sets[0].id,
    },
    {
      name: 'Gardevoir ex',
      slug: 'gardevoir-ex-151',
      description: 'La Pokémon Emoción. Protege a su entrenador con su poder psíquico.',
      price: 38.75,
      stock: 10,
      imageUrl: 'https://images.pexels.com/photos/1038001/pexels-photo-1038001.jpeg',
      rarity: ProductRarity.RARA,
      condition: ProductCondition.NEAR_MINT,
      type: 'Pokémon',
      hp: 230,
      attack: 160,
      weakness: 'Acero',
      evolution: 'Kirlia',
      setId: sets[1].id,
    },
    {
      name: 'Carta de Entrenador - Fuego Cruzado',
      slug: 'fuego-cruzado-entrenador',
      description: 'Entrenamiento intensivo. Aumenta el ataque de tus Pokémon de Fuego en +30.',
      price: 15.99,
      stock: 25,
      imageUrl: 'https://images.pexels.com/photos/1038002/pexels-photo-1038002.jpeg',
      rarity: ProductRarity.NORMAL,
      condition: ProductCondition.MINT,
      type: 'Entrenador',
      hp: null,
      attack: null,
      weakness: null,
      evolution: null,
      setId: sets[0].id,
    },
    {
      name: 'Energía Eléctrica x5',
      slug: 'energia-electrica',
      description: 'Pack de 5 energías eléctricas básicas para tus Pokémon tipo Eléctrico.',
      price: 8.99,
      stock: 30,
      imageUrl: 'https://images.pexels.com/photos/1038003/pexels-photo-1038003.jpeg',
      rarity: ProductRarity.COMUN,
      condition: ProductCondition.MINT,
      type: 'Energía',
      hp: null,
      attack: null,
      weakness: null,
      evolution: null,
      setId: sets[2].id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }

  console.log(`✅ ${products.length} productos creados`)

  // ==============================================
  // 3. Crear Usuario Admin CON CONTRASEÑA HASEADA
  // ==============================================
  console.log('👤 Creando usuario administrador...')

  const adminPassword = await bcrypt.hash('Admin123!', 10)

  await prisma.user.upsert({
    where: { email: 'admin@tcgstore.com' },
    update: {
      password: adminPassword,
    },
    create: {
      email: 'admin@tcgstore.com',
      name: 'Administrador',
      role: UserRole.ADMIN,
      password: adminPassword,
    },
  })

  console.log('✅ Usuario admin creado (email: admin@tcgstore.com, password: Admin123!)')

  // ==============================================
  // 4. Crear Usuario de Prueba CON CONTRASEÑA HASEADA
  // ==============================================
  console.log('👤 Creando usuario de prueba...')

  const testPassword = await bcrypt.hash('Test123!', 10)

  await prisma.user.upsert({
    where: { email: 'test@tcgstore.com' },
    update: {
      password: testPassword,
    },
    create: {
      email: 'test@tcgstore.com',
      name: 'Usuario Test',
      role: UserRole.USER,
      password: testPassword,
    },
  })

  console.log('✅ Usuario test creado (email: test@tcgstore.com, password: Test123!)')

  console.log('🎉 Seeding completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })