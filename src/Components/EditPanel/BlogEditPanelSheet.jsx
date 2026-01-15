import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, Settings, EyeOff, Save, CheckCircle } from "lucide-react";
import { baseUrl } from "../../utilities/Utilities";

const BlogEditPanelSheet = ({ isEditor, blogSlug, blogData, onUpdate }) => {
  // Don't render anything if not an editor
  if (!isEditor) return null;

  // Initial meta info from blogData
  const [metaTitle, setMetaTitle] = useState(blogData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(blogData?.meta_description || "");
  const [metaKeywords, setMetaKeywords] = useState(blogData?.meta_keywords || "");
  const [schemaJson, setSchemaJson] = useState(
    blogData?.schema_json ? JSON.stringify(blogData.schema_json, null, 2) : ""
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync form fields with blogData changes
  useEffect(() => {
    setMetaTitle(blogData?.meta_title || "");
    setMetaDescription(blogData?.meta_description || "");
    setMetaKeywords(blogData?.meta_keywords || "");
    setSchemaJson(
      blogData?.schema_json ? JSON.stringify(blogData.schema_json, null, 2) : ""
    );
  }, [blogData]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    
    let parsedSchema = null;
    if (schemaJson && schemaJson.trim()) {
      try {
        parsedSchema = JSON.parse(schemaJson);
      } catch (err) {
        setSaveError("Schema JSON is invalid. Please check the syntax.");
        setSaving(false);
        return;
      }
    }
    
    try {
      const accessToken = localStorage.getItem('access');
      const response = await fetch(`${baseUrl}blog/posts/${blogSlug}/update/`, {
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
        if (onUpdate) {
          onUpdate(data.data);
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || "Failed to update blog metadata");
      }
    } catch (err) {
      setSaveError(err.message || "Failed to update blog metadata");
    }
    setSaving(false);
  };

  // Generate default schema
  const generateDefaultSchema = () => {
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogData?.title ? blogData.title.replace(/<[^>]*>/g, '') : "",
      "description": metaDescription || blogData?.excerpt || "",
      "image": blogData?.featured_image_url || "",
      "author": {
        "@type": "Person",
        "name": blogData?.author_name || "SightseeingRoma"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SightseeingRoma",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.sightseeingroma.com/logo.png"
        }
      },
      "datePublished": blogData?.published_at || "",
      "dateModified": blogData?.updated_at || "",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.sightseeingroma.com/blog/${blogSlug}`
      }
    };
    setSchemaJson(JSON.stringify(defaultSchema, null, 2));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 bg-[#930B31] hover:bg-[#6e0925] text-white shadow-lg h-[50px] w-[50px]"
          size="icon"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Open Blog Edit Panel</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[540px] max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Blog SEO Editor
          </SheetTitle>
          <SheetDescription>
            Manage SEO metadata for this blog post
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Blog Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Current Blog</h3>
            <p className="text-sm text-gray-600 break-all">{blogSlug}</p>
          </div>

          {/* Status Messages */}
          {saveError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <EyeOff className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{saveError}</span>
            </div>
          )}
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Blog metadata saved successfully!</span>
            </div>
          )}

          {/* Meta Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title for SEO"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#930B31] focus:border-transparent text-sm"
              maxLength={200}
            />
            <p className="text-xs text-gray-500">{metaTitle.length}/200 characters</p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description for SEO (recommended: 150-160 characters)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#930B31] focus:border-transparent text-sm resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">{metaDescription.length}/500 characters</p>
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meta Keywords
            </label>
            <textarea
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="Enter keywords separated by commas (e.g., rome, travel, sightseeing)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#930B31] focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Schema JSON */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Schema JSON (JSON-LD)
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={generateDefaultSchema}
                className="text-xs"
              >
                Generate Default
              </Button>
            </div>
            <textarea
              value={schemaJson}
              onChange={(e) => setSchemaJson(e.target.value)}
              placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#930B31] focus:border-transparent text-sm font-mono resize-none"
            />
            <p className="text-xs text-gray-500">
              Enter valid JSON-LD structured data for enhanced SEO.
            </p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#930B31] hover:bg-[#6e0925] text-white"
          >
            {saving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BlogEditPanelSheet;
