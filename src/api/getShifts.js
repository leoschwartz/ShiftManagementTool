//https://fullcalendar.io/docs/events-function for info on fetchInfo object - might get removed from here in favor of handling it in common
//eslint-disable-next-line no-unused-vars
export const getShifts = async (userToken, scheduleUser, fetchInfo)  => {
    return [
        {
            id: 0,
            name: 'Test 14 11-14',
            startTime: new Date('2024-02-14T11:30:00'),
            endTime: new Date('2024-02-14T14:30:00'),
            assigner: 'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
            description: 'Your route should be provided to you. Receive change from each cashier as according to your amounts record.',
            completed: true},
        {id: 1,
            name: 'Test 15 8-11',
            startTime: new Date('2024-02-15T08:10:00'),
            endTime: new Date('2024-02-15T11:00:00'),
            assigner: 'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
            description: 'Your route should be provided to you. Follow your route.',
            completed: false},
        {id: 2,
            name: 'Test 08 8-11',
            startTime: new Date('2024-02-08T08:10:00'),
            endTime: new Date('2024-02-08T11:00:00'),
            assigner: 'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
            description: 'Your route should be provided to you. Follow your route.',
            completed: false}
    ];
}