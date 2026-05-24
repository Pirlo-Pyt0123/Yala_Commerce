import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed...');

  // 1. Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });
  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: { name: 'customer' },
  });
  console.log(`Roles: ${adminRole.name}, ${customerRole.name}`);

  // 2. Usuario admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@licoreria.com' },
    update: {},
    create: {
      email: 'admin@licoreria.com',
      password: hashedPassword,
      name: 'Administrador',
      roleId: adminRole.id,
    },
  });
  console.log(`Admin: ${adminUser.email}`);

  // 3. Categorías
  const categoriesData = [
    { name: 'Whisky',  slug: 'whisky',  description: 'Whiskys nacionales e importados' },
    { name: 'Vino',    slug: 'vino',    description: 'Tintos, blancos y rosados' },
    { name: 'Cerveza', slug: 'cerveza', description: 'Artesanales e industriales' },
    { name: 'Ron',     slug: 'ron',     description: 'Rones nacionales e importados' },
    { name: 'Pisco',   slug: 'pisco',   description: 'Piscos nacionales' },
    { name: 'Vodka',   slug: 'vodka',   description: 'Vodkas importados' },
  ];
  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      }),
    ),
  );
  console.log(`Categorías: ${categories.map((c) => c.name).join(', ')}`);

  const cat = (slug: string) => categories.find((c) => c.slug === slug)!.id;

  // 4. Productos
  const productsData = [
    // ── Whisky ──────────────────────────────────────────────────────────────
    {
      name: 'Johnnie Walker Red Label 750ml',
      slug: 'johnnie-walker-red-750',
      description: 'Scotch whisky blended, ideal para cocktails y mezclas.',
      price: 45.99,
      stock: 50,
      categoryId: cat('whisky'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/58/%28Zazu%2C_Quito%29_Johnnie_Walker_is_a_brand_of_Scotch_whisky.JPG',
    },
    {
      name: 'Johnnie Walker Black Label 750ml',
      slug: 'johnnie-walker-black-750',
      description: 'Scotch whisky blended, 12 años de maduración, notas a vainilla y frutas.',
      price: 75.99,
      stock: 30,
      categoryId: cat('whisky'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Johnnie_Walker_Black_Label_Limited_edition2.JPG',
    },
    {
      name: "Jack Daniel's Old No.7 750ml",
      slug: 'jack-daniels-old-no7-750',
      description: 'Tennessee whiskey filtrado por carbón de arce, sabor suave y ahumado.',
      price: 69.90,
      stock: 40,
      categoryId: cat('whisky'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Alcoholic_beverages_003.JPG',
    },
    {
      name: 'Chivas Regal 12 años 750ml',
      slug: 'chivas-regal-12-750',
      description: 'Scotch whisky blended premium, 12 años de maduración, suave y elegante.',
      price: 89.90,
      stock: 25,
      categoryId: cat('whisky'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/ChivasRegal-Wiki.JPG',
    },

    // ── Vino ─────────────────────────────────────────────────────────────────
    {
      name: 'Casillero del Diablo Cabernet Sauvignon 750ml',
      slug: 'casillero-diablo-cabernet-750',
      description: 'Vino tinto chileno, notas a cereza, ciruela y especias.',
      price: 18.50,
      stock: 100,
      categoryId: cat('vino'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Casillero_del_Diablo.JPG',
    },
    {
      name: 'Concha y Toro Frontera Merlot 750ml',
      slug: 'concha-toro-frontera-merlot-750',
      description: 'Vino tinto chileno, suave y afrutado, perfecto para el día a día.',
      price: 14.90,
      stock: 80,
      categoryId: cat('vino'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Wine_bottle.JPG',
    },
    {
      name: 'Santa Rita 120 Sauvignon Blanc 750ml',
      slug: 'santa-rita-120-sauvignon-blanc-750',
      description: 'Vino blanco chileno, refrescante con notas cítricas y herbáceas.',
      price: 15.90,
      stock: 70,
      categoryId: cat('vino'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Wine_bottle.JPG',
    },

    // ── Cerveza ──────────────────────────────────────────────────────────────
    {
      name: 'Corona Extra 355ml x6',
      slug: 'corona-extra-355-x6',
      description: 'Pack 6 cervezas Corona Extra, clara y refrescante.',
      price: 22.00,
      stock: 200,
      categoryId: cat('cerveza'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Corona-6Pack.JPG',
    },
    {
      name: 'Heineken 330ml x6',
      slug: 'heineken-330-x6',
      description: 'Pack 6 cervezas Heineken, lager premium de origen holandés.',
      price: 26.00,
      stock: 150,
      categoryId: cat('cerveza'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Heineken_bottles_limited_edition.JPG',
    },
    {
      name: 'Cusqueña Dorada 620ml x6',
      slug: 'cusquena-dorada-620-x6',
      description: 'Pack 6 cervezas Cusqueña, lager peruana elaborada con agua de los Andes.',
      price: 24.00,
      stock: 120,
      categoryId: cat('cerveza'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Beer_bottle.JPG',
    },

    // ── Ron ───────────────────────────────────────────────────────────────────
    {
      name: 'Cartavio Black 750ml',
      slug: 'cartavio-black-750',
      description: 'Ron oscuro peruano, añejado en barricas de roble, notas a caramelo y vainilla.',
      price: 32.00,
      stock: 60,
      categoryId: cat('ron'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Havana_Club_2.JPG',
    },
    {
      name: 'Barceló Imperial 750ml',
      slug: 'barcelo-imperial-750',
      description: 'Ron dominicano premium, añejado 10 años, suave con notas a roble y vainilla.',
      price: 65.00,
      stock: 35,
      categoryId: cat('ron'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Ron_Barcel%C3%B3.JPG',
    },

    // ── Pisco ─────────────────────────────────────────────────────────────────
    {
      name: 'Queirolo Mosto Verde 500ml',
      slug: 'queirolo-mosto-verde-500',
      description: 'Pisco peruano mosto verde, aromático y suave, ideal para pisco sour.',
      price: 38.00,
      stock: 45,
      categoryId: cat('pisco'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Pisco.JPG',
    },
    {
      name: 'Tabernero Gran Pisco 700ml',
      slug: 'tabernero-gran-pisco-700',
      description: 'Gran pisco peruano, doble destilado, sabor limpio y frutal.',
      price: 42.00,
      stock: 40,
      categoryId: cat('pisco'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Pisco.JPG',
    },

    // ── Vodka ─────────────────────────────────────────────────────────────────
    {
      name: 'Absolut Original 750ml',
      slug: 'absolut-original-750',
      description: 'Vodka sueco premium, destilado de trigo, puro y cristalino.',
      price: 52.00,
      stock: 55,
      categoryId: cat('vodka'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Absolut_vodka_bottle.png',
    },
    {
      name: 'Smirnoff Red 750ml',
      slug: 'smirnoff-red-750',
      description: 'Vodka triple destilado, filtrado 10 veces, versátil para cualquier cocktail.',
      price: 38.00,
      stock: 65,
      categoryId: cat('vodka'),
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Smirnoff_Red_Label_8213.jpg',
    },
  ];

  const products = await Promise.all(
    productsData.map((prod) =>
      prisma.product.upsert({
        where: { slug: prod.slug },
        update: { imageUrl: prod.imageUrl, description: prod.description, price: prod.price, stock: prod.stock },
        create: prod,
      }),
    ),
  );
  console.log(`Productos: ${products.length} productos cargados`);

  console.log('\nSeed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
