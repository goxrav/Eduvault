import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../config/firebaseConfig";
import api from "../api/axios";
import { useFocusEffect } from "@react-navigation/native";

const BookmarkedNotes = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const currentUid = auth.currentUser?.uid;

  useFocusEffect(
    useCallback(() => {
      fetchBookmarks();
    }, []));
    

  const fetchBookmarks = async () => {
    try {
      const res = await api.get(`/api/bookmarks/${currentUid}`);
      setBookmarks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => {
    const note = item.noteId;

    return (
      <Pressable
        onPress={() => Linking.openURL(note.fileUrl)}
        style={styles.card}
      >
        <Text style={styles.title}>{note.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{note.subject}</Text>
          <Text style={styles.meta}>{note.branch}</Text>
          <Text style={styles.meta}>Sem {note.semester}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📌 Bookmarked Notes</Text>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookmarks yet 👀</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A14",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F4F4F5",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#141422",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#232336",
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
  },
  meta: {
    color: "#A1A1AA",
    fontSize: 12,
  },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
});


export default BookmarkedNotes;