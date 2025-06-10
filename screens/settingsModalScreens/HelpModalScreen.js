import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function HelpModalScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
>

      <View style={styles.section}>
        <Ionicons name="information-circle-outline" size={22} color="#333" />
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.text}>
          This app helps you manage your account, update your preferences, and stay in control of your data.
        </Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="lock-closed-outline" size={22} color="#333" />
        <Text style={styles.sectionTitle}>Password & Security</Text>
        <Text style={styles.text}>
          You can change your password from the Settings menu. If you forget your password, use the reset link on the login screen.
        </Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="call-outline" size={22} color="#333" />
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <Text style={styles.text}>
          If you encounter any issues, feel free to contact our support team at appartners.support@gmail.com.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'comfortaaSemiBold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'comfortaaSemiBold',
    marginTop: 10,
    color: '#333',
  },
  text: {
    fontSize: 14,
    fontFamily: 'comfortaaRegular',
    color: '#555',
    marginTop: 5,
  },
});

export default HelpModalScreen;
