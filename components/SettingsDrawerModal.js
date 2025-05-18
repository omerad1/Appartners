import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DrawerModal from './DrawerModal';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/redux/user';
import { logout as apiLogout } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const SettingsDrawerModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    // Show confirmation alert
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Show loading indicator or disable UI if needed
              
              // Call the API logout function
              const result = await apiLogout();
              
              if (result.success) {
                // Dispatch Redux action to clear user state
                dispatch(logoutAction());
                
                // Use auth context to handle logout and navigation
                if (authLogout) {
                  authLogout();
                }
                
                // Close the modal
                onClose();
                
                // Let the auth context handle the navigation
                // The AuthContext will take care of redirecting to the login screen
                // No need to manually navigate
              } else {
                throw new Error("Logout failed");
              }
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert(
                "Logout Error",
                "There was a problem logging out. Please try again."
              );
            }
          }
        }
      ]
    );
  };

  return (
    <DrawerModal
      visible={visible}
      onClose={onClose}
      title="Settings"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuItem} onPress={() => {
          onClose();
          // Navigate to account settings or other screens
        }}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => {
          onClose();
          // Navigate to notifications settings
        }}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => {
          onClose();
          // Navigate to privacy settings
        }}>
          <Ionicons name="shield-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => {
          onClose();
          // Navigate to help center
        }}>
          <Ionicons name="help-circle-outline" size={24} color="#333" />
          <Text style={styles.menuItemText}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'comfortaaRegular',
    color: '#333',
  },
  divider: {
    height: 8,
    backgroundColor: '#f5f5f5',
    marginVertical: 10,
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontFamily: 'comfortaaSemiBold',
  },
});

export default SettingsDrawerModal;
