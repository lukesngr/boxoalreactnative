import { faArrowLeft, faCalendar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import Button from "../timeboxes/Button";
import { queryClient } from "../../App";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate } from "../../modules/coreLogic";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({
    overallModal: {
        backgroundColor: 'white',
        padding: 10,
        width: '80%',
        height: 'auto',
    },
    title: {
        color: 'black',
        fontSize: 28,
        padding: 0,
        margin: 0,
    },
    label: {
        color: 'black',
        fontSize: 20,
    },
    textInput: {
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        padding: 1,
        fontSize: 20,
    },
    buttonOutlineStyle: {
        backgroundColor: '#7FFFD4',
        padding: 5,
        marginTop: 10,
    },
    buttonTextStyle: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    titleBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 'auto',
        margin: 0,
        padding: 0,
    },
    pickerItem: {
        color: 'black',
        fontSize: 20,
    },
    pickerBorder: {
        borderWidth: 1,
        borderColor: 'black',
    },
    picker: {
        padding: 1,
        fontSize: 20,
        color: 'black',
        marginBottom: 0
    },
});



export default function CreateScheduleForm(props) {
    const [name, setName] = useState("");
    const [boxSizeNumber, setBoxSizeNumber] = useState("30");
    const [boxSizeUnit, setBoxSizeUnit] = useState("min");
    let wakeupDateTime = new Date();
    wakeupDateTime.setHours(7);
    wakeupDateTime.setMinutes(0);
    const [wakeupTime, setWakeupTime] = useState(wakeupDateTime);
    const [wakeupTimeModalVisible, setWakeupTimeModalVisible] = useState(false);
    const username = useSelector(state => state.username);

    function createSchedule() {
        axios.post(serverIP+'/createSchedule', {
            name,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            wakeupTime,
            userEmail: username, 
        },
        {headers: { 'Origin': 'http://localhost:3000' }}
        ).then(async () => {
            Alert.alert("Created schedule!");
            await queryClient.refetchQueries();
        }).catch(function(error) {
            Alert.alert("Error occurred please try again or contact developer");
            console.log(error); 
        })
    }

    return (
    <>
        <View style={styles.overallModal}>
                <View style={styles.titleBarContainer}>  
                    <Text style={styles.title}>Create Schedule</Text>
                    <Pressable onPress={props.close}>
                        <FontAwesomeIcon icon={faXmark} size={25}/>
                    </Pressable>
                </View>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.textInput} onChangeText={setName} value={name}></TextInput>
                <Text style={styles.label}>Timebox Duration</Text>
                <TextInput style={styles.textInput} keyboardType="numeric" onChangeText={setBoxSizeNumber} value={boxSizeNumber}></TextInput>
                <Text style={styles.label}>Timebox Unit</Text>
                <View style={styles.pickerBorder}>
                    <Picker style={styles.picker} itemStyle={styles.pickerItem} selectedValue={boxSizeUnit} onValueChange={setBoxSizeUnit}>
                        <Picker.Item label="Min" value="min" />
                        <Picker.Item label="Hour" value="hr" />
                    </Picker>
                </View>
                <Text style={styles.label}>Wakeup Time </Text>
                <Pressable onPress={() => setWakeupTimeModalVisible(true)}>
                        <FontAwesomeIcon icon={faCalendar} size={20}/>
                </Pressable>
                <Button textStyle={styles.buttonTextStyle} outlineStyle={styles.buttonOutlineStyle} title="Create" onPress={createSchedule} />
        </View>
        <DatePicker 
            modal 
            mode="time" 
            date={wakeupTime} 
            onDateChange={(date) => setWakeupTime(date)} open={wakeupTimeModalVisible} 
            onConfirm={(date) => { setWakeupTime(date); setWakeupTimeModalVisible(false); }} 
            onCancel={() => setWakeupTimeModalVisible(false)}>
        </DatePicker>
    </>)
}