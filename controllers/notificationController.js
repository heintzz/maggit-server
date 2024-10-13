const admin = require('../services/firebaseService');
const firestore = admin.firestore();

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

exports.sendNotification = async (req, res) => {
  const { title, body, device_id } = req.body;

  const message = {
    notification: { title, body },
  };

  try {
    const tokenSnapshot = await firestore
      .collection('tokenDevices')
      .where('device_id', '==', device_id)
      .get();

    if (tokenSnapshot.empty) {
      console.log('No tokens found for the device ID:', device_id);
      return res.status(404).send({ success: false, message: 'No tokens found for this device.' });
    }

    const tokens = tokenSnapshot.docs.map((doc) => doc.data().token);

    // Kirim notifikasi ke semua token
    const responses = await Promise.all(
      tokens.map((token) => admin.messaging().send({ ...message, token }))
    );

    console.log('Notifications sent successfully:', responses);

    await firestore.collection('notifications').add({
      device_id,
      title,
      body,
      created_at: formatDate(Date.now()),
    });

    res.status(200).send({ success: true, message: 'Notifications sent!' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).send({ success: false, error: error.message });
  }
};
