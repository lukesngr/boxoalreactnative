import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { calculatePixelsFromTopOfGridBasedOnTime } from "../../modules/coreLogic";
import dayjs from "dayjs";

export default function RecordedTimeBoxOverlay(props) {
    const [recordedBoxes, setRecordedBoxes] = useState([]);
    const {wakeupTime, boxSizeUnit, boxSizeNumber} = useSelector(state => state.scheduleEssentials.value);
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const {recordedTimeboxes} = useSelector(state => state.scheduleData.value);
    let boxoalInfo = [wakeupTime, boxSizeUnit, boxSizeNumber, overlayDimensions];
    

    let data = recordedTimeboxes.filter(function(obj) {
        let recordedStartTime = dayjs(obj.recordedStartTime);
        return (recordedStartTime.month()+1) == props.day.month && (recordedStartTime.date()) == props.day.date;
    })

    useEffect(() => {
        setRecordedBoxes([]) //so deleted recordings don't get stuck
        if(data.length > 0) {
            let malleableBoxes = [...recordedBoxes];
            data.forEach(element => {
                let marginFromTop = calculatePixelsFromTopOfGridBasedOnTime(...boxoalInfo, dayjs(element.recordedStartTime));
                if(marginFromTop < overlayDimensions.headerHeight) {
                    marginFromTop = overlayDimensions.headerHeight;
                }
                let heightForBox = calculatePixelsFromTopOfGridBasedOnTime(...boxoalInfo, dayjs(element.recordedEndTime)) - marginFromTop;
                if(heightForBox < 30) {
                    heightForBox = 30;
                }else if(heightForBox > (overlayDimensions.overlayHeight-marginFromTop)) {
                    heightForBox = (overlayDimensions.overlayHeight-marginFromTop);
                }//reasonable value which alllows it is visible
                let notEitherZero = !(marginFromTop == 0 || heightForBox == 0); //due to overlay dimensions not being set at right time
                if(notEitherZero && !malleableBoxes.some(item => item.id === element.id)) {
                    malleableBoxes.push({timeBox: element.timeBox, id: element.id, heightForBox, marginFromTop, title: element.timeBox.title});
                }
            });
            setRecordedBoxes(malleableBoxes);
        }
    }, [recordedTimeboxes]);
    
    return <>{recordedBoxes.map((recordedBoxes, index) => (
        <View key={index} style={{width: overlayDimensions[0], 
            height: recordedBoxes.heightForBox, 
            transform: [{translateY: recordedBoxes.marginFromTop}, {translateX: overlayDimensions[0]*props.index}],
            backgroundColor: 'red',
            opacity: 0.7,
            zIndex: 999,
            position: 'absolute'}}>
            <Text>{recordedBoxes.title}</Text>
        </View>
    ))}</>
}