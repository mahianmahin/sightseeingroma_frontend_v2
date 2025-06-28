import { createRefresh } from 'react-auth-kit';
import { AuthProvider } from 'react-auth-kit';
import { baseUrl } from '../utilities/Utilities';

const refreshApi = createRefresh({
  interval: 10, // refresh token every 10 minutes
  refreshApiCallback: async ({ refreshToken }) => {
    try {
      const response = await fetch(`${baseUrl}api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const data = await response.json();

      return {
        isSuccess: true,
        newAuthToken: data.access,
        newRefreshToken: data.refresh,
      };
    } catch (error) {
      console.error('Refresh Token Error:', error);
      return {
        isSuccess: false,
      };
    }
  },
});

const AppAuthProvider = ({ children }) => {
  return (
    <AuthProvider
      authType="cookie"
      authName="_auth"
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}
      refresh={refreshApi}
    >
      {children}
    </AuthProvider>
  );
};

export default AppAuthProvider; 