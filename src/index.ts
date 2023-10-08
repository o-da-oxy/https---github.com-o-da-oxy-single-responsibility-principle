import express, {Request, Response} from 'express';
import {JSDOM} from 'jsdom';
import {OrderData, OrderRenderer, OrderStorage} from './Order';
import { GodOrder } from './GodOrder';

const app = express();
const port = 3000;

// выполняет CRUD операции, хранит заказы в файле orders.json
const orderStorage = new OrderStorage('orders.json');

// Создание заказов
const newOrders: OrderData[] = [
  {
    id: '1',
    date: new Date(),
    price: 100,
  },
  {
    id: '2',
    date: new Date(),
    price: 200,
  },
  {
    id: '3',
    date: new Date(),
    price: 300,
  },
];
newOrders.forEach(element => {
  orderStorage.create(element);
});

// Получение всех заказов
const allOrders = orderStorage.read();
console.log(allOrders);

// Обновление заказа
const updatedOrder: OrderData = {
  id: '1',
  date: new Date(),
  price: 1000,
};
orderStorage.update('1', updatedOrder);

// OrderRenderer - рендерит все заказы из файла orders.json
app.get('/', (req: Request, res: Response) => {
  const dom = new JSDOM('<!DOCTYPE html><div id="order-container"></div>');
  global.document = dom.window.document;

  const orderRenderer = new OrderRenderer(orderStorage, 'order-container');
  orderRenderer.renderAllOrders();

  const renderedPage = dom.serialize();
  res.send(renderedPage);
});

// GodOrder - антипаттерн - и создает заказ, и рендерит
app.get('/god', (req: Request, res: Response) => {
  const dom = new JSDOM('<!DOCTYPE html><div id="god-order-container"></div>');
  global.document = dom.window.document;

  const godOrder = new GodOrder('god-orders.json', 'god-order-container');
  godOrder.create(
    {
      id: '1',
      date: new Date(),
      price: 3000000,
    },
  );
  godOrder.renderAllOrders();

  const renderedPage = dom.serialize();
  res.send(renderedPage);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
