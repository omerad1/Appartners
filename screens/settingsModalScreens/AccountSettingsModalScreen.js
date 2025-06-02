import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Avatar, Text, Divider, List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

function AccountSettingsScreen() {
  const user = useSelector((state) => state.user.currentUser);

  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("User account deleted");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={80}
          source={user?.photo_url ? { uri: user.photo_url } : {}}
        />
        <Text style={styles.name}>
          {user?.first_name || ''} {user?.last_name || ''}
        </Text>
      </View>

      <Divider style={{ marginBottom: 20 }} />

      <List.Item
        title="Full Name"
        description={`${user?.first_name || ''} ${user?.last_name || ''}`}
        left={(props) => <List.Icon {...props} icon="account-outline" />}
      />
      <Divider />

      <List.Item
        title="Email"
        description={user?.email || 'Not provided'}
        left={(props) => <List.Icon {...props} icon="email-outline" />}
      />
      <Divider />

      <List.Item
        title="Phone"
        description={user?.phone_number || 'Not provided'}
        left={(props) => <List.Icon {...props} icon="phone-outline" />}
      />
      <Divider />

      <List.Item
        title="Gender"
        description={user?.gender || 'Not provided'}
        left={(props) => <List.Icon {...props} icon="gender-male-female" />}
      />
      <Divider />

      <List.Item
        title="Birth Date"
        description={
          user?.birth_date
            ? format(new Date(user.birth_date), 'dd/MM/yyyy')
            : 'Not provided'
        }
        left={(props) => <List.Icon {...props} icon="calendar-outline" />}
      />
      <Divider />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="black" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontFamily: 'comfortaaSemiBold',
    marginTop: 10,
    color: '#333',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 30,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#ffee85',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  deleteButtonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'comfortaaSemiBold',
    marginLeft: 10,
  },
});

export default AccountSettingsScreen;
