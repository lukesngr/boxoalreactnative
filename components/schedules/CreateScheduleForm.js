import { faArrowLeft, faCalendar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, View, Text, Pressable,  } from "react-native";
import axios from "axios";
import { useState } from "react";
import { Alert } from "react-native";
import serverIP from "../../modules/serverIP";
import { queryClient } from "../../App";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import { convertToTimeAndDate } from "../../modules/coreLogic";
import { styles } from "../../styles/styles";
import { getCurrentUser } from "aws-amplify/auth";
import { Dialog, Portal, TextInput, Button } from "react-native-paper";

export default function CreateScheduleForm(props) {
    const [title, setTitle] = useState("");
    const [boxSizeNumber, setBoxSizeNumber] = useState("30");
    const [boxSizeUnit, setBoxSizeUnit] = useState("min");
    let wakeupDateTime = new Date();
    wakeupDateTime.setHours(7);
    wakeupDateTime.setMinutes(0);
    const [wakeupTime, setWakeupTime] = useState(wakeupDateTime);
    const [wakeupTimeModalVisible, setWakeupTimeModalVisible] = useState(false);
    

    async function createSchedule() {
        const { userId } = await getCurrentUser();
        axios.post(serverIP+'/createSchedule', {
            title,
            boxSizeNumber: parseInt(boxSizeNumber),
            boxSizeUnit,
            wakeupTime: convertToTimeAndDate(wakeupTime)[0],
            userUUID: userId, 
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
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title>Create Schedule</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} style={{backgroundColor: 'white'}} selectionColor="black" textColor="black"/>
                <TextInput label="Timebox Duration" value={boxSizeNumber} onChangeText={setBoxSizeNumber} style={{backgroundColor: 'white'}} selectionColor="black" textColor="black"/>
                <TextInput label="Timebox Unit"  value={boxSizeUnit} style={{backgroundColor: 'white'}} selectionColor="black" textColor="black"
	                render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={boxSizeUnit} onValueChange={setBoxSizeUnit}>
                            <Picker.Item label="Min" value="min" />
                            <Picker.Item label="Hour" value="hr" />
                        </Picker>
	                )}
                />
                <Pressable onPress={() => setWakeupTimeModalVisible(true)}>
                    <TextInput 
                    label="Wakeup time" 
                    right={<TextInput.Icon onPress={() => setWakeupTimeModalVisible(true)} icon="clock-edit" />} 
                    editable={false} 
                    style={{backgroundColor: 'white'}} 
                    selectionColor="black" 
                    textColor="black"/>
                </Pressable>
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" buttonColor="#49454F" mode="contained" onPress={props.close}>Close</Button>
                <Button textColor='white' onPress={createSchedule}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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