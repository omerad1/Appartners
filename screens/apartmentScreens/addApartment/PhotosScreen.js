// screens/apartmentScreens/addApartment/PhotosScreen.js

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chip, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../../../components/layouts/BackgroundImage";
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import PhotoUploader from "../../../components/general/PhotoUploader";

import { createApartment, updateApartment } from "../../../api/apartments";

export default function PhotosScreen() {
  const navigation = useNavigation();
  // navigate on the parent (e.g. root) navigator
  const parentNav = navigation.getParent() ?? navigation;

  const {
    formData: routeFormData = {},
    entryDay = new Date().toISOString().split("T")[0],
    selectedTags = [],
    isEditing = false,
    apartmentId,
    apartment,
  } = useRoute().params || {};

  const [formData, setFormData] = useState(routeFormData);
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // load any saved formData
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("apartmentFormData");
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(
            Object.keys(routeFormData).length
              ? { ...parsed, ...routeFormData }
              : parsed
          );
        }
      } catch (e) {
        console.error("Load form data error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // populate existingPhotos on edit
  useEffect(() => {
    if (isEditing && apartment?.photo_urls) {
      setExistingPhotos(apartment.photo_urls);
    }
  }, [isEditing, apartment]);

  const validate = () => {
    const required = ["city", "street", "floor", "totalPrice"];
    const missing = required.filter(
      (k) => formData[k] == null || String(formData[k]).trim() === ""
    );
    if (missing.length) {
      Alert.alert("Missing Information", `Please fill: ${missing.join(", ")}`, [
        { text: "Go Back", onPress: () => navigation.goBack() },
      ]);
      return false;
    }
    return true;
  };

  const buildFormData = () => {
    if (!validate()) throw new Error("Missing fields");

    const fd = new FormData();
    fd.append("city", formData.city);
    fd.append("street", formData.street);
    fd.append("type", formData.apartmentType || "apartment");
    fd.append("floor", parseInt(formData.floor, 10));
    fd.append("number_of_rooms", parseInt(formData.rooms || 1, 10));
    fd.append(
      "number_of_available_rooms",
      parseInt(formData.availableRooms || 1, 10)
    );
    fd.append("total_price", parseFloat(formData.totalPrice));
    fd.append("available_entry_date", entryDay);
    fd.append("latitude", parseFloat(31.2593441));
    fd.append("longitude", parseFloat(34.7936649));
    formData.about && fd.append("about", formData.about);
    formData.area && fd.append("area", formData.area);
    formData.buildingNumber &&
      fd.append("house_number", parseInt(formData.buildingNumber, 10));

    selectedTags.forEach((tag) => {
      const id = typeof tag === "number" ? tag : parseInt(tag, 10);
      fd.append("features", id);
    });

    if (isEditing) {
      existingPhotos.forEach((url) => {
        fd.append("existing_photos", url);
      });
    }

    photos.forEach((photo) => {
      if (photo.isExisting) return;
      fd.append("photos", {
        uri: photo.uri,
        name: photo.fileName || photo.uri.split("/").pop(),
        type: photo.mimeType || "image/jpeg",
      });
    });

    return fd;
  };

  const submit = async () => {
    if (!validate()) return;

    const totalCount =
      existingPhotos.length + photos.filter((p) => !p.isExisting).length;
    if (!isEditing && totalCount === 0) {
      Alert.alert("Error", "Please upload at least one photo");
      return;
    }

    setSubmitting(true);
    try {
      const fd = buildFormData();
      await (isEditing
        ? updateApartment(apartmentId, fd)
        : createApartment(fd));

      // clear saved draft
      await AsyncStorage.removeItem("apartmentFormData");

      Alert.alert(
        "Success",
        isEditing ? "Apartment updated!" : "Apartment created!",
        [
          {
            text: "OK",
            onPress: () => parentNav.navigate("ListApartment"),
          },
        ]
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <BackgroundImage>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#8B4513" />
          <Text>Loading...</Text>
        </View>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <AddApartmentLayout
        title={isEditing ? "Update Photos" : "Upload Photos"}
        next={!submitting}
        onPress={submit}
        text={isEditing ? "Update" : "Finish"}
      >
        <LinearGradient
          colors={["rgba(212,183,162,0.7)", "rgba(150,111,93,0.85)"]}
          style={styles.card}
        >
          <View style={styles.header}>
            <Text style={styles.instruction}>
              {isEditing
                ? "Add or replace photos of your apartment"
                : "Upload photos of your apartment"}
            </Text>
          </View>

          {isEditing && existingPhotos.length > 0 && (
            <View style={styles.chipRow}>
              <Chip mode="outlined">{existingPhotos.length} existing</Chip>
            </View>
          )}

          <View style={styles.uploader}>
            <PhotoUploader
              onChange={setPhotos}
              initialPhotos={existingPhotos}
            />
          </View>

          {submitting ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text>Submitting...</Text>
            </View>
          ) : (
            <View style={styles.tip}>
              <Ionicons name="bulb-outline" size={22} color="#8B4513" />
              <Text style={styles.tipText}>
                Tip: Well-lit photos make your listing stand out!
              </Text>
            </View>
          )}
        </LinearGradient>
      </AddApartmentLayout>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "comfortaaSemiBold",
    textAlign: "center",
  },
  chipRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploader: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 15,
    padding: 12,
    minHeight: 300,
  },
  loading: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#5D4037",
    fontFamily: "comfortaaSemiBold",
  },
});
