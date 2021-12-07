import crypto from 'crypto';
import fs from 'fs';

// function genKeyPair2() {
//   const keyPair = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 4096, // bits - standard for RSA keys
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem', // Most common formatting choice
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem', // Most common formatting choice
//       passphrase: process.env.RSA_PASSPHRASE,
//     },
//   });
//   // Create the public key file
//   fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);

//   // Create the private key file
//   fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
// }

function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'spki', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs8', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey);
}

// Generate the keypair
genKeyPair();
