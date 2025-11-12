

export class ExpenseItem {
  id: number;
  name: string
  amount: number;
  unitPrice: number
  totalPrice: number;
  itemType: string;

  constructor(
    id: number,
    name: string,
    amount: number,
    unitPrice: number,
    totalPrice: number,
    itemType: string
  ) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.unitPrice = unitPrice;
    this.totalPrice = totalPrice;
    this.itemType = itemType;
  }
}
