import { Text, View } from "react-native";

export default function NormalTimebox(props) {
    const onDayView = useSelector(state => state.onDayView.value);
    let timeboxHeight = 31;
    if(onDayView) {
        timeboxHeight = 60;
    }
    let height = timeboxHeight*props.data.numberOfBoxes;

    return (
    <>
        <View style={{position: 'relative', height: height, backgroundColor: props.data.color, width: '100%'}}>
            <Text style={{color: 'black'}}>{props.data.title}</Text>
        </View>
    </>
    )
}