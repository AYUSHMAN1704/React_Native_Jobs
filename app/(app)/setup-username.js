import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONT } from '../../constants';
import { useAuth, API_URL } from '../../context/AuthContext';

export default function SetupUsername() {
  const { session, updateSession, getToken } = useAuth();
  const router = useRouter();

  // Suggest a username from email (part before @)
  const suggestedUsername = session?.email
    ? session.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
    : '';

  const [username, setUsername] = useState(suggestedUsername);
  const [loading, setLoading] = useState(false);

  async function handleSetUsername() {
    if (!username || username.trim().length < 2) {
      Alert.alert('Invalid Username', 'Username must be at least 2 characters.');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        updateSession(data.user);
        router.replace('/home');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View style={styles.container}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          Choose a username to get started
        </Text>

        <View style={styles.suggestionContainer}>
          <Text style={styles.suggestionLabel}>Suggested for you:</Text>
          <TouchableOpacity onPress={() => setUsername(suggestedUsername)}>
            <Text style={styles.suggestionText}>@{suggestedUsername}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.input}
            placeholder="your_username"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          disabled={loading}
          onPress={handleSetUsername}
        >
          <Text style={styles.btnText}>
            {loading ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.large,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: SIZES.small,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xxLarge,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
    gap: 8,
  },
  suggestionLabel: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small + 2,
    color: COLORS.gray,
  },
  suggestionText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.small + 2,
    color: COLORS.tertiary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
  },
  atSymbol: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
  },
  btn: {
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontFamily: FONT.bold,
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});
