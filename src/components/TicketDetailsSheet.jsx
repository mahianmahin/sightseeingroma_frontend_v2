import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Clock, Euro, Calendar, Users, Info } from "lucide-react";

const TicketDetailsSheet = ({ ticket, children }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (!ticket) return children;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{ticket.title}</SheetTitle>
          <SheetDescription>
            {ticket.subtitle || "Complete ticket information and booking details"}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Ticket Image */}
          {ticket.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={ticket.image} 
                alt={ticket.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Ticket Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Duration:</span>
                <span className="ml-2 text-gray-600">{ticket.duration || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Euro className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Price:</span>
                <span className="ml-2 text-[#930B31] font-bold">€{ticket.price}</span>
                {ticket.price2 && (
                  <span className="ml-2 text-gray-500">Youth: €{ticket.price2}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-gray-500" />
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ticket.status || "Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Number of Tickets
            </label>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
              >
                -
              </Button>
              <span className="font-medium text-lg w-8 text-center">{selectedQuantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setSelectedQuantity(selectedQuantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-xl font-bold text-[#930B31]">
                €{(ticket.price * selectedQuantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button className="bg-[#930B31] hover:bg-[#7a0929]">
            Book Now
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TicketDetailsSheet;
