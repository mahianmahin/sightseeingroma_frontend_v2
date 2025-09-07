import React, { useEffect, useState } from "react";
import { baseUrlHashless } from "../utilities/Utilities";

const API_URL = `${baseUrlHashless}/website-settings/global-head-code/`;

const GlobalSEO = () => {
  const [headCode, setHeadCode] = useState("");

  useEffect(() => {
    const fetchHeadCode = async () => {
      try {
        const res = await fetch(API_URL, { method: "GET" });
        const data = await res.json();
        if (res.ok && data.status === 200 && data.global_head_code) {
          setHeadCode(data.global_head_code);
        }
      } catch (err) {
        // Fail silently
      }
    };
    fetchHeadCode();
  }, []);

  useEffect(() => {
    if (!headCode) return;

    // Create a unique identifier for our injected content
    const markerId = 'global-seo-content';
    
    // Remove any existing global SEO content
    const existing = document.getElementById(markerId);
    if (existing) {
      existing.remove();
    }

    // Create a container element to hold our content
    const container = document.createElement('div');
    container.id = markerId;
    container.style.display = 'none'; // Hide the container itself
    container.innerHTML = headCode;

    // Insert the raw HTML directly into head
    document.head.insertAdjacentHTML('beforeend', `<!-- Global SEO code from the server -->${headCode}<!-- Global SEO End -->`);

    // Cleanup function
    return () => {
      // Remove content between our markers
      const startComment = Array.from(document.head.childNodes).find(
        node => node.nodeType === Node.COMMENT_NODE && node.nodeValue.includes('Global SEO Start')
      );
      const endComment = Array.from(document.head.childNodes).find(
        node => node.nodeType === Node.COMMENT_NODE && node.nodeValue.includes('Global SEO End')
      );
      
      if (startComment && endComment) {
        let current = startComment.nextSibling;
        while (current && current !== endComment) {
          const next = current.nextSibling;
          current.remove();
          current = next;
        }
        startComment.remove();
        endComment.remove();
      }
    };
  }, [headCode]);

  return null; // This component doesn't render anything in React
};

export default GlobalSEO;
