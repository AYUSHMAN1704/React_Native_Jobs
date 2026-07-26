import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";

import styles from "./footer.style";
import { icons } from "../../../constants";
import { useAuth, API_URL } from "../../../context/AuthContext";

const Footer = ({ url, jobData }) => {
  const { getToken } = useAuth();
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user already applied for this job on mount
  useEffect(() => {
    if (!jobData?.job_id) return;

    const checkApplied = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/applied-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const alreadyApplied = data.appliedJobs.some(
            (j) => j.job_id === jobData.job_id
          );
          setApplied(alreadyApplied);
        }
      } catch (e) {
        // silently fail — just don't show as applied
      }
    };
    checkApplied();
  }, [jobData?.job_id]);

  const handleApply = async () => {
    if (applied) {
      Alert.alert('Already Applied', 'You have already applied for this job.');
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/applied-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: jobData.job_id,
          job_title: jobData.job_title,
          employer_name: jobData.employer_name,
          employer_logo: jobData.employer_logo,
          job_country: jobData.job_country,
        }),
      });

      if (response.ok) {
        setApplied(true);
        Alert.alert('Success! 🎉', 'You have applied for this job.');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn}>
        <Image
          source={icons.heartOutline}
          resizeMode='contain'
          style={styles.likeBtnImage}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.applyBtn,
          applied && { backgroundColor: '#4CAF50' },
        ]}
        onPress={handleApply}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.applyBtnText}>
            {applied ? 'Applied ✓' : 'Apply for job'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
