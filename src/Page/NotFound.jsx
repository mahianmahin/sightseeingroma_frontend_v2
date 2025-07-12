import { Link } from 'react-router-dom';
import Banner2 from '../Components/Banner2/Banner2';
import PageNotFoundImage from '../assets/new/Page-Not-Found-Hero-Image.jpg';

const NotFound = () => {
    return (
        <div className="container mx-auto">
            <Banner2
                bannerImgmd={PageNotFoundImage}
                bannerImgsm={PageNotFoundImage}
                title={'Page Not Found'}
                description={'Oops! The page you are looking for does not exist.'}
            />
            
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center max-w-2xl">
                    <h1 className="text-6xl font-bold text-red-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We couldn't find the page you were looking for. The page might have been removed, 
                        renamed, or doesn't exist.
                    </p>
                    {/* <div className="space-y-4">
                        <Link 
                            to="/"
                            className="inline-block bg-red-800 text-white px-8 py-3 rounded-lg hover:bg-red-900 transition-colors duration-300"
                        >
                            Return to Home
                        </Link>
                        <p className="text-gray-500 text-sm mt-4">
                            Need help? <Link to="/aboutus" className="text-red-800 hover:underline">Contact us</Link>
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default NotFound; 