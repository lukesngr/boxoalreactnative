import {Alert, Pressable, Text, TextInput, View} from 'react-native';
import {styles} from '../../styles/styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import Button from '../timeboxes/Button';

export function ResetPassword({navigation}) {
    const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [enteredCode, setEnteredCode] = useState(false);
    const [email, setEmail] = useState("");

    function sendCodeToEmail() {
        Alert.alert("Code Sent", "Check your email for the code");
        
    }

    function verifyCode() {
        setEnteredCode(true);
    }

    function resetPassword() {}

    return (
        <>
            <Text style={styles.signInTitle}>Reset Password</Text>
            {enteredCode ? ( <>
                <Text style={styles.signInLabel}>Password</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput secureTextEntry={passwordHidden} style={styles.signInTextInput} onChangeText={setPassword} value={password}></TextInput>
                    <Pressable onPress={() => setPasswordHidden(!passwordHidden)}>
                        <FontAwesomeIcon style={{ transform: [{translateX: -35}]}} icon={passwordHidden ? faEye : faEyeSlash} size={30} ></FontAwesomeIcon>
                    </Pressable>
                </View>
                <Text style={styles.signInLabel}>Confirm Password</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput secureTextEntry={confirmPasswordHidden} style={styles.signInTextInput} onChangeText={setConfirmPassword} value={confirmPassword}></TextInput>
                    <Pressable onPress={() => setConfirmPassword(!confirmPasswordHidden)}>
                        <FontAwesomeIcon style={{ transform: [{translateX: -35}]}} icon={confirmPasswordHidden ? faEye : faEyeSlash} size={30} ></FontAwesomeIcon>
                    </Pressable>
                </View>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Reset Password" onPress={resetPassword} />
            </>) : (<>
                <Text style={styles.signInLabel}>Email</Text>
                <TextInput style={styles.signInTextInput} onChangeText={setEmail} value={email}></TextInput>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Send Code to Email" onPress={sendCodeToEmail} />
                <Text style={styles.signInLabel}>Code </Text>
                <TextInput style={styles.signInTextInput} onChangeText={setCode} value={code}></TextInput>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.signInButtonOutlineStyle} title="Verify Code" onPress={verifyCode} />
            </>)
            }
        </>
    )
}