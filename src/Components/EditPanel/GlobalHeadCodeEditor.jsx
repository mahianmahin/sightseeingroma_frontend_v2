import React, { useEffect, useState } from "react";
import { baseUrlHashless } from "../../utilities/Utilities";
import { Button } from "@/components/ui/button";
import Editor from '@monaco-editor/react';

// Simple HTML formatter
const formatHTML = (html) => {
  let formatted = '';
  let indent = 0;
  const tab = '  ';
  const tokens = html.replace(/>\s*</g, '><').split(/(<[^>]*>)/);
  tokens.forEach(token => {
    if (token.trim()) {
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.startsWith('<') && !token.includes('</') && !token.endsWith('/>')) {
        formatted += tab.repeat(indent) + token + '\n';
        indent += 1;
      } else if (token.startsWith('<')) {
        formatted += tab.repeat(indent) + token + '\n';
      } else {
        const trimmed = token.trim();
        if (trimmed) {
          formatted += tab.repeat(indent) + trimmed + '\n';
        }
      }
    }
  });
  return formatted.trim();
};

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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (loading) return;
    setHeadCode(formatHTML(headCode));
    // eslint-disable-next-line
  }, [loading]);

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-medium text-gray-900 mb-2">Edit Global Head Code</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <Editor
            height="250px"
            defaultLanguage="html"
            value={headCode}
            onChange={value => setHeadCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 21,
              fontFamily: 'Monaco, Menlo, "Courier New", monospace',
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              formatOnPaste: true,
              formatOnType: true,
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'all',
              selectionHighlight: true,
              bracketPairColorization: { enabled: true },
              autoIndent: 'full',
              contextmenu: true,
              copyWithSyntaxHighlighting: true
            }}
            loading={<div className="flex items-center justify-center h-full bg-gray-900 text-white"><div className="text-sm">Loading editor...</div></div>}
          />
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
