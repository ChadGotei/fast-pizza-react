import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalPrice, getTotalQuantity } from "./cartSlice";

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalQuantity);
  const totalCartPrice = useSelector(getTotalPrice);

  if(!totalCartQuantity) return;

  return (
    <div className="flex items-center justify-between bg-stone-700 text-stone-200 uppercase px-4 py-4 text-sm sm:px-6 md:text-base">
      <p className="text-stone-300 font-semibold space-x-3 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>${totalCartPrice}</span>
      </p>
      <Link to='/cart'> Open Cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
