'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import {
  sendSignInEmailLink,
  createAccountWithEmail,
  signInUserWithEmailAndPassword, // Use signInUserWithEmailAndPassword for signing in
  auth,
} from '@/utilities/firebaseClient';
import { isSignInWithEmailLink } from 'firebase/auth'; // Import the isSignInWithEmailLink method
import { signInWithEmailLink } from 'firebase/auth'; // Import the signInWithEmailLink function

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCreateAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (password !== 'Demo2024') {
      setError('Incorrect password. Please enter the correct code.');
      return;
    }

    setCreatingAccount(true);

    try {
      // Try signing in with the provided email and password
      await signInUserWithEmailAndPassword(email, password);
      console.log('User signed in successfully with email:', email);
      // Redirect the user to the advisor page after successful sign-in
      window.location.href = '/advisor';
    } catch (signInError) {
      // If sign-in fails, create a new account
      try {
        await createAccountWithEmail(email, password);
        setAccountCreated(true);
        // Send sign-in link after account creation
        await sendSignInEmailLink(email);
        console.log('Sign-in link sent to email:', email);

        // Automatically sign in the user after account creation
        await signInUserWithEmailAndPassword(email, password);
        console.log('User signed in successfully after account creation:', email);

        // Redirect the user to the advisor page after successful sign-in
        window.location.href = '/advisor';
      } catch (createError) {
        console.error('Error creating user account:', createError);
        setError('An error occurred while creating or signing in the user account. Please try again.');
      }
    } finally {
      setCreatingAccount(false);
    }
  };

  useEffect(() => {
    const handleSignInWithEmail = async () => {
      // Check if there is a valid sign-in link in the URL
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          let userEmail = window.localStorage.getItem('userEmailForSignIn');
          if (!userEmail) {
            // Prompt user to enter their email if it's not already available
            userEmail = window.prompt('Please provide your email for confirmation');
          }

          if (userEmail) {
            // Sign in the user with the email and the received link
            await signInWithEmailLink(auth, userEmail, window.location.href); // Use signInWithEmailLink function
            console.log('User successfully signed in with email:', userEmail);
            // Redirect the user to the advisor page after successful sign-in
            window.location.href = '/advisor';
          } else {
            console.error('User email is required for sign-in');
            setError('User email is required for sign-in. Please try again.');
          }
        } catch (signInError) {
          console.error('Error signing in with email link:', signInError);
          setError('Error signing in with email link. Please try again.');
        }
      }
    };

    handleSignInWithEmail();
  }, []); // Run once on component mount to handle email sign-in

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      {/* Header Section */}
      <header className="text-center my-8">
        <div className="mb-8 flex justify-center items-center">
          <Image src="/commsai.png" alt="CommsAI Logo" width={300} height={300} priority />
        </div>
        <p className="text-gray-600 text-lg mb-24">AI bridging Retirement and Wealth for Advisors</p>
        <h1 className="text-2xl font-bold mb-12">DEMO</h1>
        <div className="flex items-center justify-center space-x-6 mb-4">
          <div className="flex flex-col items-center">
            <Image src="/main-logo.png" alt="Advice Analytics Logo" width={115} height={115} priority />
            <p className="text-sm text-gray-600 mt-2">AI by Advice Analytics</p>
          </div>
          <div className="flex flex-col items-center">
            <Image src="/dailyvest.png" alt="DailyVest Logo" width={88} height={88} priority />
            <p className="text-sm text-gray-600 mt-2">Plan Health by DailyVest</p>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        {/* Form to handle account creation or sign-in */}
        <form onSubmit={handleCreateAccount} className="flex flex-col items-center space-y-6">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navyblue"
          />

          {/* Password Input (Only for account creation) */}
          {!accountCreated && (
            <input
              type="password"
              placeholder="Enter password (Demo2024)"
              value={password}
              onChange={handlePasswordChange}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navyblue"
            />
          )}

          {/* Button Section */}
          <button
            type="submit"
            disabled={!email || (!password && !accountCreated) || creatingAccount}
            className={`bg-gray-300 text-white cursor-pointer rounded-lg px-4 py-3 w-full transition duration-300 ${
              creatingAccount || accountCreated ? 'opacity-50 cursor-not-allowed' : 'hover:bg-navyblue'
            }`}
          >
            {accountCreated ? 'Success!' : 'Submit'}
          </button>

          {/* Error Message Display */}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </main>

      {/* Footer Section with Legal Terms */}
      <footer className="text-xs text-gray-600 mt-24 mx-6 text-center">
        © 2024. Advice Analytics. We offer this preview as a demonstration of features,
        and it is not meant to make claims nor share personal data in any way.{' '}
        <a
          href="https://adviceanalytics.com/legal"
          className="text-navyblue underline hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          See terms
        </a>
      </footer>
    </div>
  );
};

export default Home;
