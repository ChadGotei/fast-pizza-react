import { useLoaderData } from "react-router";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from './MenuItem';

function Menu() {
  const menu = useLoaderData();

  return <ul className="divide-y divide-stone-200 px-2">
    {menu.map(pizza => (
      <MenuItem key={menu.id} pizza={pizza} />
    ))}
  </ul>
}

export async function loader() {
  const menu = getMenu();
  return menu;
}

export default Menu;
