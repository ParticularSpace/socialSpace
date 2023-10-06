import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADD_USER } from '../graphql/mutations';

export function Register() {
  const navigate = useNavigate();
  const [addUser] = useMutation(ADD_USER);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);  // To hold error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);  // Reset error message

    if (!username || !email || !dateOfBirth || !password || !confirmPassword) {
      setErrorMessage("All fields must be filled out");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const { data } = await addUser({
        variables: { username, email, date_of_birth: dateOfBirth, password },
      });

      const token = data.addUser.token;

      if (token) {
        localStorage.setItem('id_token', token);
        navigate('/home');  // Use navigate for client-side redirect
      } else {
        setErrorMessage("Registration successful but no token received");
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred during registration");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center md:flex-row mt-32 overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row bg-gray-700 rounded-lg w-full max-w-screen-lg">

        {/* Informational Content */}
        <div className="w-full md:w-1/2 p-8 mb-8">
          <h1 className="text-white text-3xl font-semibold mb-4">Welcome to Social Space!</h1>
          <p className="text-white text-lg mb-4">
            Create an account to connect with friends, family, and other people you know.
          </p>
          <ul className="text-white text-lg list-disc pl-8">
            <li>Share photos and updates</li>
            <li>Connect with people</li>
            <li>Discover new interests</li>
          </ul>
        </div>

        {/* Registration Form */}
        <div className="w-full md:w-1/2 p-8 bg-white rounded-r-lg">
          <h2 className="text-gray-700 text-2xl font-semibold mb-4">Register</h2>
          {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300"
            />
            <label htmlFor="dob" className="block text-black text-sm font-medium">
              Date of Birth
            </label>
            <div className="flex items-center">
              <input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 bg-white text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
              Submit
            </button>

            <br />
            <br />

            <div className="text-center">
              Already have an account?&nbsp;
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                Login
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Register;
