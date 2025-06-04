// Import Stripe.js library
import { loadStripe } from '@stripe/stripe-js';
import { baseUrl } from './Utilities';

// Function to initiate Stripe Checkout and redirect the user
const handleStripeCheckout = (title, description, image, date, adult_count, youth_count, infant_count, navigate, packageId, status, loaderTrigger) => {
  // Show loader if provided
  if (loaderTrigger) {
    loaderTrigger(true);
  }

  // new publishable key from the new stripe account - 04/06/2025
  loadStripe('pk_live_51RUF9vDVqSXnpb2PoAQmiqLb01JmshH8xVAaa73g5eeBxa8wduq5pfIt0sHWWLw5MkpyfQEv78asGbqOlOmiFAXY00MH7pQVHr')
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

      // Make a POST request to your server using the FormData object
      fetch(`${baseUrl}create_checkout_session/`, {
        method: 'POST',
        body: formData,
        // headers: {
        //   'Accept': '*/*',
        //   'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryrEA5qjBhkEFlmZt5',
        // },
        // headers: {
        //   'Authorization': `Bearer ${window.localStorage['access']}`,
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