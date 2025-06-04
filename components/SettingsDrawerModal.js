import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';

import DrawerModal from './DrawerModal';
import ChangePasswordTab from './ChangePasswordTab';
import HelpModalScreen from '../screens/settingsModalScreens/HelpModalScreen';
import PrivacyModalScreen from '../screens/settingsModalScreens/PrivacyModalScreen';
import NotificationsModalScreen from '../screens/settingsModalScreens/NotificationsModalScreen';
import AccountSettingsModalScreen from '../screens/settingsModalScreens/AccountSettingsModalScreen';
import TermsModal from './TermsModal';

import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/redux/user';
import { logout as apiLogout } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const SettingsDrawerModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { logout: authLogout } = useAuth();
  const [screen, setScreen] = useState('main');
  const [termsVisible, setTermsVisible] = useState(false);

  const prevScreen = useRef('main');

  const goToScreen = (next) => {
    prevScreen.current = screen;
    setScreen(next);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await apiLogout();
              if (result.success) {
                dispatch(logoutAction());
                if (authLogout) authLogout();
                onClose();
              } else {
                throw new Error('Logout failed');
              }
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Logout Error', 'There was a problem logging out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const SettingsScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} onPress={() => goToScreen('account')}>
        <Ionicons name="person-outline" size={24} color="#333" />
        <Text style={styles.menuItemText}>Account Settings</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => goToScreen('changePassword')}>
        <Ionicons name="lock-closed-outline" size={24} color="#333" />
        <Text style={styles.menuItemText}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => goToScreen('notifications')}>
        <Ionicons name="notifications-outline" size={24} color="#333" />
        <Text style={styles.menuItemText}>Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => goToScreen('privacy')}>
        <Ionicons name="shield-outline" size={24} color="#333" />
        <Text style={styles.menuItemText}>Privacy</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => goToScreen('help')}>
        <Ionicons name="help-circle-outline" size={24} color="#333" />
        <Text style={styles.menuItemText}>Help Center</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setTermsVisible(true)}>
        <Ionicons name="document-text-outline" size={24} color="#333" />
        <Text style={styles.menuItemText}>Terms & Conditions</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const handleBack = () => {
    prevScreen.current = screen;
    setScreen('main');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'changePassword':
        return <ChangePasswordTab onGoBack={handleBack} />;
      case 'help':
        return <HelpModalScreen />;
      case 'privacy':
        return <PrivacyModalScreen />;
      case 'notifications':
        return <NotificationsModalScreen />;
      case 'account':
        return <AccountSettingsModalScreen />;
      default:
        return <SettingsScreen />;
    }
  };

  const isBack = screen === 'main' && prevScreen.current !== 'main';

  return (
    <>
      <DrawerModal
        visible={visible}
        onClose={() => {
          setScreen('main');
          onClose();
        }}
        title={
          screen === 'main'
            ? 'Settings'
            : screen === 'help'
            ? 'Help Center'
            : screen === 'privacy'
            ? 'Privacy Policy'
            : screen === 'changePassword'
            ? 'Change Password'
            : screen === 'notifications'
            ? 'Notifications Settings'
            : screen === 'account'
            ? 'Account Settings'
            : 'Settings'
        }
        leftAction={
          screen !== 'main' && (
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={26} color="#333" />
            </TouchableOpacity>
          )
        }
      >
        <Animated.View
          key={screen}
          entering={isBack ? SlideInLeft.duration(250) : SlideInRight.duration(250)}
          exiting={isBack ? SlideOutRight.duration(250) : SlideOutLeft.duration(250)}
          style={{ flex: 1 }}
        >
          {renderScreen()}
        </Animated.View>
      </DrawerModal>

      <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
    </>
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
