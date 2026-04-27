import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebaseConfig";
import api from "../api/axios";
import { useFocusEffect } from "@react-navigation/native";
import { useSnackbar } from "../components/GlobalSnackbar";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";

const COLORS = {
  bg: "#0A0A14",
  surface: "#13131F",
  card: "#141422",
  border: "#232336",
  accent: "#7C3AED",
  accentLight: "#A78BFA",
  accentDim: "#2D1F5E",
  green: "#22C55E",
  blue: "#3B82F6",
  blueDim: "#0A1929",
  red: "#EF4444",
  textPrimary: "#F4F4F5",
  textSecondary: "#A1A1AA",
  textMuted: "#52525B",
};

const getFileIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf"))
    return <MaterialIcons name="picture-as-pdf" size={22} color="#EF4444" />;
  if (lower.match(/\.(jpg|jpeg|png|webp)$/))
    return <MaterialIcons name="image" size={22} color="#22C55E" />;
  if (lower.match(/\.(doc|docx)$/))
    return <MaterialIcons name="description" size={22} color="#3B82F6" />;
  if (lower.match(/\.(ppt|pptx)$/))
    return <MaterialIcons name="slideshow" size={22} color="#F97316" />;
  if (lower.match(/\.(xls|xlsx)$/))
    return <MaterialIcons name="grid-on" size={22} color="#10B981" />;
  if (lower.match(/\.(zip|rar)$/))
    return <MaterialIcons name="folder-zip" size={22} color="#A855F7" />;
  return <MaterialIcons name="insert-drive-file" size={22} color="#A1A1AA" />;
};

const BookmarkedNotes = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const currentUid = auth.currentUser?.uid;
  const [loading, setLoading] = useState(true);
  const getToast = useSnackbar();

  useFocusEffect(
    useCallback(() => {
      if (currentUid) fetchBookmarks();
    }, [currentUid])
  );

  const removeBookmark = async (noteId) => {
  if (!noteId) {
    console.log("❌ Missing noteId");
    return;
  }

  if (!currentUid) {
    console.log("❌ Missing user UID");
    return;
  }

  try {
    await api.delete(`/api/bookmarks/${noteId}/${currentUid}`);

    setBookmarks((prev) =>
      prev.filter((b) => b?.noteId?._id !== noteId)
    );

    getToast?.("Removed from bookmarks ❌", "info");
  } catch (err) {
    console.log("REMOVE ERROR:", err);
    getToast?.("Failed to remove bookmark ⚠️", "error");
  }
};

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/bookmarks/${currentUid}`);
      setBookmarks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getFileExtension = (url) => url.split(".").pop().split("?")[0];

  const downloadFile = async (url, filename) => {
    try {
      getToast?.("Downloading... 📥", "info");
      const ext = getFileExtension(url);
      const safeName = filename.replace(/\s+/g, "_") + "." + ext;
      const fileUri = FileSystem.documentDirectory + safeName;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      getToast?.("Download complete ✅", "success");
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.log(err);
      getToast?.("Download failed ❌", "error");
    }
  };

  // ── Skeleton ──
  const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: "40%" }]} />
    </View>
  );

  // ── Card ──
  const renderItem = ({ item }) => {
    const note = item?.noteId;
    if (!note) return null;

    return (
      <Pressable
        onPress={() => note.fileUrl && Linking.openURL(note.fileUrl)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Bookmark indicator strip */}
        <View style={styles.accentStrip} />

        {/* Header row */}
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>{getFileIcon(note.title)}</View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {note.title || "Untitled"}
          </Text>
        </View>

        {/* Meta chips */}
        <View style={styles.metaRow}>
          {note.subject && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{note.subject}</Text>
            </View>
          )}
          {note.branch && (
            <View style={[styles.chip, styles.chipGray]}>
              <Text style={[styles.chipText, styles.chipTextGray]}>
                {note.branch}
              </Text>
            </View>
          )}
          {note.semester && (
            <View style={[styles.chip, styles.chipGray]}>
              <Text style={[styles.chipText, styles.chipTextGray]}>
                Sem {note.semester}
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.cardActions}>
          {/* Open */}
          <Pressable
            onPress={() => note.fileUrl && Linking.openURL(note.fileUrl)}
            style={({ pressed }) => [
              styles.btnOpen,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons name="open-in-new" size={14} color={COLORS.green} />
            <Text style={styles.btnOpenText}>Open</Text>
          </Pressable>

          {/* Download */}
          <Pressable
            onPress={() => downloadFile(note.fileUrl, note.title)}
            style={({ pressed }) => [
              styles.btnDownload,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialIcons
              name="file-download"
              size={14}
              color={COLORS.blue}
            />
            <Text style={styles.btnDownloadText}>Download</Text>
          </Pressable>

          {/* Remove bookmark */}
         <Pressable
  onPress={() => {
    if (!note || !note._id) {
      console.log("❌ Invalid note data:", note);
      return;
    }

    if (!currentUid) {
      console.log("❌ User not loaded");
      return;
    }

    removeBookmark(note._id);
  }}
  style={({ pressed }) => [
    styles.btnRemove,
    pressed && { opacity: 0.7 },
  ]}
>
            <MaterialIcons name="bookmark-remove" size={14} color={COLORS.red} />
            <Text style={styles.btnRemoveText}>Remove</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Bookmarks</Text>
            <Text style={styles.pageSubtitle}>
              {bookmarks.length > 0
                ? `${bookmarks.length} saved note${bookmarks.length > 1 ? "s" : ""}`
                : "Nothing saved yet"}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialIcons
              name="bookmark"
              size={22}
              color={COLORS.accentLight}
            />
          </View>
        </View>

        {/* List */}
        {loading ? (
          <View>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            data={bookmarks}
           keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <MaterialIcons
                    name="bookmark-border"
                    size={40}
                    color={COLORS.textMuted}
                  />
                </View>
                <Text style={styles.emptyTitle}>No bookmarks yet</Text>
                <Text style={styles.emptySubtitle}>
                  Save notes from the home screen to find them here
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
  },

  // Page header
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingBottom: 100,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  // Left accent strip
  accentStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
    paddingLeft: 8,
  },
  cardIcon: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 21,
  },

  // Meta chips
  metaRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 14,
    paddingLeft: 8,
  },
  chip: {
    backgroundColor: COLORS.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    color: COLORS.accentLight,
    fontSize: 11,
    fontWeight: "600",
  },
  chipGray: {
    backgroundColor: "#1E1E2E",
  },
  chipTextGray: {
    color: COLORS.textSecondary,
  },

  // Action buttons
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  btnOpen: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#062E1A",
    borderWidth: 1,
    borderColor: COLORS.green,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnOpenText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "600",
  },
  btnDownload: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: COLORS.blueDim,
    borderWidth: 1,
    borderColor: COLORS.blue,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnDownloadText: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: "600",
  },
  btnRemove: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#2A0A0A",
    borderWidth: 1,
    borderColor: COLORS.red,
    paddingVertical: 9,
    borderRadius: 10,
  },
  btnRemoveText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "600",
  },

  // Skeleton
  skeletonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skeletonTitle: {
    height: 16,
    width: "70%",
    backgroundColor: "#1E1E2E",
    borderRadius: 6,
    marginBottom: 10,
    opacity: 0.7,
  },
  skeletonLine: {
    height: 12,
    width: "50%",
    backgroundColor: "#1E1E2E",
    borderRadius: 6,
    marginBottom: 8,
    opacity: 0.4,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default BookmarkedNotes;