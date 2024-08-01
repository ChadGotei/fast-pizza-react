/* eslint-disable no-unused-vars */
// Test ID: IIDSAT

import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";

import { calcMinutesLeft, formatCurrency, formatDate } from "../../utils/helpers";
import OrderItem from './OrderItem';

function Order() {
  const order = useLoaderData();

  const fetcher = useFetcher();

  useEffect(() => {
    if (!fetcher.data && fetcher.state === 'idle') {
      fetcher.load('/menu');
    }
  }, [fetcher]);

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="px-4 py-6 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Order #{id} Status</h2>
        <div className="space-x-2">
          {priority && (
            <span className="text-red-50 text-sm font-semibold uppercase px-3 bg-red-500 tracking-wide py-1 rounded-full">
              Priority
            </span>
          )}
          <span className="text-green-50 text-sm font-semibold uppercase px-3 bg-green-500 tracking-wide py-1 rounded-full">
            {status} order
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between bg-stone-200 py-5 px-6 gap-2">
        <p>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-sm text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className="divide-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem
            key={item.id}
            item={item}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher.data?.find((el) => el.id === item.pizzaId).ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className="space-y-2 bg-stone-200 py-5 px-6">
        <p className="text-sm font-medium">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && (
          <p className="text-sm font-medium">Price priority: {formatCurrency(priorityPrice)}</p>
        )}
        <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
