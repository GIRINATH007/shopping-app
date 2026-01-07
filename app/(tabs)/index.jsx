import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import spacing from "@/Constants/spacing";
import ProductCard from "@/Components/ProductCard";
import { useRouter } from "expo-router";

const PAGE_SIZE = 10;

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Men", value: "men's clothing" },
  { label: "Women", value: "women's clothing" },
  { label: "Electronics", value: "electronics" },
  { label: "Jewelery", value: "jewelery" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // 🎨 Theme-aware surfaces
  const screenBg = isDark ? colors.background : "#f5f5f5";
  const cardBg = isDark ? "#1e1e1e" : "#ffffff";
  const borderClr = isDark ? "#2c2c2c" : colors.border;

  // 🔹 SOURCE OF TRUTH
  const [allProducts, setAllProducts] = useState([]);

  // 🔹 FILTER STATE
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🔹 PAGINATION STATE
  const [page, setPage] = useState(1);

  // 🔹 UI STATE
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 FETCH PRODUCTS ONCE
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // 🔎 FILTER FIRST
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allProducts, search, selectedCategory]);

  // 📄 PAGINATE FILTERED RESULTS
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, page * PAGE_SIZE);
  }, [filteredProducts, page]);

  // 🔁 RESET PAGINATION
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  // 🔄 LOAD MORE
  const loadMoreProducts = () => {
    if (loadingMore) return;
    if (visibleProducts.length >= filteredProducts.length) return;

    setLoadingMore(true);

    setTimeout(() => {
      setPage((prev) => prev + 1);
      setLoadingMore(false);
    }, 1500);
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: screenBg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: spacing.sm, color: colors.textPrimary }}>
          Loading products...
        </Text>
      </View>
    );
  }

  // ❌ ERROR
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: screenBg }]}>
        <Text style={{ color: colors.textPrimary }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      {/* Header */}
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Discover
      </Text>

      {/* Search */}
      <TextInput
        placeholder="Search products"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.search,
          {
            backgroundColor: cardBg,
            borderColor: borderClr,
            color: colors.textPrimary,
          },
        ]}
      />

      {/* Category Chips */}
      <View style={styles.filterContainer}>
        {CATEGORIES.map((item) => {
          const isActive = selectedCategory === item.value;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => setSelectedCategory(item.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : cardBg,
                  borderColor: isActive ? colors.primary : borderClr,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? "#fff" : colors.textSecondary,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Product Grid */}
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: spacing.md }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: colors.textSecondary }}>
              No products found
            </Text>
          </View>
        }
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

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },

  search: {
    padding: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },

  filterText: {
    fontWeight: "500",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
});
