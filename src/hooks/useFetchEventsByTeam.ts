import { useCallback } from "react"
import { useGetEventsQuery } from "../redux/api/apiSlice"

export const useFetchAllEventsNumberByTeamIds = (teamIds: number[]) => {
    const getEventsByTeam = useCallback(() => {
        console.log(teamIds)
        const uniqueEvents = new Set<number>();
        for(const teamId of teamIds){
            const {data: events} = useGetEventsQuery(teamId);
            events?.map((event: any)=> {
                uniqueEvents.add(event.eventId);
            })
        }
        return uniqueEvents.size;
    }, [])

    return {getEventsByTeam};
}