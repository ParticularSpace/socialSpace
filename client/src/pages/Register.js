import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ADD_USER } from '../graphql/mutations';

export function Register() {
  const navigate = useNavigate();  // Initialize useNavigate
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
    <div className="flex items-center justify-center mt-32">
      <div className="bg-gray-700 p-8 rounded-lg w-80">
        <h1 className="text-white text-2xl font-semibold mb-4">Register</h1>
        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}  {/* Display error message */}
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
          <input 
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
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

export default Register;
