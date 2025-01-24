import loaderGif from '../../assets/custom_loader.gif';

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <img src={loaderGif} alt="Loading..." className="w-24 h-24" />
    </div>
  );
};

export default Loader; 