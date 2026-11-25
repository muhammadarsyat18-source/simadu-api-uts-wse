const assert = require('node:assert');

const BASE_URL = 'http://localhost:3000';

async function request(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('=== MEMULAI PENGUJIAN FUNGSIONAL & KEAMANAN SIMADU API ===\n');

  let tokenMhs1 = '';
  let tokenAdmin = '';
  let createdId = null;

  // 1. Login dengan kredensial benar (mhs1)
  let res = await request('POST', '/api/auth/login', {
    body: { username: 'mhs1', password: 'password123' }
  });
  assert.strictEqual(res.status, 200);
  tokenMhs1 = res.data.data.token;
  console.log(`[PASS] #01 Login kredensial benar (mhs1) -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify({ ...res.data, data: { ...res.data.data, token: '[REDACTED]' } })}\n`);

  // 2. Login dengan password salah
  res = await request('POST', '/api/auth/login', {
    body: { username: 'mhs1', password: 'passwordsalah' }
  });
  assert.strictEqual(res.status, 401);
  console.log(`[PASS] #02 Login dengan password salah -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 3. Akses endpoint terlindungi tanpa token
  res = await request('GET', '/api/pengaduan');
  assert.strictEqual(res.status, 401);
  console.log(`[PASS] #03 Akses endpoint terlindungi tanpa token -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 4. Akses menggunakan token tidak valid
  res = await request('GET', '/api/pengaduan', { token: 'token_palsu_12345' });
  assert.strictEqual(res.status, 401);
  console.log(`[PASS] #04 Akses menggunakan token tidak valid -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 5. Mahasiswa membuat pengaduan valid
  res = await request('POST', '/api/pengaduan', {
    token: tokenMhs1,
    body: {
      judul: 'WiFi Gedung FST Putus-Putus',
      kategori: 'TI',
      deskripsi: 'Koneksi WiFi di lantai 2 sering terputus saat jam kuliah.'
    }
  });
  assert.strictEqual(res.status, 201);
  createdId = res.data.data.id;
  console.log(`[PASS] #05 Mahasiswa membuat pengaduan valid -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 6. Mahasiswa membaca pengaduan sendiri
  res = await request('GET', `/api/pengaduan/${createdId}`, { token: tokenMhs1 });
  assert.strictEqual(res.status, 200);
  console.log(`[PASS] #06 Mahasiswa membaca pengaduan sendiri -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 7. Mahasiswa mencoba membaca pengaduan orang lain (id: 2 milik mhs2)
  res = await request('GET', '/api/pengaduan/2', { token: tokenMhs1 });
  assert.strictEqual(res.status, 403);
  console.log(`[PASS] #07 Mahasiswa membaca pengaduan orang lain -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 8. Mahasiswa mengubah status pengaduan
  res = await request('PATCH', `/api/pengaduan/${createdId}/status`, {
    token: tokenMhs1,
    body: { status: 'selesai' }
  });
  assert.strictEqual(res.status, 403);
  console.log(`[PASS] #08 Mahasiswa mengubah status pengaduan -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // Login sebagai admin untuk skenario 9 dan 10
  const loginAdmin = await request('POST', '/api/auth/login', {
    body: { username: 'admin', password: 'password123' }
  });
  tokenAdmin = loginAdmin.data.data.token;

  // 9. Admin melihat seluruh pengaduan
  res = await request('GET', '/api/pengaduan', { token: tokenAdmin });
  assert.strictEqual(res.status, 200);
  console.log(`[PASS] #09 Admin melihat seluruh pengaduan -> Status ${res.status} (Total data: ${res.data.data.length})`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 10. Admin memperbarui status pengaduan
  res = await request('PATCH', `/api/pengaduan/${createdId}/status`, {
    token: tokenAdmin,
    body: { status: 'diproses' }
  });
  assert.strictEqual(res.status, 200);
  console.log(`[PASS] #10 Admin memperbarui status pengaduan -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 11. Membuat pengaduan dengan field wajib kosong
  res = await request('POST', '/api/pengaduan', {
    token: tokenMhs1,
    body: { judul: '', kategori: 'TI', deskripsi: 'Coba field kosong' }
  });
  assert.strictEqual(res.status, 400);
  console.log(`[PASS] #11 Membuat pengaduan dengan field wajib kosong -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  // 12. Mengakses ID pengaduan yang tidak ditemukan
  res = await request('GET', '/api/pengaduan/999', { token: tokenMhs1 });
  assert.strictEqual(res.status, 404);
  console.log(`[PASS] #12 Mengakses ID pengaduan tidak ditemukan -> Status ${res.status}`);
  console.log(`       Respons: ${JSON.stringify(res.data)}\n`);

  console.log('=== RINGKASAN HASIL: 12/12 SKENARIO WAJIB LULUS ===');
}

runTests().catch((err) => {
  console.error('PENGUJIAN GAGAL:', err);
  process.exit(1);
});