const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, family: 4 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const detailedInstructions = {
  'Nasi Goreng Spesial': `1. Siapkan bahan-bahan: Iris tipis bawang merah, bawang putih, dan cabai merah. Jika suka pedas, Anda bisa menambahkan cabai rawit sesuai selera.
2. Panaskan wajan: Tuangkan 2 sendok makan minyak goreng ke dalam wajan, panaskan dengan api sedang. Pastikan minyak benar-benar panas agar bumbu tidak berbau langu.
3. Tumis bumbu: Masukkan irisan bawang dan cabai. Tumis perlahan hingga mengeluarkan aroma harum dan bumbu mulai layu (sekitar 2-3 menit).
4. Orak-arik telur: Sisihkan bumbu ke pinggir wajan, lalu pecahkan telur di tengah wajan. Biarkan sebentar hingga setengah matang, lalu aduk cepat (orak-arik) hingga tercampur merata dengan bumbu.
5. Masukkan nasi: Tambahkan nasi putih (sebaiknya nasi sisa semalam yang teksturnya sedikit pera). Tuangkan kecap manis, sedikit garam, dan penyedap rasa.
6. Aduk rata: Besarkan api sedikit, lalu aduk cepat dengan gerakan memutar dari bawah ke atas agar semua bumbu dan kecap meresap sempurna ke setiap butiran nasi.
7. Penyajian: Setelah tercampur rata dan berasap matang (sekitar 5 menit), angkat dan sajikan selagi panas dengan tambahan irisan mentimun, tomat, dan kerupuk renyah.`,

  'Bubur Ayam': `1. Siapkan kaldu: Rebus daging ayam dengan air secukupnya. Tambahkan sedikit garam dan daun salam. Rebus hingga kaldu keluar dan ayam matang.
2. Memasak bubur: Cuci beras hingga bersih. Masukkan beras ke dalam panci, lalu tuangkan air kaldu ayam secara perlahan. Masak dengan api kecil sambil terus diaduk agar bagian bawahnya tidak gosong. Masak hingga teksturnya mengental menjadi bubur yang lembut.
3. Goreng ayam: Angkat ayam dari rebusan kaldu tadi, tiriskan sebentar, lalu goreng dalam minyak panas hingga bagian luarnya kecokelatan. Setelah agak dingin, suwir-suwir daging ayam menjadi bagian kecil.
4. Siapkan pelengkap: Iris halus daun bawang dan seledri. Siapkan juga bawang merah goreng dan kecap manis atau asin sesuai selera.
5. Penyajian: Tuang bubur panas ke dalam mangkuk. Susun suwiran ayam di atasnya, taburi dengan daun bawang, seledri, dan bawang goreng. Tambahkan kecap dan kerupuk. Siram dengan sedikit sisa kuah kuning jika ada.`,

  'Soto Ayam': `1. Rebus ayam: Siapkan panci besar, rebus daging ayam dengan air hingga empuk dan mengeluarkan kaldu yang gurih.
2. Siapkan bumbu halus: Haluskan bawang merah, bawang putih, kunyit (bakar sebentar agar lebih wangi), jahe, dan ketumbar.
3. Tumis bumbu: Panaskan sedikit minyak di wajan terpisah, tumis bumbu halus bersama dengan serai yang dimemarkan dan daun jeruk purut. Tumis terus hingga bumbu benar-benar harum dan matang.
4. Masak kuah soto: Masukkan tumisan bumbu tersebut ke dalam panci rebusan kaldu ayam. Aduk rata, tambahkan garam, gula, dan merica secukupnya. Masak hingga kuah mendidih dan bumbu meresap.
5. Suwir ayam: Angkat ayam dari panci, biarkan agak dingin lalu goreng sebentar saja, kemudian suwir-suwir dagingnya.
6. Penyajian: Siapkan mangkuk, tata bihun yang sudah direndam air panas, irisan kol, dan ayam suwir. Siram dengan kuah soto panas yang mendidih. Beri taburan bawang goreng dan perasan jeruk nipis.`,

  'Ayam Bakar Kecap': `1. Persiapan ayam: Cuci bersih potongan daging ayam dan lumuri dengan perasan jeruk nipis serta sedikit garam. Diamkan selama 15 menit untuk menghilangkan bau amis, lalu bilas bersih.
2. Buat bumbu ungkep: Haluskan bawang merah, bawang putih, ketumbar, dan sedikit kemiri. 
3. Ungkep ayam: Masukkan ayam dan bumbu halus ke dalam wajan. Tambahkan kecap manis yang banyak, sedikit air, dan aduk rata. Masak (ungkep) ayam dengan api kecil hingga bumbu meresap sempurna, air menyusut, dan ayam menjadi empuk (sekitar 30-40 menit).
4. Persiapan memanggang: Panaskan alat pemanggang atau teflon. Campurkan sisa bumbu ungkep yang mengental dengan sedikit margarin leleh untuk bahan olesan.
5. Panggang ayam: Panggang ayam di atas alat panggangan. Bolak-balik ayam secara berkala sambil terus diolesi dengan bahan olesan tadi agar warnanya karamel cantik dan rasanya lebih legit.
6. Penyajian: Angkat setelah permukaannya agak mengering dan kecokelatan. Sajikan hangat bersama nasi putih, sambal terasi, dan lalapan segar.`,

  'Gado-Gado': `1. Persiapkan sayuran: Cuci bersih semua sayuran. Potong-potong kangkung dan kacang panjang. Rebus kangkung, kacang panjang, dan tauge secara bergantian di air mendidih sebentar saja agar teksturnya tetap renyah. Tiriskan.
2. Siapkan protein: Potong tahu dan tempe sesuai selera, bumbui sedikit dengan garam, lalu goreng hingga matang dan bagian luarnya kecokelatan. Rebus juga telur ayam hingga matang (hard-boiled).
3. Buat saus kacang: Goreng kacang tanah hingga matang. Haluskan kacang tanah goreng tersebut bersama cabai merah, cabai rawit (sesuai selera pedas), bawang putih goreng, dan gula merah muda. 
4. Racik saus: Pindahkan bumbu halus ke panci kecil, tambahkan air perasan asam jawa dan air hangat secukupnya. Masak sebentar hingga saus kacang mengental dan mengeluarkan minyak alaminya. Tambahkan garam secukupnya.
5. Penyajian: Tata potongan sayur rebus, tahu, tempe, dan telur rebus yang sudah dibelah di atas piring.
6. Siram saus: Tuangkan saus kacang kental secukupnya di atas tataan sayur. Taburi dengan bawang merah goreng dan sajikan bersama kerupuk udang atau emping.`,

  'Sate Ayam Madura': `1. Potong daging ayam: Cuci bersih dada ayam fillet. Potong-potong dadu kecil dengan ukuran seragam agar matangnya merata.
2. Tusuk sate: Tusuk potongan ayam tersebut menggunakan tusuk sate bambu (sekitar 3-4 potong per tusuk). Sisihkan.
3. Buat bumbu kacang: Sangrai kacang tanah hingga matang lalu haluskan bersama bawang putih, bawang merah, cabai, dan kemiri sangrai. 
4. Masak bumbu kacang: Masak bumbu halus di wajan dengan tambahan sedikit air dan kecap manis. Aduk terus dengan api kecil hingga bumbu mengental, berwarna gelap, dan mengeluarkan minyak kacang.
5. Bumbui sate sebelum dibakar: Ambil 2 sendok makan bumbu kacang yang sudah jadi, campurkan dengan kecap manis dan sedikit perasan jeruk nipis. Lumuri sate mentah dengan campuran ini secara merata.
6. Bakar sate: Panaskan alat pemanggang (lebih baik menggunakan arang). Bakar sate sambil dibolak-balik hingga daging ayam matang dan ada sedikit bagian yang *charred* (gosong karamel).
7. Penyajian: Letakkan sate di piring saji, siram dengan sisa bumbu kacang kental. Beri taburan irisan bawang merah mentah dan sediakan perasan jeruk limau.`,

  'Rendang Daging': `1. Persiapan daging: Potong daging sapi agak tebal melawan serat memanjang agar nantinya tidak mudah hancur dan lebih cepat empuk saat dimasak lama.
2. Siapkan santan: Pisahkan antara santan kental dan santan encer dari kelapa parut.
3. Tumis bumbu basah: Panaskan wajan besar, masukkan bumbu halus rendang (bawang, cabai, jahe, lengkuas, kunyit) tanpa minyak, aduk-aduk hingga airnya sedikit menyusut.
4. Masukkan santan dan aromatik: Tuangkan santan encer ke dalam wajan. Masukkan juga daun jeruk, daun kunyit, serai yang dimemarkan, dan asam kandis. Aduk perlahan dan terus-menerus agar santan tidak pecah hingga mendidih.
5. Masukkan daging: Setelah kuah santan mengeluarkan minyak, masukkan potongan daging sapi. Kecilkan api ke tingkat paling minimal (slow cook).
6. Proses karamelisasi: Masak daging sambil sesekali diaduk perlahan dari dasar wajan agar tidak gosong. Proses ini bisa memakan waktu 3-4 jam. Warna kuah akan perlahan berubah menjadi cokelat pekat (kalio) hingga akhirnya mengering dan menghitam menjadi rendang.
7. Penyajian: Setelah kuah benar-benar mengering dan bumbu menempel sempurna pada daging yang empuk, angkat dan sajikan. Rendang biasanya lebih nikmat disantap keesokan harinya.`,

  'Roti Bakar Coklat Keju': `1. Siapkan roti: Ambil lembaran roti tawar berkualitas baik yang potongannya agak tebal agar hasil akhirnya lebih memuaskan.
2. Olesan dasar: Olesi kedua sisi luar roti tawar dengan margarin atau mentega secara merata.
3. Tahap pertama pemanggangan: Panaskan teflon (wajan datar) dengan api kecil ke sedang. Letakkan roti di atasnya. Panggang hingga bagian bawahnya mulai agak kecokelatan dan renyah.
4. Beri isian: Balik roti tersebut. Di atas sisi yang sudah kecokelatan, taburkan meses coklat secara merata secukupnya, lalu tambahkan parutan keju cheddar di atasnya.
5. Tutup roti: Letakkan satu lembar roti tawar lain yang sudah diolesi margarin di atas tumpukan isian tersebut. Tekan sedikit menggunakan spatula agar isian menempel.
6. Balik dan panggang sempurna: Balik seluruh porsi roti secara hati-hati agar sisi yang mentah berada di bawah. Panggang hingga sisi tersebut renyah kecokelatan dan isian coklat-keju di dalamnya meleleh.
7. Penyajian: Angkat roti, potong menjadi dua bagian membentuk segitiga, lalu sajikan selagi panas dan isiannya lumer.`,

  'Nasi Uduk': `1. Cuci beras: Cuci beras putih hingga airnya jernih. Tiriskan beras dan sisihkan.
2. Persiapkan santan berbumbu: Masukkan santan (sebaiknya perasan kelapa murni) ke dalam panci. Masukkan daun salam yang diremas, batang serai yang dimemarkan, dan garam secukupnya (pastikan rasa asinnya sedikit lebih kuat dari biasanya karena akan terserap beras).
3. Rebus santan: Rebus santan berbumbu tersebut di atas api sedang sambil terus diaduk perlahan. Ini penting agar santan tidak pecah. Angkat setelah mendidih.
4. Proses menanak: Pindahkan beras yang sudah dicuci ke dalam panci penanak nasi (rice cooker). Tuangkan rebusan santan panas ke dalamnya. Takaran cairannya sama seperti Anda menanak nasi biasa (kurang lebih 1 ruas jari di atas permukaan beras).
5. Masak hingga matang: Tekan tombol 'Cook' pada rice cooker. Tunggu hingga proses memasak selesai. Jika sudah 'Warm', biarkan selama 10 menit agar nasi benar-benar tanak.
6. Aduk rata: Buka rice cooker, aduk nasi uduk dari bawah ke atas agar gurihnya santan merata ke seluruh nasi.
7. Penyajian: Sajikan nasi uduk selagi hangat dengan taburan bawang merah goreng yang banyak, telur dadar iris, ayam goreng, dan sambal kacang.`,

  'Opor Ayam': `1. Persiapan ayam: Cuci bersih daging ayam. Rebus ayam sebentar saja di air mendidih untuk membuang darah dan kotoran. Tiriskan.
2. Bumbu aromatik: Haluskan bawang merah, bawang putih, ketumbar sangrai, kemiri, dan jintan.
3. Tumis bumbu: Panaskan minyak, tumis bumbu halus bersama lengkuas memar, serai, dan daun jeruk. Tumis dengan api sedang hingga bumbu berbau harum, matang, dan tidak langu.
4. Masukkan ayam: Masukkan potongan ayam ke dalam tumisan bumbu. Aduk rata hingga seluruh permukaan ayam terbalut bumbu dan warnanya sedikit berubah.
5. Masak dengan santan encer: Tuangkan santan cair secukupnya. Masak dengan api sedang hingga ayam menjadi empuk dan bumbu meresap ke dalam serat daging.
6. Penyelesaian dengan santan kental: Setelah ayam empuk, tuangkan santan kental. Tambahkan garam, sejumput gula pasir, dan sedikit kaldu jamur. Masak kembali sambil sesekali diaduk agar santan tidak pecah hingga kuah mendidih dan mengental.
7. Penyajian: Matikan api, angkat opor ayam. Sajikan di dalam mangkuk besar dan jangan lupa taburi dengan bawang merah goreng renyah di atasnya.`
};

async function updateInstructions() {
  const recipes = await prisma.recipe.findMany();
  for (const recipe of recipes) {
    if (detailedInstructions[recipe.title]) {
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { instructions: detailedInstructions[recipe.title] }
      });
      console.log('Updated', recipe.title);
    }
  }
  console.log("All instructions updated!");
}

updateInstructions().catch(console.error).finally(() => prisma.$disconnect());
