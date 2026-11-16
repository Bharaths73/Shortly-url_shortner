import { useState } from "react";
import { Input } from "../ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/hero.png";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="w-full h-16 bg-white/95 text-white flex items-center justify-between px-4 fixed top-0 left-0 z-50 backdrop-blur-xl border-b border-orange-200">
      <nav className="w-11/12 h-16 bg-transparent text-white flex items-center justify-between mx-auto">
        <div className="flex items-center justify-center gap-x-2" onClick={() => navigate("/home")}>
          <img src={logo} className="w-12 h-12 rounded-[100%] p-0.5"/>
          <h1  className="cursor-pointer text-lg font-extrabold tracking-tight text-gray-900">
            Food<span className="text-orange-500">ie</span>
          </h1>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-x-2 cursor-pointer ">
              <NavigationMenuLink className="hover:bg-orange-100">
                <NavLink to="/restaurants" className="text-black font-semibold text-sm">Restaurants</NavLink>
              </NavigationMenuLink>
              {/* <NavigationMenuLink className="hover:bg-gray-800">
                  <NavLink to="/foods">Foods</NavLink>
                </NavigationMenuLink> */}
              <NavigationMenuLink className="hover:bg-orange-100">
                <NavLink to="/cart" className="text-black font-semibold text-sm">Cart</NavLink>
              </NavigationMenuLink>
              <NavigationMenuLink className="hover:bg-orange-100">
                <NavLink to="/profile" className="text-black font-semibold text-sm">Profile</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
}

export default Navbar;
