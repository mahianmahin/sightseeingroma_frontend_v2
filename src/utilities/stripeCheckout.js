// Import Stripe.js library
import { loadStripe } from '@stripe/stripe-js';
import { baseUrl } from './Utilities';
import { trackUserActivity, ACTIVITY_TYPES } from './activityTracker';

// Function to initiate Stripe Checkout and redirect the user
const handleStripeCheckout = async (title, description, image, date, adult_count, youth_count, infant_count, navigate, packageId, status, loaderTrigger) => {
  // Show loader if provided
  if (loaderTrigger) {
    loaderTrigger(true);
  }

  let key = ''
  let mode = "live"

  if (mode === "live") {
    key = 'pk_live_51RUF9vDVqSXnpb2PoAQmiqLb01JmshH8xVAaa73g5eeBxa8wduq5pfIt0sHWWLw5MkpyfQEv78asGbqOlOmiFAXY00MH7pQVHr'
  } else if (mode === "test") {
    key = 'pk_test_51RUFA3Rl7eg880YGrbKxXn5f4L0jgxm1OJSr191iJkz1m0MccRsWc9OiycCwXWwtbCUW3vR3N5ks6WUjbQUBTN3X00okzcby4o'
  }

  // Calculate total quantity and prepare tracking data
  const totalQuantity = parseInt(adult_count || 0) + parseInt(youth_count || 0) + parseInt(infant_count || 0);
  const trackingData = {
    ticketType: title,
    quantity: totalQuantity,
    packageId: packageId,
    date: date
  };

  // new publishable key from the new stripe account - 04/06/2025
  loadStripe(key)
    .then(stripe => {
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

      // Track payment initiation with the prepared tracking data
      trackUserActivity(ACTIVITY_TYPES.PAYMENT_INITIATED, trackingData);

      // Make a POST request to your server using the FormData object
      fetch(`${baseUrl}create-checkout-session/`, {
        method: 'POST',
        body: formData,
        // headers: { // please don't send this header with this request, it will cause unauthorized error that I don't want.
        //   'Authorization': `Bearer ${localStorage.getItem('access')}`
        // },
      })
      .then(response => {
        if (response.status === 401) {
          navigate('/login/');
        } else {
          return response.json();
        }
      })
      .then(session => {
        if (session) {
          loaderTrigger(false);
          // Redirect the user to the Stripe Checkout page
          stripe.redirectToCheckout({
            sessionId: session.id,
          })
          .then(result => {
            // Handle errors that occurred during the redirect to Stripe Checkout
            if (result.error) {
              console.error(result.error.message);
            }
          });
        }
      })
      .catch(error => {
        // Handle any other errors that occurred during the process
        console.error(error);
        loaderTrigger(false);
      });
    })
    .catch(error => {
      // Handle Stripe.js initialization error
      console.error(error);
      loaderTrigger(false);
    });
};

export default handleStripeCheckout;