const admin = require('../services/firebaseService');
const firestore = admin.firestore();

exports.sendNotification = async (req, res) => {
  const { title, body, device_id } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
  };

  const tokenSnapshot = await firestore
    .collection('tokenDevices')
    .where('device_id', '==', device_id)
    .get();

  if (tokenSnapshot.empty) {
    console.log('No tokens found for the device ID:', device_id);
    return res.status(404).send({ success: false, message: 'No tokens found for this device.' });
  }

  const tokens = tokenSnapshot.docs.map((doc) => doc.data().token);

  const promises = tokens.map((token) => {
    return admin.messaging().send({ ...message, token });
  });

  Promise.all(promises)
    .then((responses) => {
      console.log('Notifications sent successfully:', responses);
      res.status(200).send({ success: true, message: 'Notifications sent!' });
    })
    .catch((error) => {
      console.error('Error sending notifications:', error);
      res.status(500).send({ success: false, error: error.message });
    });
};
