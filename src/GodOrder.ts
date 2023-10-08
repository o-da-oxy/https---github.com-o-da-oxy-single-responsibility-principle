// ANTI-PATTERN: GOD OBJECT
import * as fs from 'fs';

export interface OrderData {
  id: string;
  date: Date;
  price: number;
}

class Order {
  constructor(
    private _id: string,
    private _date: Date,
    private _price: number,
  ) {}

  public get id(): string {
    return this._id;
  }

  public get date(): string {
    return this._date.toLocaleString();
  }

  public get price(): number {
    return this._price;
  }
}

// и реализует CRUD, и рендерит HTML
export class GodOrder {
  private orders: Order[] = [];
  private filePath: string;
  private container: HTMLElement;

  constructor(filePath: string, containerId: string) {
    this.filePath = filePath;
    const container = document.getElementById(containerId);
    if (container === null) {
      throw new Error(`Container element with id '${containerId}' not found.`);
    }
    this.container = container;
    this.loadFromFile();
  }

  create(order: OrderData): void {
    const newOrder = new Order(order.id, order.date, order.price);
    this.orders.push(newOrder);
    this.saveToFile();
  }

  read(): Order[] {
    return this.orders;
  }

  update(id: string, updatedOrder: OrderData): void {
    const index = this.findIndexById(id);
    if (index !== -1) {
      const updated = new Order(
        updatedOrder.id,
        updatedOrder.date,
        updatedOrder.price
      );
      this.orders[index] = updated;
      this.saveToFile();
    }
  }

  delete(id: string): void {
    const index = this.findIndexById(id);
    if (index !== -1) {
      this.orders.splice(index, 1);
      this.saveToFile();
    }
  }

  private findIndexById(id: string): number {
    return this.orders.findIndex(order => order.id === id);
  }

  private loadFromFile(): void {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      const parsedData: OrderData[] = JSON.parse(data);
      this.orders = parsedData.map(
        order => new Order(order.id, order.date, order.price)
      );
    } catch (error) {
      this.orders = [];
    }
  }

  private saveToFile(): void {
    const data = JSON.stringify(
      this.orders.map(order => ({
        id: order.id,
        date: order.date,
        price: order.price,
      })),
      null,
      2
    );
    fs.writeFileSync(this.filePath, data);
  }

  renderAllOrders(): void {
    this.container.innerHTML = '';

    this.orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.innerHTML =
        `<p>ID: ${order.id}</p>
        <p>Date: ${order.date.toString()}</p>
        <p>Price: ${order.price}</p>`;
      this.container.appendChild(orderElement);
    });
  }
}
