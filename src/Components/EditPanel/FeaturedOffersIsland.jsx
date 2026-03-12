/**
 * Thin Astro-island wrapper for FeaturedOffersManager.
 * Checks editor status client-side and renders the manager panel
 * only for authenticated editors.
 */
import React from 'react';
import useEditorCheck from '../../hooks/useEditorCheck';
import FeaturedOffersManager from './FeaturedOffersManager';

const FeaturedOffersIsland = () => {
  const { isEditor } = useEditorCheck();
  return <FeaturedOffersManager isEditor={isEditor} />;
};

export default FeaturedOffersIsland;
