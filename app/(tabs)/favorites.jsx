import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFavorites } from "@/context/FavoritesContext";
import { useTheme } from "@/context/ThemeContext";
import spacing from "@/Constants/spacing";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const { colors, isDark } = useTheme();
  const { favorites, setFavorites } = useFavorites();
  const router = useRouter();

  // 🎨 Theme-aware surfaces
  const screenBg = isDark ? colors.background : "#f5f5f5";
  const cardBg = isDark ? "#1e1e1e" : "#ffffff";
  const cardBorder = isDark ? "#2c2c2c" : "transparent";

  if (favorites.length === 0) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: screenBg },
        ]}
      >
        <Text style={{ color: colors.textPrimary }}>
          No favorites yet ❤️
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: screenBg },
      ]}
    >
      {/* Header */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Favorites
      </Text>

      {/* List */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacing.lg,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/product/${item.id}`)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  borderWidth: isDark ? 1 : 0,
                },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={{ flex: 1 }}>
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
              </View>

              <TouchableOpacity
                onPress={() =>
                  setFavorites((prev) =>
                    prev.filter((p) => p.id !== item.id)
                  )
                }
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
});
