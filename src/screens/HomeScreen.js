import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
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
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnackbar } from "../components/GlobalSnackbar";

const HomeScreen = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 PAGINATION STATES
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const getToast = useSnackbar();
  const { selectedBranch, selectedSemester } = useUser();
  const currentUid = auth.currentUser?.uid;

  // 🚀 FETCH NOTES
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
        setNotes(prev => [...prev, ...res.data]);
      }

    } catch (err) {
      if (__DEV__) {
        console.log("Fetch error:", err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // 🔥 LOAD MORE
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  // 🔥 REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setNotes([]);
    await fetchNotes();
    setRefreshing(false);
  };

  // 🗑 DELETE
  const deleteNote = useCallback((id) => {
    Alert.alert("Delete Note", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await api.delete(`/api/notes/${id}`);
            setPage(1);
            setHasMore(true);
            setNotes([]);
            await fetchNotes();
            getToast?.("Deleted 🗑️", "success");
          } catch {
            getToast?.("Delete failed ❌", "error");
          }
        },
      },
    ]);
  }, [fetchNotes]);

  const downloadFile = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      getToast?.("Failed to open file ❌", "error");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0A0A14" }}>
      <StatusBar barStyle="light-content" />

      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
          Loading...
        </Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}

          // 🔥 PAGINATION
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}

          // 🔥 FOOTER LOADER
          ListFooterComponent={
            loadingMore ? (
              <Text style={{ color: "#aaa", textAlign: "center", margin: 10 }}>
                Loading more...
              </Text>
            ) : null
          }

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }

          renderItem={({ item }) => (
            <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#333" }}>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {item.title}
              </Text>

              <Text style={{ color: "#aaa" }}>{item.subject}</Text>

              <Pressable onPress={() => downloadFile(item.fileUrl)}>
                <Text style={{ color: "lightgreen" }}>Open</Text>
              </Pressable>

              {item.uploadedBy === currentUid && (
                <Pressable onPress={() => deleteNote(item._id)}>
                  <Text style={{ color: "red" }}>Delete</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/upload")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#7C3AED",
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>＋</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;