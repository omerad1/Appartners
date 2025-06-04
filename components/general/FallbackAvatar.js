import React from 'react';
import { Avatar } from 'react-native-paper';

const FallbackAvatar = ({ firstName = '', lastName = '', size = 48 }) => {
  const getInitials = () => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last;
  };

  return (
    <Avatar.Text
      size={size}
      label={getInitials()}
      style={{ backgroundColor: '#90a4ae' }} // You can randomize color if desired
    />
  );
};

export default FallbackAvatar;
