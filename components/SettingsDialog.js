import { Dialog, Text, Button, Portal, SegmentedButtons, TextInput } from "react-native-paper"
import { signOut } from "aws-amplify/auth"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Picker } from "@react-native-picker/picker";

export default function SettingsDialog(props) {
    const {viewType, selectedSchedule} = useSelector(state => state.settings.value);
    const [view, setView] = useState(viewType);
    const [scheduleIndex, setScheduleIndex] = useState(selectedSchedule);
    const dispatch = useDispatch();
    const {data} = props;

    useEffect(() => {
        dispatch({type: 'settings/set', payload: {viewType: view, selectedSchedule: selectedSchedule}});
    }, [view, scheduleIndex]);
    
    async function logOut() {
        await signOut();
        props.hideDialog();
        props.navigation.navigate('Login');
    }

    return (
        <Portal>
          <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.hideDialog}>
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons value={view} onValueChange={setView} buttons={[
                    {value: 'day', label: 'Day', style: view != 'day' ? {backgroundColor: 'white'} : {}}, 
                    {value: 'week', label: 'Week', style: view != 'week' ? {backgroundColor: 'white'} : {}}]}>
                </SegmentedButtons>
                <TextInput label="Schedule"  value={scheduleIndex} style={{backgroundColor: 'white', marginTop: 10}} selectionColor="black" textColor="black"
	                render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={scheduleIndex} onValueChange={setScheduleIndex}>
                            {data != undefined && data.map((schedule, index) => {
                                return <Picker.Item key={index} label={schedule.title} value={index} />
                            })}
                        </Picker>
	                )}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" buttonColor="#49454F" mode="contained" onPress={logOut}>Logout</Button>
                <Button textColor='white' onPress={props.hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    )
};