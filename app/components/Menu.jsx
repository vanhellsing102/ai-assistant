"use client";
import Link from "next/link";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import { CiText } from "react-icons/ci";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";

const Menu = () => {
    
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <div className="inline-block mt-10 md:ml-7 ml-5 relative">
                <div className="bg-[#4FB7B3] rounded-full p-2 flex items-center justify-center w-12 h-12">
                <button onClick={() => setOpenMenu(!openMenu)} className="cursor-pointer text-xl font-bold">
                  <CiMenuBurger className="text-white"/>
                </button>
                </div>
                <div className="bg-[#4FB7B3] rounded-sm w-32 flex flex-col items-center absolute md:top-20 md:left-0 left-16 -top-5">
                  <ul className="w-full">
                    {
                      openMenu && navlinks.map(link =>
                        <li className="py-2 px-2 w-full rounded-sm hover:bg-[#A8FBD3] hover:text-black text-gray-200 text-sm font-semibold" key={link?.id}>
                          <Link onClick={() =>setOpenMenu(false)} className="w-full flex justify-between items-center" href={link?.route}>{link?.title} {link?.icon && <link.icon className="text-lg"/>}</Link>
                        </li>
                      )
                    }
                  </ul>
                </div>
              </div>
    );
};
const navlinks = [
  {
    id: 1,
    route: "/",
    title: "Text",
    icon: CiText
  },
  {
    id: 2,
    route: "/voice",
    title: "Voice",
    icon: MdOutlineKeyboardVoice
  },
  {
    id: 3,
    route: "/camera",
    title: "Camera",
    icon: IoCameraOutline
  }
]
export default Menu;