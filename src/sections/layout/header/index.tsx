"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlignJustifyIcon,
  BellRingIcon,
  HeartIcon,
  LogOutIcon,
  MailOpenIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Link } from "@/lib/view-transition";
import { cn } from "@/lib/utils";


import { useBoolean } from "@/hooks/use-boolean";
import { useEffect, useState } from "react";
import MobileNavBtn from "./mobile-nav-btn";
import DesktopNavBtn from "./desktop-nav-btn";
import { useInView } from "react-intersection-observer";
import { useSystemNotification } from "@/lib/provider/notification-provider";
import { useToast } from "@/hooks/use-toast";
import { truncateString } from "@/lib/truncate";
import SignModal from "@/components/modal/sign-modal";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/api";

const Header = () => {

  // const { data: session } = useSession();

  const { ref: inviewRef, inView } = useInView();

  const pathname = usePathname();

  // const showNotification = useBoolean();
  // const signModalOpen = useBoolean();

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };


  return (
    <div className="container md:max-w-screen-xl w-full md:mx-auto md:px-6 px-5 flex flex-row justify-between items-center">
      {/* <SignModal
        isOpen={signModalOpen.value}
        onClose={signModalOpen.onFalse}
      /> */}
      <div className="flex justify-center items-center gap-2">
        <Link href="/" className="relative flex flex-row items-center gap-2">
          <div className="w-8">
            <Image
              src="/logo/logo-black.png"
              alt="RedFlag"
              fill
              className="h-full w-auto object-cover !static"
              priority
            />
          </div>
          <span className="text-lg font-bold">
            Redflag Networks
          </span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-3 mr-3">
          <DesktopNavBtn
            active={isActive("/donate")}
          >
            <Link href="/donate" className="flex items-center gap-1.5">
              <HeartIcon className="h-4 w-4" />
              <span>Donate</span>
            </Link>
          </DesktopNavBtn>

          <Button
            variant="ghost"
            className="hover:text-primary transition-all"
            asChild
          >
            <Link
              href="https://forum.redflagnetworks.com"
              target="_blank"
              className="flex items-center gap-1.5"
            >
              <MessageSquareIcon className="h-4 w-4" />
              <span>Forum</span>
            </Link>
          </Button>
        </nav>

        <Button
          className="flex md:hidden items-center p-3 rounded-full bg-gray-100 text-black relative hover:text-primary hover:bg-gray-200"
        // onClick={showNotification.onTrue}
        >
          <BellRingIcon className="h-4 w-4" />
        </Button>

        {/* Mobile Nav */}
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button className="md:hidden" variant="ghost">
              <AlignJustifyIcon />
            </Button>
          </DrawerTrigger>

          {/* Drawer Content */}
          <DrawerContent className="h-screen w-3/4">
            <div className="h-screen w-full">
              <DrawerHeader className="w-full">
                <DrawerTitle className="flex flex-row justify-between w-full items-start">
                  <div />
                  <div className="mb-4 md:mb-0 w-14">
                    <Link href="/" className="relative block">
                      <Image
                        src="/logo/logo.png"
                        alt="RedFlag"
                        className="w-full h-full object-cover !static"
                        fill
                        priority
                      />
                    </Link>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="ghost">
                      <XIcon />
                    </Button>
                  </DrawerClose>
                </DrawerTitle>
              </DrawerHeader>

              <div className="flex flex-col gap-3">

                <MobileNavBtn active={isActive("/donate")}>
                  <Link href="/donate" className="flex items-center gap-1.5">
                    <HeartIcon className="h-4 w-4" />
                    <span>Donate</span>
                  </Link>
                </MobileNavBtn>

                <MobileNavBtn active={isActive("/forum")}>
                  <Link href="https://forum.redflagnetworks.com" target="_blank" className="flex items-center gap-1.5">
                    <MessageSquareIcon className="h-4 w-4" />
                    <span>Forum</span>
                  </Link>
                </MobileNavBtn>

              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Header;
