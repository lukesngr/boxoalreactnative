import { useSelector } from "react-redux";
import { View } from "react-native";

export default function Overlay() {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    
    return (<View style={{width: overlayDimensions.headerWidth, 
        height: overlayDimensions.overlayHeight, 
        backgroundColor: '#D9D9D9', opacity: 1, 
        zIndex: 998, elevation: 1, top: 0, position: 'absolute', transform: [{translateY: overlayDimensions.headerHeight}]}}></View>);
}