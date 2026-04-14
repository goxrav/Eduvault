import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
  TextInput,
  Linking,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { auth } from "../config/firebaseConfig";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbar } from "../components/GlobalSnackbar";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0A0A14",
  surface: "#13131F",
  card: "#1A1A2E",
  border: "#252538",
  accent: "#7C3AED",
  accentLight: "#A78BFA",
  accentDim: "#2D1F5E",
  green: "#22C55E",
  greenDim: "#052E16",
  red: "#EF4444",
  redDim: "#2D0707",
  textPrimary: "#F4F4F5",
  textSecondary: "#A1A1AA",
  textMuted: "#52525B",
};

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getFileIcon = (name = "") => {
  if (name.endsWith(".pdf")) return "📕";
  if (name.endsWith(".docx")) return "📘";
  if (name.endsWith(".jpg") || name.endsWith(".png")) return "🖼️";
  return "📄";
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sortNotes = (notes, sortBy) => {
  const arr = [...notes];
  switch (sortBy) {
    case "latest": return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "oldest": return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "az": return arr.sort((a, b) => a.title?.localeCompare(b.title));
    case "za": return arr.sort((a, b) => b.title?.localeCompare(a.title));
    default: return arr;
  }
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={[styles.skeletonTitle, { opacity: 0.7 }]} />
    <View style={[styles.skeletonLine, { opacity: 0.5 }]} />
    <View style={[styles.skeletonLine, { width: "40%", opacity: 0.3 }]} />
  </View>
);

const SortChips = ({ sortBy, setSortBy }) => (
  <View style={styles.sortRow}>
    {SORT_OPTIONS.map((opt) => (
      <Pressable
        key={opt.value}
        onPress={() => setSortBy(opt.value)}
        style={[styles.sortChip, sortBy === opt.value && styles.sortChipActive]}
      >
        <Text style={[styles.sortChipText, sortBy === opt.value && styles.sortChipTextActive]}>
          {opt.label}
        </Text>
      </Pressable>
    ))}
  </View>
);

const TabBar = ({ activeTab, setActiveTab, myCount }) => (
  <View style={styles.tabBar}>
    <Pressable
      onPress={() => setActiveTab("selected")}
      style={[styles.tab, activeTab === "selected" && styles.tabActive]}
    >
      <Text style={[styles.tabText, activeTab === "selected" && styles.tabTextActive]}>
        📚 All Notes
      </Text>
    </Pressable>
    <Pressable
      onPress={() => setActiveTab("my")}
      style={[styles.tab, activeTab === "my" && styles.tabActive]}
    >
      <Text style={[styles.tabText, activeTab === "my" && styles.tabTextActive]}>
        📁 My Uploads
        {myCount > 0 && (
          <Text style={styles.tabBadge}> {myCount}</Text>
        )}
      </Text>
    </Pressable>
  </View>
);

const NoteCard = React.memo(({ item, currentUid, onDelete, onDownload }) => (
  <Pressable
    onPress={() => Linking.openURL(item.fileUrl)}
    style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
  >
    {/* Title row */}
    <View style={styles.cardHeader}>
      <Text style={styles.cardIcon}>{getFileIcon(item.title)}</Text>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
    </View>

    {/* Meta */}
    <View style={styles.cardMeta}>
      <View style={styles.metaChip}>
        <Text style={styles.metaChipText}>{item.subject}</Text>
      </View>
      <Text style={styles.metaText}>{item.userName}</Text>
      <Text style={styles.metaDate}>{formatDate(item.createdAt)}</Text>
    </View>

    {/* Actions */}
    <View style={styles.cardActions}>
      <Pressable
        onPress={() => onDownload(item.fileUrl, item.title)}
        style={({ pressed }) => [styles.btnDownload, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.btnDownloadText}>⬇ Open</Text>
      </Pressable>

      {item.uploadedBy === currentUid && (
        <Pressable
          onPress={() => onDelete(item._id)}
          style={({ pressed }) => [styles.btnDelete, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.btnDeleteText}> Delete</Text>
        </Pressable>
      )}
    </View>
  </Pressable>
));

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("selected");
  const [sortBy, setSortBy] = useState("latest");
const getToast = useSnackbar();
  const { selectedBranch, selectedSemester, setSelectedBranch, setSelectedSemester } = useUser();
  const currentUid = auth.currentUser?.uid;
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
  // ── Fetch ──
const fetchNotes = useCallback(async () => {
  try {
    const res = await api.get(`/api/notes?page=${page}&limit=10`);

    if (res.data.length === 0) {
      setHasMore(false);
      return;
    }

    if (page === 1) {
      setNotes(res.data);
    } else {
      setNotes(prev => {
        const newItems = res.data.filter(
          item => !prev.some(old => old._id === item._id)
        );
        return [...prev, ...newItems];
      });
    }

  } catch (err) {
    if (__DEV__) {
      console.log("Fetch error:", err?.response?.data || err.message);
    }
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
}, [page]);


// 🚀 USE EFFECT (UNCHANGED BUT IMPORTANT)
useEffect(() => {
  fetchNotes();
}, [fetchNotes]);


// 🚀 LOAD MORE
const loadMore = () => {
  if (!loadingMore && hasMore) {
    setLoadingMore(true);
    setPage(prev => prev + 1);
  }
};


// 🚀 FIX REFRESH
const onRefresh = async () => {
  setRefreshing(true);
  setPage(1);
  setHasMore(true);
  setNotes([]); // 🔥 IMPORTANT
  await fetchNotes();
  setRefreshing(false);
};

  // ── Filter & Sort ──
  const query = search.toLowerCase();

  const matchesSearch = (note) =>
    note.title?.toLowerCase().includes(query) ||
    note.subject?.toLowerCase().includes(query) ||
    note.userName?.toLowerCase().includes(query);

  const matchesSelection = (note) =>
    note.branch?.toLowerCase() === selectedBranch?.toLowerCase() &&
    Number(note.semester) === Number(selectedSemester);

  const filteredNotes = sortNotes(
    notes.filter((n) => matchesSearch(n) && matchesSelection(n)),
    sortBy
  );

  const myNotes = sortNotes(
    notes.filter((n) => n.uploadedBy === currentUid && matchesSearch(n)),
    sortBy
  );

  const displayData = activeTab === "selected" ? filteredNotes : myNotes;

  // ── Actions ──
 const deleteNote = useCallback((id) => {
  Alert.alert("Delete Note", "This can't be undone. Sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          await api.delete(`/api/notes/${id}`);

          // 🔥 REFRESH DATA FROM SERVER
          await fetchNotes();

          getToast?.("Note deleted 🗑️", "success");

        } catch (err) {
          console.log("DELETE ERROR:", err.response?.data || err.message);
          getToast?.("Couldn't delete the note", "error");
        }
      },
    },
  ]);
}, [fetchNotes]);

  const downloadFile = useCallback(async (url, filename) => {
  try {
    getToast?.("Opening file... 📥", "info");

    await Linking.openURL(url);

  } catch (err) {
    getToast?.("Download failed ❌", "error");
  }
}, []);

  // ── Render ──
  const ListHeader = () => (
    <View>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appTitle}>EduVault</Text>
          <Text style={styles.appSubtitle}>
            Hey, {auth.currentUser?.displayName?.split(" ")[0] || "there"} 👋
          </Text>
        </View>
       {selectedBranch && selectedSemester && (
  <View style={styles.selectionRow}>
    
    <View style={styles.selectionBadge}>
      <Text style={styles.selectionBadgeText}>
        {selectedBranch} · Sem {selectedSemester}
      </Text>
    </View>

    <Pressable
      onPress={() => {
        setSelectedBranch(null);
        setSelectedSemester(null);
        router.push("/select-details");
      }}
      style={styles.changeBtn}
    >
      <Text style={styles.changeBtnText}>Change</Text>
    </Pressable>

  </View>
)}
</View>
      {/* Stats row */}
      

      {/* Search */}
      <TextInput
        placeholder="Search by title, subject or uploader..."
        placeholderTextColor={COLORS.textMuted}
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Sort chips */}
      <SortChips sortBy={sortBy} setSortBy={setSortBy} />

      {/* Tabs */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} myCount={myNotes.length} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.container}>
        {loading ? (
          <View style={{ padding: 16 }}>
            <ListHeader />
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </View>
        ) : (
         <FlatList
  data={displayData}
  keyExtractor={(item) => item._id}
  contentContainerStyle={styles.listContent}
  ListHeaderComponent={<ListHeader />}

  // 🔥 ADD HERE
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}

  ListFooterComponent={
    loadingMore ? (
      <Text style={{ color: "#aaa", textAlign: "center", marginBottom: 20 }}>
        Loading more...
      </Text>
    ) : null
  }

  ListEmptyComponent={
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>
        {activeTab === "my" ? "📭" : "📂"}
      </Text>
      <Text style={styles.emptyTitle}>
        {activeTab === "my" ? "No uploads yet" : "No notes found"}
      </Text>
    </View>
  }

  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.accentLight}
    />
  }

  renderItem={({ item }) => (
    <NoteCard
      item={item}
      currentUid={currentUid}
      onDelete={deleteNote}
      onDownload={downloadFile}
    />
  )}
