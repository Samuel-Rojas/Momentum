import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { pressAnimation } from '../utils/animations';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const { height } = useWindowDimensions();
  const minHeight = Math.max(height, 640);

  const handlePressIn = (scale: number) => {
    'worklet';
    return pressAnimation(scale);
  };

  const handlePressOut = () => {
    'worklet';
    return pressAnimation(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { minHeight }]}>
        <Animated.View 
          entering={FadeInDown.delay(200).duration(700)}
          style={styles.header}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={64}
            color="#007AFF"
          />
          <Animated.Text 
            entering={FadeIn.delay(500).duration(700)}
            style={styles.title}
          >
            Welcome to Momentum
          </Animated.Text>
          <Animated.Text 
            entering={FadeIn.delay(700).duration(700)}
            style={styles.subtitle}
          >
            Your smart task manager that helps you stay focused and productive
          </Animated.Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(900).duration(700)}
          style={styles.features}
        >
          <AnimatedTouchableOpacity 
            style={styles.feature}
            entering={FadeInUp.delay(1100).duration(700)}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#34c759' }]}>
              <MaterialCommunityIcons name="brain" size={24} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Organization</Text>
              <Text style={styles.featureDescription}>
                Tasks are automatically organized based on priority, energy levels,
                and deadlines
              </Text>
            </View>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity 
            style={styles.feature}
            entering={FadeInUp.delay(1300).duration(700)}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#ff9500' }]}>
              <MaterialCommunityIcons name="battery-high" size={24} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Energy Management</Text>
              <Text style={styles.featureDescription}>
                Match tasks with your energy levels for maximum productivity
              </Text>
            </View>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity 
            style={styles.feature}
            entering={FadeInUp.delay(1500).duration(700)}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#ff3b30' }]}>
              <MaterialCommunityIcons name="chart-line" size={24} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Progress Tracking</Text>
              <Text style={styles.featureDescription}>
                Monitor your productivity and task completion patterns
              </Text>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>

        <AnimatedTouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MainApp')}
          entering={FadeInUp.delay(1700).duration(700)}
          onPressIn={() => handlePressIn(0.95)}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </AnimatedTouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.select({ ios: 20, android: 40, default: 48 }),
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1c1e',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  features: {
    gap: 16,
    marginTop: Platform.select({ ios: 32, android: 24, default: 48 }),
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: Platform.select({ ios: 24, android: 16, default: 32 }),
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 122, 255, 0.2)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
}); 