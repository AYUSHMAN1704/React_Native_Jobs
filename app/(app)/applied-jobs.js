import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, SIZES, icons } from '../../constants';
import { ScreenHeaderBtn } from '../../components';
import { useAuth, API_URL } from '../../context/AuthContext';

export default function AppliedJobs() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppliedJobs = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/applied-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data.appliedJobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAppliedJobs();
    }, [])
  );

  const handleRemove = async (jobId) => {
    Alert.alert(
      'Remove Application',
      'Are you sure you want to remove this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              const response = await fetch(`${API_URL}/applied-jobs/${jobId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (response.ok) {
                setJobs((prev) => prev.filter((j) => j.job_id !== jobId));
              }
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/job-details/${item.job_id}`)}
    >
      <View style={styles.cardRow}>
        <Image
          source={{
            uri: item.employer_logo || 'https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg',
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {item.job_title || 'Untitled Position'}
          </Text>
          <Text style={styles.employer} numberOfLines={1}>
            {item.employer_name || 'Unknown Company'}
          </Text>
          <Text style={styles.location}>
            {item.job_country || 'Remote'}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.appliedDate}>
          Applied {new Date(item.applied_at).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(item.job_id)}
        >
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: 'Applied Jobs',
          headerTitleStyle: {
            fontFamily: FONT.bold,
            fontSize: SIZES.large,
          },
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No Applications Yet</Text>
          <Text style={styles.emptySubtitle}>
            Jobs you apply for will show up here
          </Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJobCard}
          contentContainerStyle={{ padding: SIZES.medium }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SIZES.medium,
  },
  emptyTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  emptySubtitle: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: SIZES.small,
    backgroundColor: COLORS.lightWhite,
  },
  cardInfo: {
    flex: 1,
    marginLeft: SIZES.medium,
  },
  jobTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  employer: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small + 2,
    color: COLORS.gray,
    marginTop: 2,
  },
  location: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray2,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.small,
    paddingTop: SIZES.small,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  appliedDate: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  removeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFF0ED',
  },
  removeBtnText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.small,
    color: '#F37453',
  },
});
