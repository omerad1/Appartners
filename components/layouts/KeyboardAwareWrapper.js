import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const KeyboardAwareWrapper = ({
  children,
  style,
  enabled = true,
  scrollEnabled = true,
}) => {
  const content = scrollEnabled ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, style]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
      style={styles.transparentBackground}
    >
      {children}
    </ScrollView>
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, style, styles.transparentBackground]}>{children}</View>
    </TouchableWithoutFeedback>
  );

  if (!enabled) {
    return content;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
});

export default KeyboardAwareWrapper;