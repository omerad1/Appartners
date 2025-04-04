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

const ModalApartmentDisplayer = ({ visible, onClose, apartment }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={30} color="#000" />
          </TouchableOpacity>

          {/* Apartment Details */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Address Header */}
            <View style={styles.headerContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color="black"
                style={styles.gpsIcon}
              />
              <Text style={styles.addressHeader}>{apartment.address}</Text>
            </View>

            {/* Image Displayer */}
            <View style={styles.imageDisplayerContainer}>
              <ImageDisplayer images={apartment.images} isLocal={false} />
            </View>

            {/* About Apartment */}
            <View style={styles.aboutContainer}>
              <Text style={styles.textHeader}>אודות הדירה</Text>
              <Text style={styles.text}>{apartment.aboutApartment}</Text>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <SearchTags tags={apartment.tags} selectedTags={apartment.tags} />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
    backgroundColor: "rgba(185, 185, 185, 0.8)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  gpsIcon: {
    marginRight: 10,
  },
  addressHeader: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    color: "rgb(0, 0, 0)",
  },
  imageDisplayerContainer: {
    marginBottom: 20,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    elevation: 7,
  },
  textHeader: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: "comfortaaRegular",
    textAlign: "right",
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 20,
  },
});
