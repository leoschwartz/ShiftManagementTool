export class ShiftEvent {
    constructor(id, name, startTime, endTime, assigner, description, completed) {
        this.id = id;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.assigner = assigner;
        this.description = description;
        this.completed = completed;
    }
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    assigner: String;
    description: String;
    completed: boolean; 
}
export const tempEventStorage = [
    new ShiftEvent(0,
        'Inverse Cashier 1B 0-16',
        new Date('2024-01-24T09:30:00'),
        new Date('2024-01-24T12:30:00'),
        'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
        'Your route should be provided to you. Receive change from each cashier as according to your amounts record.',
        true),
    new ShiftEvent(1,
        'Inverse Cashier 1B 1-16',
        new Date('2024-01-25T08:10:00'),
        new Date('2024-01-25T11:00:00'),
        'A̷̶̸̴̴̶̶g̴̴̶̸̶̷̸b̷̴̸̷̴̶̵æ̷̵̷̶̵̷̷l̷̶̸̷̷̴̸ ̶̴̵̸̷̴̷B̶̴̵̴̴̴̴ð̵̸̸̴̴̷̵i̶̸̸̷̸̶̴a̸̶̷̶̴̴̶',
        'Your route should be provided to you. Follow your route.',
        false)
];
export function tempGetEvent(qId) {
    return tempEventStorage.find((x) => x.id == qId);
}
export function formatTime(t) {
    const hour = t.getHours(); //12h time is wack
    if (hour == 0 || hour == 24) {
      return '12:' + String(t.getMinutes()).padStart(2, '0') + 'am';
    } else if (hour < 13) {
      return hour + ':' + String(t.getMinutes()).padStart(2, '0') + 'am';
    } else if (hour == 13) {
      return '12:' + String(t.getMinutes()).padStart(2, '0') + 'pm';
    } else {
      return (hour - 12) + ':' + String(t.getMinutes()).padStart(2, '0') + 'pm';
    }
  }