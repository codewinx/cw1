const bcrypt = require('bcryptjs');

async function makeHash() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('Admin@123', salt); // change password as needed
  console.log('Hashed password:', hashed);
}

makeHash();
