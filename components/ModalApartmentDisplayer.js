import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImageDisplayer from "./ImageDisplayer";
import SearchTags from "./SearchTags";

// Minimalist color scheme
const COLORS = {
  light: "#F5F5F5",      // Light gray
  lighter: "#E5E5E5",    // Lighter gray for subtle contrast
  dark: "#333333",       // Dark gray/black
  white: "#FFFFFF",      // White
};

const ModalApartmentDisplayer = ({ visible, onClose, apartment }) => {
  // If apartment is null or undefined, provide default empty object
  if (!apartment) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeButtonCircle}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.dark} />
              </View>
            </TouchableOpacity>
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No apartment data available</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Extract properties with safe defaults
  const address = apartment.address || 
    (apartment.street && apartment.house_number ? 
      `${apartment.street} ${apartment.house_number}` : 
      'No address available');
  
  const images = apartment.images || apartment.photo_urls || [
    "https://via.placeholder.com/300x200?text=No+Image",
  ];
  
  const aboutApartment = apartment.aboutApartment || apartment.about || "No description available";
  
  // Handle tags properly to avoid duplication
  const tags = apartment.tags || [];
  
  // Format price with commas and ₪ symbol
  const price = apartment.price ? 
    `₪${Number(apartment.price).toLocaleString()}` : 
    'Price not available';
  
  // Room information
  const totalRooms = apartment.rooms || apartment.number_of_rooms || 'N/A';
  const availableRooms = apartment.availableRooms || apartment.number_of_available_rooms || 'N/A';
  
  // Entry date formatting - ensure it's compact
  const entryDate = apartment.entryDate || apartment.available_entry_date || 'Not specified';
  const formattedEntryDate = typeof entryDate === 'string' && entryDate.includes('-') ? 
    entryDate.split('T')[0].split('-').reverse().join('/') : 
    entryDate;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={styles.closeButtonCircle}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.dark} />
            </View>
          </TouchableOpacity>

          {/* Apartment Details */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Address Header */}
            <View style={styles.headerContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={COLORS.dark}
                style={styles.gpsIcon}
              />
              <Text style={styles.addressHeader}>{address}</Text>
            </View>

            {/* Image Displayer */}
            <View style={styles.imageDisplayerContainer}>
              <ImageDisplayer images={images} isLocal={false} />
            </View>

            {/* Price and Room Info */}
            <View style={styles.infoCardsContainer}>
              <View style={styles.infoCard}>
                <View style={styles.infoCardContent}>
                  <MaterialCommunityIcons name="cash-multiple" size={28} color={COLORS.dark} />
                  <Text style={styles.infoCardTitle}>Price</Text>
                  <Text style={styles.infoCardValue} numberOfLines={1} ellipsizeMode="tail">{price}</Text>
                </View>
              </View>
              
              <View style={styles.infoCard}>
                <View style={styles.infoCardContent}>
                  <MaterialCommunityIcons name="home-outline" size={28} color={COLORS.dark} />
                  <Text style={styles.infoCardTitle}>Rooms</Text>
                  <View style={styles.roomsContainer}>
                    <View style={styles.roomBox}>
                      <Text style={styles.roomNumber}>{totalRooms}</Text>
                      <Text style={styles.roomLabel}>Total</Text>
                    </View>
                    <Text style={styles.roomDivider}>|</Text>
                    <View style={styles.roomBox}>
                      <Text style={styles.roomNumber}>{availableRooms}</Text>
                      <Text style={styles.roomLabel}>Available</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.infoCard}>
                <View style={styles.infoCardContent}>
                  <MaterialCommunityIcons name="calendar-check" size={28} color={COLORS.dark} />
                  <Text style={styles.infoCardTitle}>Entry Date</Text>
                  <Text 
                    style={styles.infoCardValueSmall}
                  >
                    {formattedEntryDate}
                  </Text>
                </View>
              </View>
            </View>

            {/* About Apartment */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderContainer}>
                <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.dark} />
                <Text style={styles.sectionHeader}>About</Text>
              </View>
              <Text style={styles.sectionContent}>{aboutApartment}</Text>
            </View>

            {/* Tags */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderContainer}>
                <MaterialCommunityIcons name="tag-multiple" size={24} color={COLORS.dark} />
                <Text style={styles.sectionHeader}>Tags</Text>
              </View>
              <View style={styles.tagsWrapper}>
                <SearchTags
                  tags={tags}
                  selectedTags={tags}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalApartmentDisplayer;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "92%",
    height: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.light,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  gpsIcon: {
    marginRight: 10,
  },
  addressHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  imageDisplayerContainer: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 16,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: COLORS.light,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoCardContent: {
    padding: 12,
    alignItems: "center",
    height: 110,
    justifyContent: "space-between",
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 4,
  },
  infoCardValue: {
    fontSize: 16,
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "bold",
    width: '100%',
  },
  infoCardValueSmall: {
    fontSize: 13,
    color: COLORS.dark,
    textAlign: "center",
    fontWeight: "bold",
    width: '100%',
  },
  infoCardSubtitle: {
    fontSize: 10,
    color: COLORS.dark,
    opacity: 0.7,
    marginTop: -2,
  },
  roomsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  roomBox: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  roomNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  roomLabel: {
    fontSize: 10,
    color: COLORS.dark,
    opacity: 0.7,
  },
  roomDivider: {
    fontSize: 16,
    color: COLORS.dark,
    opacity: 0.3,
    marginHorizontal: 4,
  },
  sectionContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: COLORS.dark,
    lineHeight: 24,
  },
  tagsWrapper: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.dark,
    textAlign: 'center',
  },
});
