const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');
require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Sedang mengisi data awal...');

  try {
    // 1. Bersihkan data lama
    await prisma.mealPlanRecipe.deleteMany({});
    await prisma.mealPlan.deleteMany({});
    await prisma.favorite.deleteMany({});
    await prisma.recipeIngredient.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.category.deleteMany({});

    // 2. Tambah Kategori
    const cat1 = await prisma.category.create({ data: { name: 'Sarapan' } });
    const cat2 = await prisma.category.create({ data: { name: 'Makan Siang' } });
    const cat3 = await prisma.category.create({ data: { name: 'Makan Malam' } });

    // 3. Tambah 10 Resep beserta bahan-bahannya
    const recipesData = [
      {
        title: 'Nasi Goreng Spesial',
        description: 'Nasi goreng lezat khas Indonesia lengkap dengan telur dadar.',
        instructions: '1. Haluskan bawang merah, bawang putih, dan cabai.\n2. Tumis bumbu halus hingga harum.\n3. Masukkan telur, orak-arik.\n4. Tambahkan nasi putih, kecap manis, garam, dan penyedap. Aduk rata hingga matang.\n5. Sajikan dengan irisan telur dadar dan kerupuk.',
        cookTime: 20,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1512058560366-c80b0426c6f5?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Nasi Putih', quantity: '2 Piring' },
          { ingredientName: 'Telur Ayam', quantity: '2 Butir' },
          { ingredientName: 'Kecap Manis', quantity: '3 SDM' }
        ]
      },
      {
        title: 'Bubur Ayam',
        description: 'Bubur ayam hangat cocok untuk sarapan.',
        instructions: '1. Cuci beras, rebus dengan air kaldu ayam hingga menjadi bubur.\n2. Goreng ayam yang sudah direbus kaldu, lalu suwir-suwir.\n3. Siapkan mangkuk, tuang bubur, beri suwiran ayam, daun bawang, bawang goreng, dan kecap.\n4. Tambahkan kerupuk dan kuah kuning secukupnya.',
        cookTime: 45,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1623961990059-28356e226a17?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Beras', quantity: '1 Cup' },
          { ingredientName: 'Daging Ayam', quantity: '200 gram' },
          { ingredientName: 'Daun Bawang', quantity: '2 Batang' }
        ]
      },
      {
        title: 'Soto Ayam',
        description: 'Soto ayam kuah kuning segar dengan koya.',
        instructions: '1. Rebus ayam hingga empuk, ambil kaldunya.\n2. Tumis bumbu halus (bawang, kunyit, jahe) beserta serai dan daun jeruk hingga harum.\n3. Masukkan tumisan bumbu ke dalam air kaldu ayam. Masak hingga mendidih.\n4. Goreng ayam rebus, lalu suwir.\n5. Sajikan soto dengan bihun, kol, suwiran ayam, dan siram kuah panas.',
        cookTime: 60,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4d43b4850?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Ayam', quantity: '500 gram' },
          { ingredientName: 'Bihun', quantity: '100 gram' },
          { ingredientName: 'Kunyit', quantity: '2 Ruas' }
        ]
      },
      {
        title: 'Ayam Bakar Kecap',
        description: 'Ayam bakar manis gurih dengan sambal terasi.',
        instructions: '1. Ungkep ayam dengan bumbu halus (bawang, ketumbar), kecap manis, dan sedikit air hingga bumbu meresap dan air menyusut.\n2. Siapkan alat pemanggang. Panggang ayam sambil diolesi sisa bumbu ungkep yang dicampur margarin.\n3. Bolak-balik ayam hingga matang kecokelatan.\n4. Sajikan dengan nasi hangat dan sambal.',
        cookTime: 50,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Ayam', quantity: '1 Ekor' },
          { ingredientName: 'Kecap Manis', quantity: '5 SDM' },
          { ingredientName: 'Jeruk Nipis', quantity: '1 Buah' }
        ]
      },
      {
        title: 'Gado-Gado',
        description: 'Salad sayur khas Indonesia dengan saus kacang.',
        instructions: '1. Rebus semua sayuran (kangkung, kacang panjang, tauge) hingga matang, tiriskan.\n2. Goreng tahu dan tempe hingga kecoklatan.\n3. Haluskan kacang tanah goreng dengan cabai, gula merah, dan sedikit garam. Tambahkan air asam jawa.\n4. Tata sayuran, tahu, tempe, dan telur rebus di atas piring. Siram dengan bumbu kacang.\n5. Taburi bawang goreng dan sajikan dengan kerupuk.',
        cookTime: 30,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Kangkung', quantity: '1 Ikat' },
          { ingredientName: 'Kacang Tanah', quantity: '200 gram' },
          { ingredientName: 'Tahu & Tempe', quantity: 'Secukupnya' }
        ]
      },
      {
        title: 'Sate Ayam Madura',
        description: 'Sate ayam empuk dengan bumbu kacang kental.',
        instructions: '1. Potong daging ayam dadu, tusuk dengan tusuk sate.\n2. Haluskan kacang sangrai bersama bawang putih, cabai, dan kemiri. Masak dengan air dan kecap hingga mengental dan mengeluarkan minyak.\n3. Celupkan sate ke dalam campuran sedikit bumbu kacang dan kecap.\n4. Bakar sate hingga matang.\n5. Sajikan sate dengan siraman bumbu kacang utuh, irisan bawang merah, dan jeruk nipis.',
        cookTime: 40,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Dada Ayam', quantity: '500 gram' },
          { ingredientName: 'Kacang Tanah Sangrai', quantity: '250 gram' },
          { ingredientName: 'Tusuk Sate', quantity: '20 Buah' }
        ]
      },
      {
        title: 'Rendang Daging',
        description: 'Olahan daging sapi dengan rempah pekat.',
        instructions: '1. Potong daging sapi searah serat agar tidak mudah hancur.\n2. Masak santan bersama bumbu halus rendang, daun jeruk, serai, dan asam kandis. Aduk perlahan hingga santan mengeluarkan minyak.\n3. Masukkan potongan daging sapi. Kecilkan api.\n4. Aduk sesekali agar tidak gosong, masak hingga kuah mengering dan bumbu meresap sempurna (kurang lebih 3-4 jam).\n5. Angkat dan sajikan.',
        cookTime: 180,
        categoryId: cat3.id,
        imageUrl: 'https://images.unsplash.com/photo-1528669826296-bdc08b88ccb3?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Sapi', quantity: '1 Kg' },
          { ingredientName: 'Santan Kental', quantity: '1 Liter' },
          { ingredientName: 'Bumbu Rendang', quantity: '1 Paket' }
        ]
      },
      {
        title: 'Roti Bakar Coklat Keju',
        description: 'Cemilan manis untuk mengawali hari.',
        instructions: '1. Olesi kedua sisi roti tawar dengan margarin.\n2. Panggang roti di atas teflon hingga satu sisi kecoklatan, balik.\n3. Taburkan meses coklat dan keju parut di atas roti, lalu tutup dengan roti lainnya.\n4. Bolak-balik hingga seluruh bagian roti renyah dan isian meleleh.\n5. Potong menjadi dua dan sajikan selagi hangat.',
        cookTime: 10,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Roti Tawar', quantity: '4 Lembar' },
          { ingredientName: 'Meses Coklat', quantity: 'Secukupnya' },
          { ingredientName: 'Keju Parut', quantity: 'Secukupnya' }
        ]
      },
      {
        title: 'Nasi Uduk',
        description: 'Nasi gurih dimasak dengan santan.',
        instructions: '1. Cuci bersih beras, tiriskan.\n2. Masak santan bersama daun salam, serai, dan sedikit garam hingga mendidih. Jangan lupa diaduk agar santan tidak pecah.\n3. Masukkan beras ke dalam panci *rice cooker*, tuang santan rebus secukupnya seperti menanak nasi biasa.\n4. Tekan tombol *cook*, tunggu hingga matang.\n5. Sajikan dengan bawang goreng, telur balado, dan kerupuk.',
        cookTime: 40,
        categoryId: cat1.id,
        imageUrl: 'https://images.unsplash.com/photo-1615486511484-91eb70dc7792?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Beras', quantity: '2 Cup' },
          { ingredientName: 'Santan', quantity: '500 ml' },
          { ingredientName: 'Daun Salam', quantity: '3 Lembar' }
        ]
      },
      {
        title: 'Opor Ayam',
        description: 'Ayam berkuah santan kekuningan manis gurih.',
        instructions: '1. Rebus ayam sebentar untuk menghilangkan darah, tiriskan.\n2. Tumis bumbu halus (bawang, ketumbar, jintan) bersama serai, lengkuas, dan daun jeruk hingga wangi.\n3. Masukkan ayam, aduk rata dengan bumbu.\n4. Tuang santan cair, masak dengan api sedang hingga ayam empuk.\n5. Tambahkan santan kental, garam, dan gula. Masak hingga mendidih lalu sajikan dengan taburan bawang goreng.',
        cookTime: 50,
        categoryId: cat2.id,
        imageUrl: 'https://images.unsplash.com/photo-1627068536063-441f715875ea?auto=format&fit=crop&w=800&q=80',
        ingredients: [
          { ingredientName: 'Daging Ayam', quantity: '1 Ekor' },
          { ingredientName: 'Santan Cair', quantity: '700 ml' },
          { ingredientName: 'Sereh & Lengkuas', quantity: 'Secukupnya' }
        ]
      }
    ];

    for (const data of recipesData) {
      await prisma.recipe.create({
        data: {
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          cookTime: data.cookTime,
          categoryId: data.categoryId,
          imageUrl: data.imageUrl,
          ingredients: {
            create: data.ingredients
          }
        }
      });
    }

    console.log('BERHASIL! 10 Resep baru sudah masuk ke database.');
  } catch (error) {
    console.error('Error saat seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
