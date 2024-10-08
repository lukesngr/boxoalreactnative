import { useSelector } from "react-redux";
import { View } from "react-native";

export default function ActiveOverlay() {
    const overlayDimensions = useSelector(state => state.overlayDimensions.value);
    const activeOverlayHeight = useSelector(state => state.activeOverlayHeight.value);

    return <View style={{width: overlayDimensions.headerWidth, height: activeOverlayHeight, backgroundColor: '#D9D9D9', opacity: 1, 
    zIndex: 999, top: 0, position: 'absolute', transform: [{translateY: overlayDimensions.headerHeight}]}}></View>
}