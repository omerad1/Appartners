import React from 'react';
import { Modal, StyleSheet, View, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

const TermsModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Terms & Conditions</Text>
            <IconButton icon="close" onPress={onClose} />
          </View>

          <ScrollView style={styles.content}
                  showsVerticalScrollIndicator={false}
>
            <Text style={styles.paragraph}>
              Welcome to Appartners! By using our app, you agree to the following terms. Please read them carefully.
            </Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing or using Appartners, you agree to be bound by these Terms. If you disagree, please do not use the app.
            </Text>

            <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
            <Text style={styles.paragraph}>
              You are responsible for any content you share and for interactions you make on the platform. Do not use the app for illegal, harmful, or abusive behavior.
            </Text>

            <Text style={styles.sectionTitle}>3. Matchmaking Disclaimer</Text>
            <Text style={styles.paragraph}>
              While we do our best to recommend good matches, we do not guarantee compatibility, safety, or success of any roommate or apartment connections.
            </Text>

            <Text style={styles.sectionTitle}>4. Data Use</Text>
            <Text style={styles.paragraph}>
              We may collect and use personal data as described in our Privacy Policy. By using the app, you consent to such collection and use.
            </Text>

            <Text style={styles.sectionTitle}>5. Modifications</Text>
            <Text style={styles.paragraph}>
              We may update these terms from time to time. Continued use of the app means you accept any updated version.
            </Text>

            <Text style={styles.sectionTitle}>6. Termination</Text>
            <Text style={styles.paragraph}>
              We reserve the right to suspend or delete your account if you violate our terms or community guidelines.
            </Text>

            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              Appartners is provided “as-is.” We are not liable for any losses, damages, or issues that arise from using the app or connecting with others through it.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact</Text>
            <Text style={styles.paragraph}>
              If you have any questions, feel free to contact us at appartners.support@appartners.com.
            </Text>

            <Text style={[styles.paragraph, { marginTop: 20 }]}>
              If you do not agree to these terms, please stop using Appartners.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '90%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'comfortaaSemiBold',
  },
  content: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
    marginTop: 12,
    marginBottom: 4,
    color: '#111',
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    marginBottom: 8,
    color: '#333',
  },
});

export default TermsModal;
