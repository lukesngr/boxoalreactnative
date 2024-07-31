import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {convertToDateTime, addBoxesToTime, calculateMaxNumberOfBoxes, convertToDayjs} from '../../modules/coreLogic';
import { Alert, TextInput, View, Text, Pressable } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Button from './Button';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { queryClient } from '../../App';
import serverIP from '../../modules/serverIP';
import { styles } from '../../styles/styles';
import { dayToName } from '../../modules/dateLogic';
import { listOfColors } from '../../styles/styles';

export default function CreateTimeboxForm(props) {
    
    const {id, wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const {timeboxes, goals} = useSelector(state => state.scheduleData.value);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [numberOfBoxes, setNumberOfBoxes] = useState('1');
    const [goalSelected, setGoalSelected] = useState(goals.length == 0 ? 1 : goals[0].id);
    
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [reoccurFrequency, setReoccurFrequency] = useState("no");
    const [weeklyDay, setWeeklyDay] = useState(0);
    const [percentageOfGoal, setPercentageOfGoal] = useState(100);
    
    const [alert, setAlert] = useState({shown: false, title: "", message: ""});
    
    let {time, date} = props;


    let maxNumberOfBoxes = calculateMaxNumberOfBoxes(wakeupTime, boxSizeUnit, boxSizeNumber, timeboxes, time, date);
    
    function handleSubmit() {
        let startTime = convertToDayjs(time, date).toDate();
        let endTime = convertToDayjs(addBoxesToTime(boxSizeUnit, boxSizeNumber, time, numberOfBoxes), date).toDate(); //add boxes to start time to get end time
        let color = listOfColors[Math.floor(Math.random() * listOfColors.length)]; //randomly pick a box color     
        let data = {
            title, 
            description, 
            startTime, 
            endTime, 
            numberOfBoxes: parseInt(numberOfBoxes), 
            color, 
            schedule: {connect: {id}}, 
            goal: {connect: {id: parseInt(goalSelected)}}
        }

        if(reoccurFrequency == "weekly") {
            data["reoccuring"] = {create: {reoccurFrequency: "weekly", weeklyDay: weeklyDay}};
        }else if(reoccurFrequency == "daily") {
            data["reoccuring"] = {create: {reoccurFrequency: "daily"}};
        }
        
        axios.post(serverIP+'/createTimebox', data).then(async () => {
            props.close();
            setAlert({shown: true, title: "Timebox", message: "Added timebox!"});
            await queryClient.refetchQueries();
        }).catch(function(error) {
            props.close();
            setAlert({shown: true, title: "Error", message: "An error occurred, please try again or contact the developer"});
            console.log(error); 
        })

    }

    function sanitizedSetNumberOfBoxes(number) {
        if(number > maxNumberOfBoxes) {
            setNumberOfBoxes(1);
        }else {
            setNumberOfBoxes(number);
        }
    }

    return (
    <Portal>
        <Dialog style={{backgroundColor: '#C5C27C'}} visible={props.visible} onDismiss={props.close}>
            <Dialog.Title style={{color: 'white'}}>Create Schedule</Dialog.Title>
            <Dialog.Content>
                <TextInput label="Title" value={title} onChangeText={setTitle} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Description" value={description} onChangeText={setDescription} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Number of Boxes" value={numberOfBoxes} onChangeText={setNumberOfBoxes} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                <TextInput label="Goal" value={goalSelected} style={{backgroundColor: 'white', marginTop: 10}} selectionColor="black" textColor="black"
                    render={(props) => (
                        <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={goalSelected} onValueChange={setGoalSelected}>
                            {goals.map((goal, index) => {
                                return <Picker.Item key={index} label={goal.title} value={String(goal.id)} />
                            })}
                        </Picker>
                    )}
                ></TextInput>
                {moreOptionsVisible && <>
                    <TextInput label="Reoccurring"  value={reoccurFrequency} style={{backgroundColor: 'white', marginBottom: 2 }} selectionColor="black" textColor="black"
                        render={(props) => (
                            <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={reoccurFrequency} onValueChange={setReoccurFrequency}>
                                <Picker.Item label="No" value="no" />
                                <Picker.Item label="Daily" value="daily" />
                                <Picker.Item label="Weekly" value="weekly" />
                            </Picker>
                        )}
                    />
                    {reoccurFrequency == 'weekly' && <TextInput label="Reoccurring Day"  value={weeklyDay} style={{backgroundColor: 'white', marginBottom: 2 }} selectionColor="black" textColor="black"
                        render={(props) => (
                            <Picker style={{color: 'black', marginTop: 5}} dropdownIconColor='black' selectedValue={weeklyDay} onValueChange={setWeeklyDay}>
                                {dayToName.map((day, index) => {
                                    return <Picker.Item key={index} label={day} value={index} />
                                })}
                            </Picker>
                        )}
                    />}
                    <TextInput label="Percentage of Goal" value={percentageOfGoal} onChangeText={setPercentageOfGoal} style={{backgroundColor: 'white', marginBottom: 2}} selectionColor="black" textColor="black"/>
                </>}
            </Dialog.Content>
            <Dialog.Actions>
                <Button textColor="white" onPress={props.close}>Close</Button>
                {!moreOptionsVisible && <Button textColor="black" buttonColor="white" onPress={() => setMoreOptionsVisible(true)}>More Options</Button>}
                {moreOptionsVisible && <Button textColor="black" buttonColor="white" onPress={() => setMoreOptionsVisible(false)}>Less Options</Button>}
                <Button textColor="black"  buttonColor="white" mode="contained" onPress={handleSubmit}>Create</Button>
            </Dialog.Actions>
        </Dialog>
        {alert.shown && <Alert visible={alert.shown} close={() => setAlert({...alert, shown: false})} title={alert.title} message={alert.message}/> }
    </Portal>
    );
}