import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import Schedules from './Schedules';
import Timeboxes from './Timeboxes';
import Areas from './Areas';
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { Text } from "react-native";
import serverIP from '../modules/serverIP';
import Welcome from '../components/Welcome';
import { initialNotificationSetup, recordIfNotificationPressed} from '../modules/coreLogic';
import { useEffect } from 'react';
import useCurrentUser from '../hooks/useCurrentUser';
import { MD3LightTheme } from 'react-native-paper';

let theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#C5C27C',
      secondary: '#C5C27C',
      background: '#FFFFFF',
      secondaryContainer: '#D4D28F',
      elevation: {...MD3LightTheme.colors.elevation, 'level2': '#FFFFFF'},
    },
  };

const Tab = createMaterialBottomTabNavigator();

export default function FinalView({ navigation, route }) {
    const dispatch = useDispatch();
    let userID = useCurrentUser();
    const selectedDate = useSelector(state => state.selectedDate.value);
    const {status, data, error, refetch} = useQuery({
        queryKey: ["schedule", selectedDate], 
        queryFn: async () => {
            const response = await axios.get(serverIP+"/getSchedules", { params: {
                userUUID: userID, 
                startOfWeek: dayjs(selectedDate).startOf('week').hour(0).minute(0).toDate(), 
                endOfWeek: dayjs(selectedDate).endOf('week').add(1, 'day').hour(23).minute(59).toDate()
            }});
            return response.data;
        },
        enabled: true
    })

    useEffect(() => {
        initialNotificationSetup().then();
    }, []);

    useEffect(() => {
        if(route.params != undefined) {
            recordIfNotificationPressed(dispatch, route.params);
        }
    }, [route.params]);

    if(status === 'pending') return <Loading />
    if(status === 'error') return <Text>Error: {error.message}</Text>
    if(data.length == 0) return <Welcome />
    
    return (
          <Tab.Navigator theme={theme}>
            <Tab.Screen name="Timeboxes" children={() => <Timeboxes navigation={navigation} data={data}></Timeboxes>} 
            options={{headerShown: false}}/>
            <Tab.Screen name="Schedules" children={() => <Schedules data={data}></Schedules>} 
            options={{headerShown: false}}/>
            <Tab.Screen name="Settings" component={Areas} 
            options={{headerShown: false}}/>
          </Tab.Navigator>
    )
}