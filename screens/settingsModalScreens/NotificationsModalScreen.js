import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Divider, Text } from 'react-native-paper';

function NotificationsModalScreen() {
  const [chatEnabled, setChatEnabled] = useState(true);
  const [matchEnabled, setMatchEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  return (
    <View style={styles.container}>

      <List.Item
        title="Chat Messages"
        description="Get notified when someone messages you"
        left={(props) => <List.Icon {...props} icon="chat-outline" />}
        right={() => (
          <Switch
            value={chatEnabled}
            onValueChange={() => setChatEnabled(!chatEnabled)}
            color="#facc15"
          />
        )}
      />
      <Divider />

      <List.Item
        title="Match Requests"
        description="Be alerted when a new roommate match is found"
        left={(props) => <List.Icon {...props} icon="account-multiple-outline" />}
        right={() => (
          <Switch
            value={matchEnabled}
            onValueChange={() => setMatchEnabled(!matchEnabled)}
            color="#facc15"
          />
        )}
      />
      <Divider />

      <List.Item
        title="Reminders"
        description="Get daily or weekly reminders about apartment listings"
        left={(props) => <List.Icon {...props} icon="calendar-outline" />}
        right={() => (
          <Switch
            value={reminderEnabled}
            onValueChange={() => setReminderEnabled(!reminderEnabled)}
            color="#facc15"
          />
        )}
      />
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontFamily: 'comfortaaSemiBold',
    marginBottom: 20,
    color: '#333',
  },
});

export default NotificationsModalScreen;
