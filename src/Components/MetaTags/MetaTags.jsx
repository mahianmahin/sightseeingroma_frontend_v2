import PropTypes from 'prop-types';
import useMetaTags from '../../hooks/useMetaTags';

const MetaTags = ({ title, description }) => {
  useMetaTags({ title, description });
  return null; // This component doesn't render anything
};

MetaTags.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default MetaTags; 