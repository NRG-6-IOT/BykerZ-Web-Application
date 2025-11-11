export class NotificationEntity {
  constructor(
    public id: number,
    public vehicleId: number,
    public title: string,
    public message: string,
    public type: string = 'GENERAL',
    public severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM',
    public createdAt: string = new Date().toISOString(),
    public read: boolean = false
  ) {}
}
