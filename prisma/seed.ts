// prisma/seed.ts
import {
  PrismaClient,
  ProductRarity,
  ProductCondition,
  UserRole,
  ProductType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Colecciones disponibles
const COLLECTIONS = [
  { name: 'Ascended Heroes', id: 'ascended-heroes' },
  { name: 'Prismatic Evolutions', id: 'prismatic-evolutions' },
  { name: 'Surging Sparks', id: 'surging-sparks' },
  { name: 'Twilight Masquerade', id: 'twilight-masquerade' },
  { name: '151', id: '151' },
  { name: 'Chaos Rising', id: 'chaos-rising' },
  { name: 'Black Bolt & White Flames', id: 'black-bolt-white-flames' },
  { name: 'Megaevolution', id: 'megaevolution' },
  { name: 'Paldea Evolved', id: 'paldea-evolved' },
];

async function main() {
  console.log('🌱 Iniciando seeding de base de datos...');

  // 1. Crear Colecciones (Sets)
  console.log('📦 Creando colecciones...');

  const sets = await Promise.all(
    COLLECTIONS.map((col) =>
      prisma.set.upsert({
        where: { name: col.name },
        update: {},
        create: {
          name: col.name,
          releaseDate: new Date('2024-01-01'),
          logoUrl: `https://product-images.s3.cardmarket.com/1016/${col.id}.jpg`,
        },
      })
    )
  );

  console.log(`✅ ${sets.length} colecciones creadas`);

  // 2. Crear Productos
  console.log('🃏 Creando productos...');

  const setMap = Object.fromEntries(sets.map((s) => [s.name, s]));

  // ============================================
  // CARTAS (7)
  // ============================================

  const cardData = [
    {
      name: 'Charizard ex',
      slug: 'charizard-ex-ascended-heroes',
      description:
        'Carta individual Charizard ex de la colección Ascended Heroes. Pokémon de fuego con ataque devastador.',
      price: 49.99,
      stock: 15,
      imageUrl: 'https://product-images.s3.cardmarket.com/51/ASC/869633/869633.jpg',
      rarity: ProductRarity.SUPER_RARA,
      condition: ProductCondition.MINT,
      set: 'Ascended Heroes',
    },
    {
      name: 'Mewtwo VSTAR',
      slug: 'mewtwo-vstar-prismatic-evolutions',
      description:
        'Carta individual Mewtwo VSTAR de la colección Prismatic Evolutions. Legendario psíquico.',
      price: 35.5,
      stock: 8,
      imageUrl: 'https://product-images.s3.cardmarket.com/51/CRZ/691924/691924.jpg',
      rarity: ProductRarity.RARA,
      condition: ProductCondition.NEAR_MINT,
      set: 'Prismatic Evolutions',
    },
    {
      name: 'Pikachu ex',
      slug: 'pikachu-ex-surging-sparks',
      description:
        'Carta individual Pikachu ex de la colección Surging Sparks. El Pokémon eléctrico más famoso.',
      price: 29.99,
      stock: 20,
      imageUrl: 'https://product-images.s3.cardmarket.com/51/SSP/794611/794611.jpg',
      rarity: ProductRarity.RARA,
      condition: ProductCondition.MINT,
      set: 'Surging Sparks',
    },
    {
      name: 'Gengar ex',
      slug: 'gengar-ex-twilight-masquerade',
      description:
        'Carta individual Gengar ex de la colección Twilight Masquerade. Pokémon Sombra.',
      price: 42.0,
      stock: 12,
      imageUrl: 'https://product-images.s3.cardmarket.com/51/TEF/760823/760823.jpg',
      rarity: ProductRarity.SUPER_RARA,
      condition: ProductCondition.MINT,
      set: 'Twilight Masquerade',
    },
    {
      name: 'Gardevoir ex',
      slug: 'gardevoir-ex-151',
      description: 'Carta individual Gardevoir ex de la colección 151. Pokémon Psíquico.',
      price: 38.75,
      stock: 10,
      imageUrl: 'https://product-images.s3.cardmarket.com/51/SVI/702541/702541.jpg',
      rarity: ProductRarity.RARA,
      condition: ProductCondition.NEAR_MINT,
      set: '151',
    },
  ];

  for (const data of cardData) {
    const set = setMap[data.set];
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        type: ProductType.CARD,
        isActive: true,
        images: {
          create: {
            url: data.imageUrl,
            isPrimary: true,
            order: 0,
          },
        },
        card: {
          create: {
            setId: set.id,
            rarity: data.rarity,
            condition: data.condition,
            language: 'Español',
          },
        },
      },
    });
    console.log(`✅ Carta creada: ${product.name}`);
  }

  // ============================================
  // SOBRES (3)
  // ============================================

  const packData = [
    {
      name: 'Sobre Ascended Heroes',
      slug: 'pack-ascended-heroes',
      description:
        'Sobre individual de la colección Ascended Heroes. Contiene 10 cartas aleatorias.',
      price: 4.99,
      stock: 50,
      imageUrl: 'https://product-images.s3.cardmarket.com/52/860562/860562.jpg',
      set: 'Ascended Heroes',
    },
    {
      name: 'Sobre Prismatic Evolutions',
      slug: 'pack-prismatic-evolutions',
      description:
        'Sobre individual de la colección Prismatic Evolutions. Incluye 11 cartas con ilustraciones especiales.',
      price: 5.99,
      stock: 45,
      imageUrl: 'https://product-images.s3.cardmarket.com/52/798923/798923.jpg',
      set: 'Prismatic Evolutions',
    },
    {
      name: 'Sobre Surging Sparks',
      slug: 'pack-surging-sparks',
      description:
        'Sobre individual de la colección Surging Sparks. Incluye 10 cartas de la nueva expansión.',
      price: 4.49,
      stock: 60,
      imageUrl: 'https://product-images.s3.cardmarket.com/52/784945/784945.jpg',
      set: 'Surging Sparks',
    },
  ];

  for (const data of packData) {
    const set = setMap[data.set];
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        type: ProductType.PACK,
        isActive: true,
        images: {
          create: {
            url: data.imageUrl,
            isPrimary: true,
            order: 0,
          },
        },
        pack: {
          create: {
            setId: set.id,
            language: 'Español',
            cardsPerPack: 10,
          },
        },
      },
    });
    console.log(`✅ Sobre creado: ${product.name}`);
  }

  // ============================================
  // CAJAS (6)
  // ============================================

  const boxData = [
    {
      name: 'Caja de Entrenador Élite de Caos Creciente',
      slug: 'box-chaos-rising-elite-trainer',
      description:
        'Caja de Entrenador Élite de Caos Creciente. Incluye 8 sobres, 40 cartas de energía y accesorios exclusivos.',
      price: 49.99,
      stock: 10,
      imageUrl: 'https://product-images.s3.cardmarket.com/1016/877294/877294.jpg',
      set: 'Chaos Rising',
    },
    {
      name: 'Caja de Entrenador Élite de Evoluciones Prismáticas',
      slug: 'box-prismatic-evolutions-elite-trainer',
      description:
        'Caja de Entrenador Élite de Evoluciones Prismáticas. Incluye 9 sobres y accesorios exclusivos.',
      price: 59.99,
      stock: 8,
      imageUrl: 'https://product-images.s3.cardmarket.com/1016/798930/798930.jpg',
      set: 'Prismatic Evolutions',
    },
    {
      name: 'Caja de Entrenador Élite de Héroes Ascendentes',
      slug: 'box-ascended-heroes-elite-trainer',
      description:
        'Caja de Entrenador Élite de Héroes Ascendentes. Incluye 8 sobres y accesorios temáticos.',
      price: 54.99,
      stock: 12,
      imageUrl: 'https://product-images.s3.cardmarket.com/1016/860574/860574.jpg',
      set: 'Ascended Heroes',
    },
    {
      name: 'Caja de Entrenador Élite de Fulgor Negro',
      slug: 'box-black-bolt-white-flames-elite-trainer',
      description:
        'Caja de Entrenador Élite de Fulgor Negro. Incluye 8 sobres y accesorios exclusivos.',
      price: 52.99,
      stock: 10,
      imageUrl: 'https://product-images.s3.cardmarket.com/1016/824088/824088.jpg',
      set: 'Black Bolt & White Flames',
    },
    {
      name: 'Caja de Entrenador Élite Mega Lucario de Megaevolución',
      slug: 'box-megaevolution-mega-lucario-elite-trainer',
      description:
        'Caja de Entrenador Élite Mega Lucario de Megaevolución. Incluye 9 sobres y accesorios exclusivos.',
      price: 64.99,
      stock: 6,
      imageUrl: 'https://product-images.s3.cardmarket.com/1016/834830/834830.jpg',
      set: 'Megaevolution',
    },
    {
      name: 'Caja de Entrenador Élite de Destinos de Paldea',
      slug: 'box-paldea-evolved-elite-trainer',
      description:
        'Caja de Entrenador Élite de Destinos de Paldea. Incluye 8 sobres y accesorios temáticos.',
      price: 47.99,
      stock: 15,
      imageUrl: 'https://product-images.s3.cardmarket.com/1016/745548/745548.png',
      set: 'Paldea Evolved',
    },
  ];

  for (const data of boxData) {
    const set = setMap[data.set];
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        type: ProductType.BOX,
        isActive: true,
        images: {
          create: {
            url: data.imageUrl,
            isPrimary: true,
            order: 0,
          },
        },
        box: {
          create: {
            setId: set.id,
            language: 'Español',
            packsPerBox: 8,
          },
        },
      },
    });
    console.log(`✅ Caja creada: ${product.name}`);
  }

  // ============================================
  // USUARIOS
  // ============================================

  console.log('👤 Creando usuarios...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@tcgstore.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@tcgstore.com',
      name: 'Administrador',
      role: UserRole.ADMIN,
      password: adminPassword,
    },
  });
  console.log('✅ Usuario admin creado');

  const testPassword = await bcrypt.hash('Test123!', 10);
  await prisma.user.upsert({
    where: { email: 'test@tcgstore.com' },
    update: { password: testPassword },
    create: {
      email: 'test@tcgstore.com',
      name: 'Usuario Test',
      role: UserRole.USER,
      password: testPassword,
    },
  });
  console.log('✅ Usuario test creado');

  console.log('🎉 Seeding completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
