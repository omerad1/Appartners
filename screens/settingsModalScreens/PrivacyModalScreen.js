import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function PrivacyModalScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Ionicons name="information-circle-outline" size={22} color="#333" style={styles.icon} />
        <Text style={styles.sectionTitle}>Data Collection</Text>
      </View>
      <Text style={styles.text}>
        We collect basic personal information (such as email and username) strictly to provide
        our core services. We do not share your data with third parties without your consent.
      </Text>

      <View style={styles.section}>
        <Ionicons name="analytics-outline" size={22} color="#333" style={styles.icon} />
        <Text style={styles.sectionTitle}>Usage Analytics</Text>
      </View>
      <Text style={styles.text}>
        We may use anonymized analytics to understand how users interact with the app to improve user experience.
        This includes features you use, navigation patterns, and technical performance.
      </Text>

      <View style={styles.section}>
        <Ionicons name="lock-closed-outline" size={22} color="#333" style={styles.icon} />
        <Text style={styles.sectionTitle}>Data Storage</Text>
      </View>
      <Text style={styles.text}>
        Your data is securely stored using encrypted cloud storage. Only you and authorized systems can access it.
      </Text>

      <View style={styles.section}>
        <Ionicons name="person-circle-outline" size={22} color="#333" style={styles.icon} />
        <Text style={styles.sectionTitle}>Your Rights</Text>
      </View>
      <Text style={styles.text}>
        You can request to view, update, or delete your personal information at any time
        by contacting our support team.
      </Text>

      <View style={styles.section}>
        <Ionicons name="mail-outline" size={22} color="#333" style={styles.icon} />
        <Text style={styles.sectionTitle}>Contact</Text>
      </View>
      <Text style={styles.text}>
        If you have questions about your data or this privacy policy, please contact us at appartners.privacy@gmail.com.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'comfortaaSemiBold',
    color: '#333',
  },
  text: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#555',
    lineHeight: 20,
    marginLeft: 32, // aligned with text after icon
    marginBottom: 10,
  },
});

export default PrivacyModalScreen;
