/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { clearCart, getCart, getTotalPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { createOrder } from "../../services/apiRestaurant";
import { fetchAddress } from "../user/userSlice";

import EmptyCart from '../cart/EmptyCart';
import Button from "../../ui/Button";
import store from '../../store';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);

  const { username, status: addressStatus, position, address, error: errorAddress } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === 'loading'

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalPrice);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const formError = useActionData();

  const isSubmitting = navigation.state === 'submitting';

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = priorityPrice + totalCartPrice;

  if (!cart.length) return <EmptyCart />

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Let`s go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              type="tel"
              name="phone"
              required
              className="input w-full"
            />
            {formError?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-lg"> {formError.phone} </p>}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center relative">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              required
              disabled={isLoadingAddress}
              value={address}
            />
          {addressStatus === 'error' && <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-lg "> {errorAddress} </p>}
          </div>



          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[32px] z-50 sm:top-[5px]">
              <Button
                type="small"
                disabled={isSubmitting || isLoadingAddress}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress())
                }}>Get position</Button>
            </span>
          )}
        </div>

        <div className="mb-10 flex gap-4 items-center">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />


          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.latitude && position.longitude ? `${position.latitude},${position.longitude}` : ''} />

          <label htmlFor="priority" className="font-medium">Want to yo give your order priority?</label>
        </div>

        <div>
          <Button
            disabled={isSubmitting}
            type="primary"

          >
            {isSubmitting ? 'Placing order...' : `Order Now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    priority: data.priority === 'true',
    cart: JSON.parse(data.cart),
  }

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please provide us your phone number, in case we need to contact you.";
  }

  if (Object.keys(errors).length > 0)
    return errors;

  // console.log(order);
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`); // as we cannot use useNavigate inside a function.
}

export default CreateOrder;