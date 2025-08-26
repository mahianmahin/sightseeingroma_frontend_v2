import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaSave, FaCode, FaEye } from 'react-icons/fa';
import Editor from '@monaco-editor/react';

// Simple HTML formatter
const formatHTML = (html) => {
  let formatted = '';
  let indent = 0;
  const tab = '  '; // 2 spaces for indentation
  
  // Remove extra whitespace and split by tags
  const tokens = html.replace(/>\s*</g, '><').split(/(<[^>]*>)/);
  
  tokens.forEach(token => {
    if (token.trim()) {
      if (token.startsWith('</')) {
        // Closing tag - decrease indent
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + token + '\n';
      } else if (token.startsWith('<') && !token.includes('</') && !token.endsWith('/>')) {
        // Opening tag - add current indent then increase
        formatted += tab.repeat(indent) + token + '\n';
        indent += 1;
      } else if (token.startsWith('<')) {
        // Self-closing tag
        formatted += tab.repeat(indent) + token + '\n';
      } else {
        // Text content
        const trimmed = token.trim();
        if (trimmed) {
          formatted += tab.repeat(indent) + trimmed + '\n';
        }
      }
    }
  });
  
  return formatted.trim();
};

const EditContentModal = ({ 
  isOpen, 
  onClose, 
  content, 
  onSave, 
  title = 'Edit Content'
}) => {
  // Ensure content is always a string
  const stringContent = typeof content === 'string' ? content : '';
  const [editedContent, setEditedContent] = useState(stringContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const newStringContent = typeof content === 'string' ? content : '';
    // Auto-format the content when it's loaded
    const formatted = newStringContent ? formatHTML(newStringContent) : '';
    setEditedContent(formatted);
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedContent);
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const newStringContent = typeof content === 'string' ? content : '';
    // Auto-format when canceling too
    const formatted = newStringContent ? formatHTML(newStringContent) : '';
    setEditedContent(formatted);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col relative z-[999999]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Preview Section */}
          <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
            <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
              <FaEye className="text-black" />
              <span className="text-sm font-medium text-black">Preview</span>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-white">
              <div 
                className="prose max-w-none text-black"
                dangerouslySetInnerHTML={{ __html: editedContent }}
              />
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaCode className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">HTML Editor</span>
              </div>
              <div className="text-xs text-gray-500">
                {(editedContent || '').length} characters
              </div>
            </div>
            
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="html"
                value={editedContent}
                onChange={(value) => setEditedContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
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
                loading={
                  <div className="flex items-center justify-center h-full bg-gray-900 text-white">
                    <div className="text-sm">Loading editor...</div>
                  </div>
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            {(editedContent || '').split('\n').length} lines
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors duration-200"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditContentModal;
