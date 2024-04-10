'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { sendSignInEmailLink, createAccountWithEmail, auth } from '@/utilities/firebaseClient';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && accountCreated) {
        console.log('User is signed in:', user.email);
        window.location.href = '/advisor'; // Redirect to advisor page if user is authenticated and account is created
      } else {
        console.log('No user is signed in');
      }
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, [accountCreated]); // Add accountCreated to the dependency array

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSendSignInLink = () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    sendSignInEmailLink(email)
      .then(() => {
        console.log('Sign-in link sent to email:', email);
        // Optionally show a success message to the user
      })
      .catch((error) => {
        console.error('Error sending sign-in link:', error);
        setError('Error sending sign-in link. Please try again.');
      });
  };

  const handleCreateAccount = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (password !== 'AA2024') {
      setError('Incorrect password. Please enter the correct code.');
      return;
    }

    setCreatingAccount(true);

    // Call createAccountWithEmail with the provided email and password
    createAccountWithEmail(email, password)
      .then(() => {
        setAccountCreated(true);
        // Send sign-in link after account creation
        sendSignInEmailLink(email)
          .then(() => {
            console.log('Sign-in link sent to email:', email);
            // Optionally show a success message to the user
          })
          .catch((error) => {
            console.error('Error sending sign-in link:', error);
            setError('Error sending sign-in link. Please try again.');
          });
      })
      .catch((error) => {
        console.error('Error creating user account:', error);
        setError('An error occurred while creating the user account. Please try again.');
      })
      .finally(() => {
        setCreatingAccount(false);
      });
  };

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
        {/* Form to handle account creation */}
        <form onSubmit={handleCreateAccount} className="flex flex-col items-center space-y-6">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navyblue"
          />

          {/* Password Input (Only for creating account) */}
          {!accountCreated && (
            <input
              type="password"
              placeholder="Enter password (AA2024)"
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
