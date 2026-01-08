import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import spacing from "@/Constants/spacing";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const { colors, isDark } = useTheme();

  // Theme colors
  const screenBg = isDark ? colors.background : "#f5f5f5";
  const cardBg = isDark ? "#1e1e1e" : "#ffffff";
  const cardBorder = isDark ? "#2c2c2c" : "transparent";

  if (cart.length === 0) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: screenBg },
        ]}
      >
        <Text style={{ color: colors.textPrimary }}>
          No Items Yet
        </Text>
      </View>
    );
  }

  // ➕ Increase quantity
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖ Decrease quantity
  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // 🗑 Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // 💰 Total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        My Cart
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <View
              style={[
                styles.cartItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  borderWidth: isDark ? 1 : 0,
                },
              ]}
            >
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.image,
                  { backgroundColor: isDark ? "#2a2a2a" : "#eee" },
                ]}
              />

              <View style={styles.info}>
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
                    styles.category,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.category}
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

              {/* Delete */}
              <TouchableOpacity
                style={styles.delete}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={colors.primary}
                />
              </TouchableOpacity>

              {/* Counter */}
              <View
                style={[
                  styles.counter,
                  {
                    backgroundColor: isDark
                      ? "#2a2a2a"
                      : colors.muted,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Text
                    style={[
                      styles.counterText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.count,
                    { color: colors.textPrimary },
                  ]}
                >
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => increaseQty(item.id)}
                >
                  <Text
                    style={[
                      styles.counterText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { borderColor: colors.border },
        ]}
      >
        <View style={styles.row}>
          <Text
            style={[
              styles.totalText,
              { color: colors.textSecondary },
            ]}
          >
            Total
          </Text>
          <Text
            style={[
              styles.totalPrice,
              { color: colors.textPrimary },
            ]}
          >
            ${total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: spacing.lg,
  },

  cartItem: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 16,
    marginBottom: spacing.md,
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: "contain",
  },

  info: {
    flex: 1,
    marginLeft: spacing.md,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  category: {
    fontSize: 12,
    marginVertical: spacing.xs,
  },

  price: {
    fontSize: 14,
    fontWeight: "bold",
  },

  delete: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },

  footer: {
    paddingTop: spacing.md,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  totalText: {
    fontSize: 16,
  },

  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },

  button: {
    padding: spacing.md,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: "flex-end",
  },

  counterBtn: {
    paddingHorizontal: spacing.sm,
  },

  counterText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  count: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: spacing.xs,
  },
});

