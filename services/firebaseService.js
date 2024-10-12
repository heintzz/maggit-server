const admin = require('firebase-admin');
const serviceAccount = require('../config/capstoned05-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://capstoned05-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

module.exports = admin;
