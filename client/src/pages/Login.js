import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from "../graphql/mutations";
import Auth from '../utils/auth';

export function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

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
    <div className="flex items-center justify-center h-screen bg-[url('path/to/your/star-background.jpg')">
      <div className="bg-gray-700 p-8 rounded-lg w-80">
        <h1 className="text-white text-2xl font-semibold mb-4">Login</h1>
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
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
