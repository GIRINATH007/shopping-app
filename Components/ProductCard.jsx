import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import spacing from "@/Constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";

export default function ProductCard({ item, onPress }) {
  const { favorites, setFavorites } = useFavorites();
  const { colors, isDark } = useTheme();

  const liked = favorites.some((p) => p.id === item.id);

  const toggleFavorite = () => {
    if (liked) {
      setFavorites((prev) => prev.filter((p) => p.id !== item.id));
    } else {
      setFavorites((prev) => [...prev, item]);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* ❤️ Favorite Button */}
      <TouchableOpacity
        style={[
          styles.heartBadge,
          { backgroundColor: colors.primary },
        ]}
        onPress={toggleFavorite}
        activeOpacity={0.8}
      >
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={16}
          color={liked ? "#ff4d4d" : "#fff"}
        />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={[
          styles.image,
          { backgroundColor: colors.card },
        ]}
      />

      <Text
        style={[
          styles.name,
          { color: colors.textPrimary },
        ]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <Text
        style={[
          styles.price,
          { color: colors.primary },
        ]}
      >
        ${item.price}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.sm,
    marginBottom: spacing.md,
    width: "48%",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    overflow: "visible",
  },

  heartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 28,
    width: 28,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    zIndex: 10,
  },

  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: spacing.sm,
    borderRadius: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: spacing.xs,
  },
});
