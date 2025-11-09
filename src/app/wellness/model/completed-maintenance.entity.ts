import {Expense} from '@app/shared/domain/model/expense.entity';

export class CompletedMaintenance {
  maintenanceId: number;
  maintenanceDate: Date;
  maintenanceAddress: string;
  mechanicName: string;
  ownerName: string;
  vehicleName: string;
  maintenanceDetails: string;
  maintenanceDescription: string;
  expenses : Expense[];

  constructor(
    maintenanceId: number,
    maintenanceDate: Date,
    maintenanceAddress: string,
    mechanicName: string,
    ownerName: string,
    vehicleName: string,
    maintenanceDetails: string,
    maintenanceDescription: string,
    expenses: Expense[]
  ) {
    this.maintenanceId = maintenanceId;
    this.maintenanceDate = maintenanceDate;
    this.maintenanceAddress = maintenanceAddress;
    this.mechanicName = mechanicName;
    this.ownerName = ownerName;
    this.vehicleName = vehicleName;
    this.maintenanceDetails = maintenanceDetails;
    this.maintenanceDescription = maintenanceDescription;
    this.expenses = expenses;
  }

}
