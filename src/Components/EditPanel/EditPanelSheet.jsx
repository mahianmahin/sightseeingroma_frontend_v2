import React from "react";
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
import { Edit, Settings, Eye, EyeOff, Save, RefreshCw } from "lucide-react";

const EditPanelSheet = ({ isEditor, error, page, refreshContent }) => {
  // Don't render anything if not an editor
  if (!isEditor) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 bg-[#930B31] hover:bg-[#6e0925] text-white shadow-lg h-[50px] w-[50px]"
          size="icon"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Open Edit Panel</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Metadata Center
          </SheetTitle>
          <SheetDescription>
            Manage metadata for {page} page
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Page Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current Page</h3>
            <p className="text-sm text-gray-600 capitalize">{page}</p>
          </div>

          {/* Editor Status */}
          <div className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <EyeOff className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Quick Actions</h3>
            
            <Button 
              onClick={refreshContent}
              variant="outline" 
              className="w-full justify-start"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Content
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How to Edit</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click on any editable content area</li>
              <li>• Look for edit buttons on images</li>
              <li>• Changes are saved automatically</li>
              <li>• Use refresh to see updated content</li>
            </ul>
          </div>

          {/* Page-specific Information */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-900 mb-2">Page Features</h3>
            <div className="text-sm text-yellow-800 space-y-1">
              {page === 'home' && (
                <>
                  <li>• Hero section with banner image</li>
                  <li>• Process steps with icons</li>
                  <li>• Services section</li>
                  <li>• Contact information</li>
                </>
              )}
              {page === 'agent-point' && (
                <>
                  <li>• Agent location information</li>
                  <li>• Interactive map embed</li>
                  <li>• Contact details</li>
                </>
              )}
              {page === 'about-us' && (
                <>
                  <li>• Company information</li>
                  <li>• Contact details with variables</li>
                  <li>• Template variables: {'{email}'}, {'{phone}'}, {'{address}'}</li>
                </>
              )}
              {(page === 'terms-conditions' || page === 'return-policy' || page === 'refund-policy') && (
                <>
                  <li>• Legal content sections</li>
                  <li>• Template variables available</li>
                  <li>• Contact information integration</li>
                </>
              )}
              {page === 'purchase-history' && (
                <>
                  <li>• User ticket history</li>
                  <li>• Ticket status management</li>
                  <li>• Download functionality</li>
                </>
              )}
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close Panel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditPanelSheet;
