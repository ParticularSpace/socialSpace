import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from "../graphql/mutations";
import Auth from '../utils/auth';
import { Link } from 'react-router-dom';

export function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login] = useMutation(LOGIN_USER);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState }
      });

      Auth.login(data.login.token);

      if (data.login.token) {
        window.location.replace("/home");
      }
 
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-700 p-8 rounded-lg w-96 shadow-lg">
        <h1 className="text-4xl font-bold text-white mb-4">Social Space</h1>
        <p className="text-white mb-4">Welcome to your social universe!</p>
        <div className="bg-white p-4 rounded mb-4">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input 
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
            />
            <input 
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Login
            </button>
          </form>
          <div className="flex justify-between mt-4 text-sm text-black">
            <Link to="/forgot-password" className="hover:text-blue-500">
              Forgot Password?
            </Link>
            <Link to="/register" className="hover:text-blue-500">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
