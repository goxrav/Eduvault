import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';
import api from '../api/axios';
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '791533601638-6nad1k17a6nplpdm8j9nprjq1pqju39b.apps.googleusercontent.com',
    androidClientId: '791533601638-fpgoqthgqgbhlc82pcdhq2puj6kggjls.apps.googleusercontent.com',
  });

   useEffect(() => {
    if (request?.redirectUri) {
      console.log('REDIRECT URI BEING USED:', request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    handleResponse();
  }, [response]);


  const handleResponse = async () => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      try {
     
        const credential = GoogleAuthProvider.credential(id_token);
        const result = await signInWithCredential(auth, credential);
        const { uid, displayName, email, photoURL } = result.user;

      
        await api.post('/api/users', {
          uid,
          name: displayName,
          email,
          profilePic: photoURL,
        });

      
        router.replace('/select-details');

      } catch (error) {
        console.error('Auth error:', error.code, error.message);
      }
        } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
    } else if (response?.type === 'dismiss') {
      console.log('User dismissed the auth flow');
    }
  };
  const signIn = async () => {
    await promptAsync();
  };

  return { signIn, request };
};