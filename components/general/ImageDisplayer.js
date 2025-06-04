import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Text,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const SPACING = 10;
const THUMBNAIL_SIZE = 80;
const ACTIVE_THUMBNAIL_SIZE = 100;

// Import a default placeholder image
const placeholderImage = require("../../assets/placeholders/apartment-placeholder.jpg");

const ImageDisplayer = ({ images, isLocal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleThumbnailPress = (index) => {
    setActiveIndex(index);
  };

  const openGallery = (index) => {
    setModalIndex(index);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeGallery = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const nextImage = () => {
    if (modalIndex < images.length - 1) {
      setModalIndex(modalIndex + 1);
    }
  };

  const prevImage = () => {
    if (modalIndex > 0) {
      setModalIndex(modalIndex - 1);
    }
  };

  const renderMainImage = () => {
    if (!images || images.length === 0) {
      return (
        <View style={styles.mainImageContainer}>
          <Image
            source={placeholderImage}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.mainImageContainer}
        onPress={() => openGallery(activeIndex)}
        activeOpacity={0.9}
      >
        <Image
          source={
            isLocal
              ? { uri: images[activeIndex] }
              : { uri: images[activeIndex] }
          }
          style={styles.mainImage}
          resizeMode="cover"
        />
        <View style={styles.galleryPrompt}>
          <Ionicons name="expand-outline" size={18} color="#FFF" />
          <Text style={styles.galleryPromptText}>View Gallery</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderThumbnails = () => {
    if (!images || images.length <= 1) return null;

    return (
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.thumbnailList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => handleThumbnailPress(index)}
              style={[
                styles.thumbnailButton,
                activeIndex === index ? styles.activeThumbnail : null,
              ]}
            >
              <Image
                source={isLocal ? { uri: item } : { uri: item }}
                style={[
                  styles.thumbnailImage,
                  activeIndex === index ? styles.activeThumbnailImage : null,
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderGalleryModal = () => {
    if (!images || images.length === 0) return null;

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
        onRequestClose={closeGallery}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeGallery}
              >
                <Ionicons name="close-circle" size={32} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.galleryCounter}>
                <Text style={styles.counterText}>
                  {modalIndex + 1} / {images.length}
                </Text>
              </View>
            </View>

            <View style={styles.galleryImageContainer}>
              <Image
                source={{ uri: images[modalIndex] }}
                style={styles.galleryImage}
                resizeMode="contain"
              />

              {modalIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.leftNavButton]}
                  onPress={prevImage}
                >
                  <Ionicons name="chevron-back" size={40} color="#FFF" />
                </TouchableOpacity>
              )}

              {modalIndex < images.length - 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.rightNavButton]}
                  onPress={nextImage}
                >
                  <Ionicons name="chevron-forward" size={40} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalThumbnailsContainer}>
              <FlatList
                data={images}
                horizontal
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={modalIndex > 2 ? modalIndex - 2 : 0}
                keyExtractor={(_, index) => `modal-thumb-${index}`}
                contentContainerStyle={styles.modalThumbnailsList}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => setModalIndex(index)}
                    style={[
                      styles.modalThumbnailButton,
                      modalIndex === index ? styles.activeModalThumbnail : null,
                    ]}
                  >
                    <Image
                      source={{ uri: item }}
                      style={styles.modalThumbnailImage}
                      resizeMode="cover"
                    />
                    {modalIndex === index && (
                      <View style={styles.activeThumbnailOverlay} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </Animated.View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderMainImage()}
      {renderThumbnails()}
      {renderGalleryModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  mainImageContainer: {
    width: "100%",
    height: 230,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  galleryPrompt: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  galleryPromptText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  thumbnailContainer: {
    marginVertical: 10,
  },
  thumbnailList: {
    paddingHorizontal: 10,
  },
  thumbnailButton: {
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbnailImage: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 6,
  },
  activeThumbnail: {
    borderColor: "#8B4513",
    transform: [{ scale: 1.1 }],
    zIndex: 1,
  },
  activeThumbnailImage: {
    width: ACTIVE_THUMBNAIL_SIZE - 10,
    height: ACTIVE_THUMBNAIL_SIZE - 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "space-between",
  },
  modalContent: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 8,
  },
  galleryCounter: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  counterText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  galleryImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  galleryImage: {
    width: width,
    height: height * 0.6,
  },
  navButton: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  leftNavButton: {
    left: 10,
  },
  rightNavButton: {
    right: 10,
  },
  modalThumbnailsContainer: {
    height: 90,
    backgroundColor: "rgba(20,20,20,0.9)",
    paddingVertical: 10,
  },
  modalThumbnailsList: {
    alignItems: "center",
  },
  modalThumbnailButton: {
    marginHorizontal: 5,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  modalThumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  activeModalThumbnail: {
    borderColor: "#FFC107",
    transform: [{ scale: 1.1 }],
  },
  activeThumbnailOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,193,7,0.2)",
    borderRadius: 5,
  },
});

export default ImageDisplayer;
