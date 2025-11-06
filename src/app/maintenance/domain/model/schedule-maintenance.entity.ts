export class ScheduledMaintenance {
  maintenanceId: number;
  maintenanceDate: Date;
  maintenanceAddress: string;
  mechanicName: string;
  vehicleName: string;
  maintenanceReason: string;

  constructor(
    maintenanceId: number,
    maintenanceDate: Date,
    maintenanceAddress: string,
    mechanicName: string,
    vehicleName: string,
    maintenanceReason: string,
  ) {
    this.maintenanceId = maintenanceId;
    this.maintenanceDate = maintenanceDate;
    this.maintenanceAddress = maintenanceAddress;
    this.mechanicName = mechanicName;
    this.vehicleName = vehicleName;
    this.maintenanceReason = maintenanceReason;
  }



}
