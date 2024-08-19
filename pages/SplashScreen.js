import { StyleSheet, Text, View } from 'react-native';
import { Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import SignInButton from '../components/SignInButton';
import { getCurrentUser } from 'aws-amplify/auth';
import { styles } from '../styles/styles';

function stepFunction(steps, t) {
    let stepSize = 1 / 20.0;
    return Math.floor(t / stepSize)*stepSize;
}



const firstStepFunction = (t) => stepFunction(20.0, t);
const secondStepFunction = (t) => stepFunction(14.0, t);
const thirdStepFunction = (t) => stepFunction(16.0, t);

export default function SplashScreen({navigation}) {

  async function checkIfSignedIn() {
    try {
      const { userId } = await getCurrentUser();
      navigation.navigate('FinalView');
    } catch (error) {
      console.log(error);
    }
  }

  const firstLineDisplayed = useRef(new Animated.Value(0)).current;
  const secondLineDisplayed = useRef(new Animated.Value(0)).current;
  const thirdLineDisplayed = useRef(new Animated.Value(0)).current;

  const blinkingCaretOne = useRef(new Animated.Value(0)).current;
  const blinkingCaretTwo = useRef(new Animated.Value(0)).current;
  const blinkingCaretThree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    checkIfSignedIn();
    Animated.sequence([
      Animated.timing(firstLineDisplayed, {
        toValue: 100,
        useNativeDriver: false,
        duration: 2000,
        easing: firstStepFunction
      }),
      Animated.timing(secondLineDisplayed, {
        toValue: 100,
        useNativeDriver: false,
        duration: 2000,
        easing: secondStepFunction
      }),
      Animated.timing(thirdLineDisplayed, {
        toValue: 100,
        useNativeDriver: false,
        duration: 2000,
        easing: thirdStepFunction
      })
    ]).start();

    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingCaretOne, {
            toValue: 1,
            useNativeDriver: false,
            duration: 500,
            easing: Easing.linear
          }),
          Animated.timing(blinkingCaretOne, {
            toValue: 0,
            useNativeDriver: false,
            duration: 0
          })
        ]),
        { iterations: 4 }
      ), 
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingCaretTwo, {
            toValue: 1,
            useNativeDriver: false,
            duration: 500,
            easing: Easing.linear
          }),
          Animated.timing(blinkingCaretTwo, {
            toValue: 0,
            useNativeDriver: false,
            duration: 0
          })
        ]),
        { iterations: 4 }
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingCaretThree, {
            toValue: 1,
            useNativeDriver: false,
            duration: 500,
            easing: Easing.linear
          }),
          Animated.timing(blinkingCaretThree, {
            toValue: 0,
            useNativeDriver: false,
            duration: 0
          })
        ]),
        { iterations: 4 }
      )
    ]).start();
  });

  return (
  <View style={styles.splashScreenContainer}>
    <Animated.View style={[styles.splashTextContainer, {width: firstLineDisplayed.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
    borderRightColor: blinkingCaretOne.interpolate({inputRange: [0, 0.5, 0.6, 1], outputRange: ['transparent', 'transparent', '#7FFFD4', '#7FFFD4']})}]}>
      <Text numberOfLines={1} style={styles.splashText}>Timeboxing</Text>
    </Animated.View>
    <Animated.View style={[styles.splashTextContainer, {width: secondLineDisplayed.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
    borderRightColor: blinkingCaretTwo.interpolate({inputRange: [0, 0.5, 0.6, 1], outputRange: ['transparent', 'transparent', '#7FFFD4', '#7FFFD4']})}]}>
      <Text  numberOfLines={1} style={styles.splashText}>For The</Text>
    </Animated.View>
    <Animated.View style={[styles.splashTextContainer, {width: thirdLineDisplayed.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
    borderRightColor: blinkingCaretThree.interpolate({inputRange: [0, 0.5, 0.6, 1], outputRange: ['transparent', 'transparent', '#7FFFD4', '#7FFFD4']})}]}>
      <Text numberOfLines={1} style={styles.splashText}>Everyman</Text>
    </Animated.View>
    <SignInButton signIn={() => navigation.navigate('Login')}></SignInButton>
  </View>
  );
}