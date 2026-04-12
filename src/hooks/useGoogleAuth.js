import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '791533601638-6nad1k17a6nplpdm8j9nprjq1pqju39b.apps.googleusercontent.com',
     androidClientId: '791533601638-6nad1k17a6nplpdm8j9nprjq1pqju39b.apps.googleusercontent.com',
  });

  useEffect(() => {
    handleResponse();
  }, [response]);

  const handleResponse = async () => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      try {
        const credential = GoogleAuthProvider.credential(id_token);
        const result = await signInWithCredential(auth, credential);
        if (result.user) {
          router.replace('/select-details');
        }
      } catch (error) {
        console.error('Firebase sign in error:', error);
      }
    }
  };

  const signIn = async () => {
    await promptAsync();
  };

  return { signIn, request };
};