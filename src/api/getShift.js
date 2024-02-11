//TEMPORARY
//eslint-disable-next-line no-unused-vars
export const getShift = async (id)  => {
    return [
        {
            id: 0,
            name: 'Inverse Cashier 1B 0-16',
            startTime: new Date('2024-02-08T09:30:00'),
            endTime: new Date('2024-02-08T12:30:00'),
            assigner: 'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
            description: 'Your route should be provided to you. Receive change from each cashier as according to your amounts record.',
            completed: true},
        {id: 1,
            name: 'Inverse Cashier 1B 1-16',
            startTime: new Date('2024-02-07T08:10:00'),
            endTime: new Date('2024-02-07T11:00:00'),
            assigner: 'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
            description: 'Your route should be provided to you. Follow your route.',
            completed: false},
        {id: 2,
            name: 'Inverse Cashier 1B 0-08',
            startTime: new Date('2024-02-08T08:10:00'),
            endTime: new Date('2024-02-08T11:00:00'),
            assigner: 'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
            description: 'Your route should be provided to you. Follow your route.',
            completed: false}
    ].find(((element) => element.id == id));
}