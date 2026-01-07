import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import spacing from "@/Constants/spacing";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@/context/FavoritesContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { cart, setCart } = useCart();
  const { colors } = useTheme();
  const { favorites, setFavorites } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const liked = favorites.some((p) => p.id === product?.id);

  const toggleFavorite = () => {
    if (!product) return;

    if (liked) {
      setFavorites((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      setFavorites((prev) => [...prev, product]);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.log("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    router.push("/(tabs)/cart");
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Product",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
          }}
        />
        <View style={[styles.center, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Product not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Product",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* SCROLLABLE CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Image
            source={{ uri: product.image }}
            style={[styles.image, { backgroundColor: colors.card }]}
          />

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {product.title}
              </Text>

              <TouchableOpacity onPress={toggleFavorite} activeOpacity={0.7}>
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={22}
                  color={liked ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.price, { color: colors.primary }]}>
              ${product.price}
            </Text>

            {/* Category & Rating */}
            <View style={styles.metaRow}>
              <Text style={[styles.category, { color: colors.textSecondary }]}>
                Category: {product.category}
              </Text>

              <View style={styles.ratingRow}>
                <Text style={[styles.rating, { color: colors.textPrimary }]}>
                  ⭐ {product.rating.rate}
                </Text>
                <Text
                  style={[styles.ratingCount, { color: colors.textSecondary }]}
                >
                  ({product.rating.count} reviews)
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Description
            </Text>

            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>
        </ScrollView>

        {/* FIXED ADD TO CART BAR */}
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },

  info: {
    padding: spacing.md,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },

  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },

  metaRow: {
    marginBottom: spacing.lg,
  },

  category: {
    fontSize: 14,
    marginBottom: spacing.sm,
    textTransform: "capitalize",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: spacing.xs,
  },

  ratingCount: {
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },

  button: {
    padding: spacing.md,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titleRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 10,
},

title: {
  flex: 1,          // important for wrapping
  fontSize: 20,
  fontWeight: "700",
},

});
