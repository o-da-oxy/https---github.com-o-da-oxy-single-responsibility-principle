// SOLID: SINGLE RESPONSIBILITY PRINCIPLE
import * as fs from 'fs';

export interface OrderData {
  id: string;
  date: Date;
  price: number;
}

// основной класс Order
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

// класс с CRUD операциями, хранит массив Order и записывает в файл
export class OrderStorage {
  private orders: Order[] = [];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
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
}


// рендерит все Orders из файла в HTML
export class OrderRenderer {
  private orderStorage: OrderStorage;
  private container: HTMLElement;

  constructor(orderStorage: OrderStorage, containerId: string) {
    this.orderStorage = orderStorage;
    const container = document.getElementById(containerId);
    if (container === null) {
      throw new Error(`Container element with id '${containerId}' not found.`);
    }
    this.container = container;
  }

  renderAllOrders(): void {
    const orders = this.orderStorage.read();
    this.container.innerHTML = '';

    orders.forEach(order => {
      const orderElement = document.createElement('div');
      orderElement.innerHTML =
        `<p>ID: ${order.id}</p>
        <p>Date: ${order.date.toString()}</p>
        <p>Price: ${order.price}</p>`;
      this.container.appendChild(orderElement);
    });
  }
}
