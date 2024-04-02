import { Text } from 'react-native';
import TimeboxHeading from '../components/timeboxes/TimeboxHeading';
import Loading from '../components/Loading';
import serverIP from '../modules/serverIP';
import TimeboxGrid from '../components/timeboxes/TimeboxGrid';
import { useContext, useEffect } from 'react';
import { ScheduleContext } from '../components/ScheduleContext';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export const SessionContext = createContext();

export default function Timeboxes() {
  const username = useSelector(state => state.username.value);
  const {selectedDate, setSelectedDate, ...leftovers} = useContext(ScheduleContext);
  let startOfWeek = dayjs(selectedDate).startOf('week').hour(0).minute(0).toDate();
  let endOfWeek = dayjs(selectedDate).endOf('week').add(1, 'day').hour(23).minute(59).toDate(); //another day as sometimes timeboxes will go into next week

  
  if(username !== '') {
    const {status, data, error, refetch} = useQuery({
      queryKey: ["schedules", selectedDate], 
      queryFn: async () => {
          const response = await axios.get(serverIP+"/api/getSchedules", { userEmail: props.session.user.email, startOfWeek, endOfWeek });
      
          return response;},
      enabled: true})

      if(status === 'loading') return <Loading />

      return (
        <>
          <TimeboxHeading />
          <TimeboxGrid data={data}></TimeboxGrid>
        </>
        )
  }

  return <Loading />     
  
}