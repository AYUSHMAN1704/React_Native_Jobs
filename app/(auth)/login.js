import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONT } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://10.0.2.2:3000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  async function signInWithEmail() {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        await signIn(data.user, data.token);
      } else {
        if (data.error === 'Invalid login credentials') {
          Alert.alert(
            'User Not Found',
            'It looks like you are a new user. Please sign up to create an account!',
            [
              { 
                text: 'Go to Sign Up', 
                onPress: () => router.push({ pathname: '/register', params: { email, password } }) 
              }
            ]
          );
        } else {
          Alert.alert('Error', data.error);
        }
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to find your perfect job</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize={'none'}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            autoCapitalize={'none'}
          />
        </View>

        <TouchableOpacity 
          style={styles.btn} 
          disabled={loading} 
          onPress={signInWithEmail}
        >
          <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
  title: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.xxLarge,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.medium,
    height: 50,
    justifyContent: 'center',
  },
  input: {
    fontFamily: FONT.regular,
    paddingHorizontal: SIZES.medium,
  },
  btn: {
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  btnText: {
    fontFamily: FONT.bold,
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  linkContainer: {
    marginTop: SIZES.large,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: FONT.regular,
    color: COLORS.primary,
  }
});
