import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../utils/supabase';
import { COLORS, SIZES, FONT } from '../../constants';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (!data.session) {
      Alert.alert('Success', 'Account created! You can now log in.');
      router.back();
    }
    
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

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
          onPress={signUpWithEmail}
        >
          <Text style={styles.btnText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
