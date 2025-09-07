import React, { useState, useEffect } from "react";
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
import { baseUrl } from "../../utilities/Utilities";

const EditPanelSheet = ({ isEditor, error, page, refreshContent, metaInfo }) => {
  // Don't render anything if not an editor
  if (!isEditor) return null;

  // Initial meta info from props
  const [metaTitle, setMetaTitle] = useState(metaInfo?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(metaInfo?.meta_description || "");
  const [metaKeywords, setMetaKeywords] = useState(metaInfo?.meta_keywords || "");
  const [schemaJson, setSchemaJson] = useState(metaInfo?.schema_json ? JSON.stringify(metaInfo.schema_json, null, 2) : "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showGlobalSheet, setShowGlobalSheet] = useState(false);

  // Sync form fields with metaInfo changes
  useEffect(() => {
    setMetaTitle(metaInfo?.meta_title || "");
    setMetaDescription(metaInfo?.meta_description || "");
    setMetaKeywords(metaInfo?.meta_keywords || "");
    setSchemaJson(metaInfo?.schema_json ? JSON.stringify(metaInfo.schema_json, null, 2) : "");
  }, [metaInfo]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    let parsedSchema = null;
    try {
      parsedSchema = schemaJson ? JSON.parse(schemaJson) : null;
    } catch (err) {
      setSaveError("Schema JSON is invalid");
      setSaving(false);
      return;
    }
    try {
      const accessToken = localStorage.getItem('access');
      const response = await fetch(`${baseUrl}pages/${page}/update/`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          schema_json: parsedSchema,
        })
      });
      const data = await response.json();
      if (response.ok && data.status === 200) {
        setSaveSuccess(true);
        refreshContent && refreshContent();
      } else {
        setSaveError(data.error || "Failed to update meta information");
      }
    } catch (err) {
      setSaveError(err.message || "Failed to update meta information");
    }
    setSaving(false);
  };

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
      <SheetContent className="w-[920px] max-h-screen overflow-y-auto">
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

          {/* Global Button at top of sheet */}
          <div className="w-full mt-2">
            <Button variant="outline" onClick={() => setShowGlobalSheet(true)} className="w-full">
              Global Settings
            </Button>
          </div>

          {/* Editor Status */}
          <div className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 text-red-600">
                <EyeOff className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-2 text-red-600">
                <EyeOff className="h-4 w-4" />
                <span className="text-sm">{saveError}</span>
              </div>
            )}
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <Save className="h-4 w-4" />
                <span className="text-sm">Meta information updated!</span>
              </div>
            )}
          </div>

          {/* Meta Information Form */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">Edit Meta Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder="Meta Title"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  placeholder="Meta Description"
                  rows={3}
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={metaKeywords}
                  onChange={e => setMetaKeywords(e.target.value)}
                  placeholder="Meta Keywords"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schema</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm font-mono"
                  value={schemaJson}
                  onChange={e => setSchemaJson(e.target.value)}
                  placeholder="Schema JSON (must be valid JSON)"
                  rows={5}
                  disabled={saving}
                />
              </div>
              <Button
                onClick={handleSave}
                variant="default"
                className="w-full mt-2"
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Meta Information"}
              </Button>
            </div>
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
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close Panel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>

      {/* Add Global Sheet */}
      {showGlobalSheet && (
        <Sheet open={showGlobalSheet} onOpenChange={setShowGlobalSheet}>
          <SheetContent className="w-[600px]">
            <SheetHeader>
              <SheetTitle>Global Settings</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </Sheet>
  );
};

export default EditPanelSheet;
