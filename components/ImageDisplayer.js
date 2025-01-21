import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";

const ImageDisplayer = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: images[currentIndex] }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Navigation Buttons */}
          <TouchableOpacity
            style={[styles.navigationButton, styles.navigationButtonLeft]}
            onPress={goToPrevious}
          >
            <Text style={styles.navigationButtonText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navigationButton, styles.navigationButtonRight]}
            onPress={goToNext}
          >
            <Text style={styles.navigationButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    width: width - 30,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ccc",
    boxShadow: "7px 7px 5px 2px rgba(0, 0, 0, 0.1)",
    elevation: 8,
  },
  imageWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
  },
  navigationButtonLeft: {
    position: "absolute",
    left: 10,
  },
  navigationButtonRight: {
    position: "absolute",
    right: 10,
  },
  navigationButtonText: {
    fontSize: 30,
    color: "#000",
    lineHeight: 32,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(75, 74, 74, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "rgba(177, 1, 1, 0.66)",
  },
});

export default ImageDisplayer;
