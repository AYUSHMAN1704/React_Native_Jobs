import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';
import { COLORS, SIZES, FONT } from '../../constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
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
