const bcrypt = require('bcryptjs');

const salt1 = bcrypt.genSaltSync(15);
const hash1 = bcrypt.hashSync('B4c0/', salt1);

const salt2 = bcrypt.genSaltSync(15);
const hash2 = bcrypt.hashSync('B4c0/', salt2);

console.log(salt1, salt2);

console.log(hash1);
console.log(hash2);

console.log(bcrypt.compareSync('B4c0/', hash1));
console.log(bcrypt.compareSync('B4c0/', hash2));
