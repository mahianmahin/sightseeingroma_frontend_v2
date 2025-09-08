import React, { useEffect, useState } from "react";
import { baseUrlHashless } from "../../utilities/Utilities";
import { Button } from "@/components/ui/button";

const API_URL = `${baseUrlHashless}/website-settings/global-head-code/`;

const GlobalHeadCodeEditor = ({ onClose }) => {
  const [headCode, setHeadCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchHeadCode = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL, { method: "GET" });
        const data = await res.json();
        if (res.ok && data.status === 200 && data.global_head_code !== undefined) {
          setHeadCode(data.global_head_code);
        } else {
          setError(data.error || "Failed to fetch global head code");
        }
      } catch (err) {
        setError("Failed to fetch global head code");
      }
      setLoading(false);
    };
    fetchHeadCode();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const accessToken = localStorage.getItem("access");
      const res = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ global_head_code: headCode })
      });
      const data = await res.json();
      if (res.ok && data.status === 200) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to update global head code");
      }
    } catch (err) {
      setError("Failed to update global head code");
    }
    setSaving(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-medium text-gray-900 mb-2">Edit Global Head Code</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
            <textarea className="w-full border rounded px-3 py-2 text-sm font-mono" value={headCode} onChange={e => setHeadCode(e.target.value)} placeholder="Paste any valid <head> code here (meta, script, style, etc.)" rows={8} disabled={saving} />
        )}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Global head code updated!</div>}
        <Button
          onClick={handleSave}
          variant="default"
          className="w-full mt-2"
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save Code"}
        </Button>
      </div>
    </div>
  );
};

export default GlobalHeadCodeEditor;
