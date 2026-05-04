const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function addNewRecipes() {
  const catSarapan = await prisma.category.findUnique({ where: { name: 'Sarapan' } });
  const catSiang = await prisma.category.findUnique({ where: { name: 'Makan Siang' } });
  const catMalam = await prisma.category.findUnique({ where: { name: 'Makan Malam' } });

  const newRecipes = [
    {
      title: 'Mie Goreng Jawa',
      description: 'Mie goreng tradisional dengan racikan bumbu ulek khas Jawa, lengkap dengan sayuran dan suwiran ayam.',
      instructions: "1. Siapkan bahan: Rebus mie telur kering hingga urai dan setengah matang. Tiriskan dan campur dengan 1 SDM kecap manis serta 1 SDM minyak goreng agar tidak lengket.\n2. Haluskan bumbu: Ulek bawang merah, bawang putih, kemiri sangrai, ebi (udang kering), merica butir, dan garam hingga benar-benar halus.\n3. Masak telur dan ayam: Panaskan minyak, orak-arik telur hingga matang, lalu masukkan suwiran ayam rebus. Sisihkan di pinggir wajan.\n4. Tumis bumbu halus: Masukkan bumbu halus ke bagian tengah wajan, tumis hingga harum dan matang. Campurkan kembali dengan telur dan ayam tadi.\n5. Masukkan sayuran: Tambahkan irisan kol, sawi hijau, dan irisan tomat. Masak sebentar hingga sayuran agak layu.\n6. Masukkan mie: Masukkan mie yang sudah dicampur kecap. Tambahkan sisa kecap manis, kaldu jamur, dan sedikit air jika terlalu kering. Aduk rata dengan api besar agar ada aroma 'wok hei' (sedikit asap).\n7. Penyajian: Angkat mie goreng, sajikan hangat dengan taburan bawang merah goreng, irisan seledri, kerupuk, dan acar timun.",
      cookTime: 25,
      rating: 4.8,
      categoryId: catMalam.id,
      imageUrl: 'https://images.unsplash.com/photo-1626804475297-41609ea084eb?auto=format&fit=crop&w=800&q=80',
      ingredients: {
        create: [
          { ingredientName: 'Mie Telur Kering', quantity: '200 gram' },
          { ingredientName: 'Telur Ayam', quantity: '2 Butir' },
          { ingredientName: 'Ayam Rebus Suwir', quantity: '100 gram' },
          { ingredientName: 'Sawi Hijau & Kol', quantity: 'Secukupnya' },
          { ingredientName: 'Bawang Merah & Putih', quantity: '5 & 3 Siung' },
          { ingredientName: 'Kemiri & Ebi', quantity: '3 Butir & 1 SDM' },
          { ingredientName: 'Kecap Manis', quantity: '4 SDM' },
          { ingredientName: 'Bawang Goreng', quantity: 'Taburan' }
        ]
      }
    },
    {
      title: 'Sayur Asem Jakarta',
      description: 'Sayur kuah bening dengan rasa asam, manis, dan segar. Sangat cocok dinikmati siang hari bersama ikan asin.',
      instructions: "1. Persiapan bahan: Cuci bersih semua sayuran. Potong-potong kacang panjang, labu siam, jagung manis, dan belah melinjo jika suka.\n2. Rebus bahan keras: Didihkan air dalam panci besar. Masukkan jagung manis, kacang tanah, dan buah melinjo terlebih dahulu karena butuh waktu lama untuk empuk.\n3. Bumbu kuah: Haluskan bawang merah, bawang putih, cabai merah keriting (sesuai selera), terasi bakar, dan kemiri.\n4. Masukkan bumbu: Masukkan bumbu halus ke dalam rebusan jagung. Tambahkan daun salam, lengkuas memar, dan asam jawa (kumpulkan dalam saringan kecil agar mudah diambil atau larutkan airnya saja). Masukkan juga gula merah sisir dan garam.\n5. Masukkan sayuran lunak: Setelah jagung empuk, masukkan labu siam dan kacang panjang. Masak sebentar saja.\n6. Tahap akhir: Terakhir, masukkan daun melinjo (so). Masak sebentar hingga layu (sekitar 1-2 menit), jangan sampai overcooked.\n7. Penyajian: Koreksi rasa, pastikan ada keseimbangan antara asam, manis, dan gurih. Angkat dan sajikan selagi hangat.",
      cookTime: 40,
      rating: 4.7,
      categoryId: catSiang.id,
      imageUrl: 'https://images.unsplash.com/photo-1548946522-4a313e8972a4?auto=format&fit=crop&w=800&q=80',
      ingredients: {
        create: [
          { ingredientName: 'Jagung Manis', quantity: '1 Buah (Potong)' },
          { ingredientName: 'Labu Siam', quantity: '1 Buah (Potong Dadu)' },
          { ingredientName: 'Kacang Panjang', quantity: '1/2 Ikat' },
          { ingredientName: 'Kacang Tanah & Melinjo', quantity: '50 gram' },
          { ingredientName: 'Daun Melinjo (So)', quantity: 'Secukupnya' },
          { ingredientName: 'Asam Jawa & Gula Merah', quantity: '2 SDM & 1 Bulatan' },
          { ingredientName: 'Bawang Merah & Putih', quantity: '6 & 3 Siung' },
          { ingredientName: 'Terasi Bakar', quantity: '1/2 SDT' }
        ]
      }
    },
    {
      title: 'Pancake Pisang Fluffy',
      description: 'Sarapan manis dan lembut yang terbuat dari pisang matang. Sangat mudah dibuat dan kaya akan energi.',
      instructions: "1. Lumatkan pisang: Pilih pisang yang sudah sangat matang (kulitnya mulai berbintik hitam) karena rasanya lebih manis. Lumatkan pisang menggunakan garpu di dalam mangkuk besar hingga halus.\n2. Campurkan bahan basah: Masukkan telur, susu cair, dan sedikit mentega atau margarin cair ke dalam mangkuk berisi pisang. Aduk rata menggunakan whisk (pengocok telur).\n3. Ayak bahan kering: Di mangkuk terpisah, ayak tepung terigu, baking powder, baking soda, sejumput garam, dan kayu manis bubuk (jika suka).\n4. Gabungkan adonan: Tuangkan bahan kering sedikit demi sedikit ke dalam campuran bahan basah. Aduk lipat menggunakan spatula pelan-pelan. Jangan overmix (terlalu banyak diaduk) agar pancake tidak menjadi alot/keras.\n5. Panaskan teflon: Panaskan wajan anti lengket dengan api kecil-sedang. Olesi dengan sangat sedikit mentega.\n6. Masak pancake: Tuangkan satu sendok sayur adonan ke atas wajan. Biarkan hingga muncul gelembung-gelembung kecil di permukaannya dan pinggirannya mulai mengering (sekitar 2-3 menit). Balik perlahan dan masak sisi baliknya selama 1 menit.\n7. Penyajian: Tumpuk pancake di atas piring. Siram dengan madu atau sirup maple, dan tambahkan potongan mentega atau buah segar di atasnya.",
      cookTime: 20,
      rating: 4.9,
      categoryId: catSarapan.id,
      imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
      ingredients: {
        create: [
          { ingredientName: 'Pisang Matang', quantity: '2 Buah' },
          { ingredientName: 'Tepung Terigu Protein Sedang', quantity: '150 gram' },
          { ingredientName: 'Susu Cair', quantity: '120 ml' },
          { ingredientName: 'Telur Ayam', quantity: '1 Butir' },
          { ingredientName: 'Baking Powder', quantity: '1 SDT' },
          { ingredientName: 'Mentega Cair', quantity: '2 SDM' },
          { ingredientName: 'Garam & Kayu Manis Bubuk', quantity: 'Sejumput' },
          { ingredientName: 'Madu / Sirup Maple', quantity: 'Topping' }
        ]
      }
    }
  ];

  for (const data of newRecipes) {
    const created = await prisma.recipe.create({
      data: data
    });
    console.log('Berhasil menambahkan resep:', created.title);
  }
}

addNewRecipes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
