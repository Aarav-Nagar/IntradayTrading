import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/Card";
import { Header, ScreenScroll, sharedText } from "../components/Shared";
import { sendChatMessage } from "../services/apiClient";
import { palette } from "../theme/theme";

const starterPrompts = [
  "Explain the weakest link in my latest check",
  "Why can options lose when direction is right?",
  "How much risk is too much for my profile?"
];

export function ChatScreen({ user, currentReport }) {
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me about options, risk, journaling, or your latest check. I can explain trade structure, but I will not tell you what to buy or sell."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(starterPrompts);

  async function submit(text = input) {
    const clean = text.trim();
    if (!clean || loading) {
      return;
    }
    setInput("");
    setMessages((items) => [...items, { role: "user", content: clean }]);
    setLoading(true);
    try {
      const response = await sendChatMessage({ user, threadId, message: clean, currentReport });
      setThreadId(response.thread_id);
      setSuggestions(response.suggested_prompts || starterPrompts);
      setMessages((items) => [...items, { role: "assistant", content: response.answer }]);
    } catch (err) {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          content: "I could not reach the AI service. Check that the FastAPI backend is running, then try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenScroll>
      <Header title="AI Sidecar" subtitle="Ask investing and options-risk questions in plain English." />
      <Card style={styles.contextCard}>
        <View style={styles.contextIcon}>
          <Ionicons name="sparkles-outline" size={20} color={palette.green} />
        </View>
        <View style={styles.flex}>
          <Text style={sharedText.mediumTitle}>{currentReport ? "Latest check attached" : "Educational chat mode"}</Text>
          <Text style={sharedText.bodyText}>
            {currentReport
              ? `${currentReport.ticker}: weakest link is ${currentReport.weakestLink}.`
              : "Run a risk check first to let chat reference the current trade brief."}
          </Text>
        </View>
      </Card>

      <View style={styles.suggestions}>
        {suggestions.map((prompt) => (
          <Pressable key={prompt} style={styles.promptChip} onPress={() => submit(prompt)}>
            <Text style={styles.promptText}>{prompt}</Text>
          </Pressable>
        ))}
      </View>

      <Card>
        <ScrollView style={styles.chatWindow} showsVerticalScrollIndicator={false}>
          {messages.map((message, index) => (
            <View key={`${message.role}-${index}`} style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, message.role === "user" && styles.userBubbleText]}>{message.content}</Text>
            </View>
          ))}
          {loading ? (
            <View style={[styles.bubble, styles.aiBubble]}>
              <Text style={styles.bubbleText}>Thinking through the risk...</Text>
            </View>
          ) : null}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about risk, IV, sizing..."
            placeholderTextColor={palette.muted}
            style={styles.input}
          />
          <Pressable style={styles.sendButton} onPress={() => submit()}>
            <Ionicons name="send" size={17} color="#FFFFFF" />
          </Pressable>
        </View>
      </Card>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  contextCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "#FBFFFC"
  },
  contextIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    flex: 1
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  promptChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CFEFD8",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  promptText: {
    color: palette.green,
    fontSize: 11,
    fontWeight: "900"
  },
  chatWindow: {
    maxHeight: 390,
    minHeight: 300
  },
  bubble: {
    maxWidth: "88%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10
  },
  aiBubble: {
    backgroundColor: "#F5F8F5",
    alignSelf: "flex-start"
  },
  userBubble: {
    backgroundColor: palette.green,
    alignSelf: "flex-end"
  },
  bubbleText: {
    color: palette.dark,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700"
  },
  userBubbleText: {
    color: "#FFFFFF"
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 12
  },
  input: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    color: palette.dark,
    fontWeight: "800",
    outlineStyle: "none"
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.green,
    alignItems: "center",
    justifyContent: "center"
  }
});