/>
        )}

        {/* FAB */}
        <Pressable
          onPress={() => router.push("/upload")}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // App Header
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectionRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 8,
  marginBottom: 12,
},

changeBtn: {
  backgroundColor: COLORS.accentDim,
  borderWidth: 1,
  borderColor: COLORS.accent,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
},

changeBtnText: {
  color: COLORS.accentLight,
  fontSize: 12,
  fontWeight: "600",
},
  selectionBadge: {
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  selectionBadgeText: {
    color: COLORS.accentLight,
    fontSize: 12,
    fontWeight: "600",
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardAction: {
    flex: 1,
    backgroundColor: COLORS.accentDim,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  statNum: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.accentLight,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
  statActionText: {
    fontSize: 20,
  },

  // Search
  searchInput: {
    backgroundColor: "#10101A",
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    borderRadius: 14,
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 10,
  },

  // Sort chips
  sortRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
    transform: [{ scale: 1.05 }],
  },
  sortChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  sortChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  tabActive: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  tabBadge: {
    color: COLORS.accentLight,
    fontWeight: "700",
  },

  // Note card
  card: {
    backgroundColor: "#141422",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#232336",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 21,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  metaChip: {
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaChipText: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: "600",
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  metaDate: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginLeft: "auto",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  btnDownload: {
    flex: 1,
    backgroundColor: "#062E1a",
    borderWidth: 1,
    borderColor: COLORS.green,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDownloadText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "600",
  },
  btnDelete: {
    flex: 1,
    backgroundColor: "#2A0A0A",
    borderWidth: 1,
    borderColor: COLORS.red,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },
  btnDeleteText: {
    color: COLORS.red,
    fontSize: 13,
    fontWeight: "600",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skeletonTitle: {
    height: 16,
    width: "70%",
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    marginBottom: 10,
  },
  skeletonLine: {
    height: 12,
    width: "50%",
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    marginBottom: 8,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: COLORS.accent,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  fabPressed: {
    transform: [{ scale: 0.93 }],
    opacity: 0.85,
  },
  fabIcon: {
    color: "white",
    fontSize: 28,
    lineHeight: 32,
  },
});

export default HomeScreen;