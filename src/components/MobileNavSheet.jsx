import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, MapPin, Ticket, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const MobileNavSheet = () => {
  const navigationItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Purchase History",
      href: "/yourticket",
      icon: Ticket,
    },
    {
      label: "Agent Points",
      href: "/agentPoints",
      icon: MapPin,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: Phone,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Sightseeing Roma</SheetTitle>
          <SheetDescription>
            Navigate to different sections of our website
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <SheetClose key={index} asChild>
                <Link
                  to={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-2">
            <p className="font-medium">Contact Us</p>
            <p>Email: hello@sightseeingroma.com</p>
            <p>Phone: +39 327 3633 993</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavSheet;
