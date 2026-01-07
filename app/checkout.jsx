import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import spacing from "@/Constants/spacing";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Stack } from "expo-router";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckoutScreen() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Add address modal
  const [addVisible, setAddVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [addressText, setAddressText] = useState("");

  const [selectedPayment, setSelectedPayment] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Async Storage Logic
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const saved = await AsyncStorage.getItem("addresses");
        if (saved) {
          setAddresses(JSON.parse(saved));
        }
      } catch (e) {
        console.log("Failed to load addresses", e);
      }
    };

    loadAddresses();
  }, []);

  useEffect(() => {
    const saveAddresses = async () => {
      try {
        await AsyncStorage.setItem("addresses", JSON.stringify(addresses));
      } catch (e) {
        console.log("Failed to save addresses", e);
      }
    };

    saveAddresses();
  }, [addresses]);

  const { cart } = useCart();
  const { colors } = useTheme();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (address.length > 0) {
      const formattedAddress = `${address[0].street || ""}, ${
        address[0].city || ""
      }, ${address[0].region || ""}, ${address[0].country || ""}`;

      const newAddress = {
        id: "current",
        label: "Current Location",
        address: formattedAddress,
      };

      setAddresses((prev) => {
        const filtered = prev.filter((a) => a.id !== "current");
        return [...filtered, newAddress];
      });

      setSelectedAddressId("current");
    }

    setMapVisible(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Checkout",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 220 }}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Shipping to
          </Text>

          {/* ADDRESS LIST */}
          {addresses.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor:
                    selectedAddressId === item.id
                      ? colors.selectedCard
                      : colors.card,
                  borderColor:
                    selectedAddressId === item.id
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={() => setSelectedAddressId(item.id)}
            >
              <View style={styles.optionHeaders}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.optionTitle, { color: colors.textPrimary }]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.optionText, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {item.address}
                  </Text>
                </View>

                <Text style={[styles.radio, { color: colors.primary }]}>
                  {selectedAddressId === item.id ? "◉" : "○"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.locationButton, { borderColor: colors.primary }]}
            onPress={() => setAddVisible(true)}
          >
            <Text
              style={[styles.locationButtonText, { color: colors.primary }]}
            >
              + Add Address
            </Text>
          </TouchableOpacity>

          {/* LOCATION BUTTON */}
          <TouchableOpacity
            style={[styles.locationButton, { borderColor: colors.primary }]}
            onPress={getCurrentLocation}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[styles.locationButtonText, { color: colors.primary }]}
              >
                Use my current location
              </Text>
              <Ionicons
                name="location-outline"
                size={28}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>

          {/* PAYMENT */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Payment method
          </Text>

          {[
            ["card", "Credit / Debit Card", "card-outline"],
            ["paypal", "PayPal", "logo-paypal"],
            ["gpay", "Google Pay", "logo-google"],
            ["apple", "Apple Pay", "logo-apple"],
          ].map(([key, label, icon]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionCard,
                {
                  backgroundColor:
                    selectedPayment === key ? colors.selectedCard : colors.card,
                  borderColor:
                    selectedPayment === key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedPayment(key)}
            >
              <View style={styles.optionHeader}>
                <Ionicons name={icon} size={22} color={colors.textPrimary} />
                <Text
                  style={[styles.optionTitle, { color: colors.textPrimary }]}
                >
                  {label}
                </Text>
                <Text style={[styles.radio, { color: colors.primary }]}>
                  {selectedPayment === key ? "◉" : "○"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SUMMARY */}
        <View
          style={[
            styles.fixedSummary,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={{ color: colors.textSecondary }}>Shipping fee</Text>
            <Text style={{ color: colors.textPrimary }}>$30</Text>
          </View>

          <View style={styles.row}>
            <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
            <Text style={{ color: colors.textPrimary }}>
              ${total.toFixed(2)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
              Total
            </Text>
            <Text style={styles.totalValue}>${(total + 30).toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>Payment</Text>
          </TouchableOpacity>
        </View>

        {/* MAP MODAL */}
        <Modal visible={mapVisible} animationType="slide">
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.mapHeader,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <TouchableOpacity onPress={() => setMapVisible(false)}>
                <Text
                  style={{
                    fontSize: 40,
                    color: colors.textPrimary,
                  }}
                >
                  ←
                </Text>
              </TouchableOpacity>
              <Text style={[styles.mapTitle, { color: colors.textPrimary }]}>
                Select location
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <MapView style={{ flex: 1 }} region={region} showsUserLocation>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
            </MapView>

            <View
              style={[
                styles.mapFooter,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => setMapVisible(false)}
              >
                <Text style={styles.buttonText}>Confirm location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal transparent visible={addVisible} animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.textPrimary,
                  marginBottom: spacing.md,
                }}
              >
                Add Address
              </Text>

              <TextInput
                placeholder="Label (Home, Office, etc)"
                placeholderTextColor={colors.textSecondary}
                value={label}
                onChangeText={setLabel}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: spacing.md,
                  color: colors.textPrimary,
                  marginBottom: spacing.sm,
                }}
              />

              <TextInput
                placeholder="Full address"
                placeholderTextColor={colors.textSecondary}
                value={addressText}
                onChangeText={setAddressText}
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: spacing.md,
                  color: colors.textPrimary,
                  height: 80,
                  marginBottom: spacing.md,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => setAddVisible(false)}
                  style={{ marginRight: spacing.md }}
                >
                  <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!label || !addressText) return;

                    const newAddress = {
                      id: Date.now().toString(),
                      label,
                      address: addressText,
                    };

                    setAddresses([...addresses, newAddress]);
                    setSelectedAddressId(newAddress.id);

                    setLabel("");
                    setAddressText("");
                    setAddVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "bold",
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

/* STYLES (NO UI CHANGES) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: spacing.sm,
    padding: 10,
  },
  optionCard: {
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: 8,
  },
  optionHeaders: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionText: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
  radio: {
    fontSize: 40,
    marginRight: 10,
  },
  editIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: 20,
    padding: 4,
    zIndex: 2,
  },
  editIconText: {
    fontSize: 14,
  },
  locationButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  locationButtonText: {
    fontWeight: "600",
    marginRight: 8,
  },
  fixedSummary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    borderTopWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6c5ce7",
  },
  button: {
    padding: spacing.md,
    borderRadius: 16,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mapHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  mapFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
});
