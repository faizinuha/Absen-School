import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

interface OnboardingStepProps {
  title: string;
  description: string;
  image: any; // Replace with actual image types later
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({ title, description, image }) => {
  return (
    <View style={styles.slide}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const OnboardingScreen: React.FC = () => {
  const [swiperIndex, setSwiperIndex] = useState(0);

  const onboardingData: OnboardingStepProps[] = [
    {
      title: 'Simplify Attendance',
      description: 'Effortlessly track student attendance with a few taps. Say goodbye to manual registers!',
      image: require('../../assets/absen.jpg'), // Replace with your image paths
    },
  ];

  const handleGetStarted = () => {
    // TODO: Navigate to the next screen (e.g., Login or Home)
    console.log('Get Started pressed');
  };

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        loop={false}
        showsButtons={false}
        onIndexChanged={(index) => setSwiperIndex(index)}
        activeDotColor="#007AFF" // Customize active dot color
      >
        {onboardingData.map((step, index) => (
          <OnboardingStep key={index} {...step} />
        ))}
      </Swiper>

      <View style={styles.buttonContainer}>
        {swiperIndex < onboardingData.length - 1 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // swiperRef.current.scrollBy(1); // If using ref
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333333', // Dark gray for text
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666', // Medium gray for description
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF', // Example primary blue color
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;