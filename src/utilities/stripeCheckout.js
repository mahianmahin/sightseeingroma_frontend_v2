// Import Stripe.js library
import { baseUrl } from './Utilities';
import { trackUserActivity, ACTIVITY_TYPES } from './activityTracker';

// Function to initiate Stripe Checkout with embedded mode
const handleStripeCheckout = async (title, description, image, date, adult_count, youth_count, infant_count, navigate, packageId, status, loaderTrigger) => {
  // Show loader if provided
  if (loaderTrigger) {
    loaderTrigger(true);
  }

  try {
    // Calculate total quantity and prepare tracking data
    const totalQuantity = parseInt(adult_count || 0) + parseInt(youth_count || 0) + parseInt(infant_count || 0);
    const trackingData = {
      ticketType: title,
      quantity: totalQuantity,
      packageId: packageId,
      date: date
    };

    // Track payment initiation with the prepared tracking data
    trackUserActivity(ACTIVITY_TYPES.PAYMENT_INITIATED, trackingData);

    // Create a new FormData object and append the form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('date', date);
    formData.append('adult_count', adult_count);
    formData.append('youth_count', youth_count);
    formData.append('infant_count', infant_count);
    formData.append('package_id', packageId);
    formData.append('package_identifier', status);

    // Make a POST request to your server using the FormData object
    const response = await fetch(`${baseUrl}create-checkout-session/`, {
      method: 'POST',
      body: formData,
      // headers: { // please don't send this header with this request, it will cause unauthorized error that I don't want.
      //   'Authorization': `Bearer ${localStorage.getItem('access')}`
      // },
    });

    if (response.status === 401) {
      loaderTrigger(false);
      navigate('/login/');
      return;
    }

    const session = await response.json();

    if (session && session.clientSecret) {
      loaderTrigger(false);
      
      // Navigate to embedded checkout page with client secret
      navigate('/checkout', {
        state: {
          clientSecret: session.clientSecret
        }
      });
    } else {
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    loaderTrigger(false);
    // Optionally show an error message to the user
    alert('Unable to process checkout. Please try again.');
  }
};

export default handleStripeCheckout;