// // import bcrypt from 'bcrypt'
// const bcrypt = require('bcrypt');

// async function home() {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash('homelander', salt);
//     console.log(hash);
//     const result = await bcrypt.compare('homelander', hash);
//     return result;
// }

// home().then((x) => {
//     console.log(x);
// });
let go = null;

const names = go ? go : 'home';
console.log(names);
