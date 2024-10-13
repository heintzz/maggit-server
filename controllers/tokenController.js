const admin = require('../services/firebaseService');
const firestore = admin.firestore();

exports.updateToken = async (req, res) => {
  const { user_id, token } = req.body;
  const { device_id } = req.params;

  try {
    const tokenRef = firestore
      .collection('tokenDevices')
      .where('device_id', '==', device_id)
      .where('token', '==', token);

    const snapshot = await tokenRef.get();

    if (snapshot.empty) {
      await firestore.collection('tokenDevices').add({
        user_id,
        device_id,
        token,
      });
      console.log(`Token added for ${device_id}:`, token);
    } else {
      const docId = snapshot.docs[0].id;
      await firestore.collection('tokenDevices').doc(docId).update({
        token,
      });
      console.log(`Token updated:`, token);
    }

    res.status(200).json({ success: true, message: 'Token saved/updated.' });
  } catch (error) {
    console.error('Error updating token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
