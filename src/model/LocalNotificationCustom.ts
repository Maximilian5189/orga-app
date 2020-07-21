export default interface LocalNotificationCustom {
    title: string;
    id: number;
    body: string;
    schedule?: {
      repeats?: boolean;
      every?: 'day' | 'hour';
      at?: Date;
    }
    done: boolean;
    doneTimestamp?: Date;
  }