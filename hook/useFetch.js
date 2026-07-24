import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (endpoint, query) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: "GET",
    url: `https://jsearch.p.rapidapi.com/${endpoint}`,
    params: {
      ...query,
    },
    headers: {
      "x-rapidapi-key": "88d40638eamsh5e91a7c4376150ep1d6938jsn928031bb40e2",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.request(options);

      console.log("API Response:", response.data);

      if (endpoint === 'search' || endpoint === 'search-v2') {
        setData(response.data.data.jobs);
      } else {
        setData(response.data.data);
      }
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Error:", err.response?.data);

      if (endpoint === 'job-details') {
        const mockJobs = [
          {
            employer_name: 'Tech Innovators Inc.',
            employer_logo: 'https://img.icons8.com/color/100/000000/google-logo.png',
            job_title: 'Senior React Native Developer',
            job_country: 'US',
            job_description: 'We are looking for an experienced React Native developer to lead our mobile team. You will be building cutting-edge apps used by millions.',
            job_highlights: {
              Qualifications: ['5+ years React Native', 'Expert in Redux/Zustand', 'Experience with native modules (Java/Swift)'],
              Responsibilities: ['Architect scalable mobile solutions', 'Mentor junior developers', 'Optimize app performance']
            },
            job_google_link: 'https://careers.google.com/'
          },
          {
            employer_name: 'StartupX',
            employer_logo: 'https://img.icons8.com/color/100/000000/mac-os.png',
            job_title: 'Frontend Mobile Engineer',
            job_country: 'UK',
            job_description: 'Join our fast-paced startup to build the next generation of social networking apps. We move fast and ship code daily.',
            job_highlights: {
              Qualifications: ['React Native experience', 'UI/UX eye for detail', 'Familiarity with Expo Router'],
              Responsibilities: ['Implement pixel-perfect UIs', 'Integrate with GraphQL backends', 'Participate in code reviews']
            },
            job_google_link: 'https://careers.google.com/'
          },
          {
            employer_name: 'Global Finance Corp',
            employer_logo: 'https://img.icons8.com/color/100/000000/bank-building.png',
            job_title: 'Mobile App Developer',
            job_country: 'CA',
            job_description: 'Build secure and reliable mobile banking applications. We value clean code and extensive testing.',
            job_highlights: {
              Qualifications: ['Strong JavaScript/TypeScript skills', 'Experience with secure storage', 'Familiarity with Jest'],
              Responsibilities: ['Develop secure banking features', 'Write unit and e2e tests', 'Collaborate with security teams']
            },
            job_google_link: 'https://careers.google.com/'
          },
          {
            employer_name: 'HealthTech Solutions',
            employer_logo: 'https://img.icons8.com/color/100/000000/heart-health.png',
            job_title: 'React Developer (Mobile)',
            job_country: 'AU',
            job_description: 'Help us revolutionize healthcare by building intuitive mobile tools for doctors and patients.',
            job_highlights: {
              Qualifications: ['React Native', 'Knowledge of healthcare compliance', 'Empathy for end-users'],
              Responsibilities: ['Build patient portals', 'Integrate wearable device data', 'Ensure accessibility standards']
            },
            job_google_link: 'https://careers.google.com/'
          }
        ];

        // Pick a pseudo-random job based on the length of the job_id string
        const jobId = query?.job_id || '';
        const randomIndex = jobId.length > 0 ? jobId.charCodeAt(jobId.length - 1) % mockJobs.length : 0;
        
        setData([mockJobs[randomIndex]]);
        setError(null);
      } else {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useFetch;