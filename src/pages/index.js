import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from "next/link";
import { useEffect, useState } from 'react';
import Router from "next/router";

//import axios
import axios from "axios";

//import js cookie
import Cookies from 'js-cookie';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEnable, setEnable] = useState(false);
  //define state validation
  const [validation, setValidation] = useState([]);

  const getUser = async () => {
    //send data to server
    const config = {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    };
    
    const bodyParameters = {
    //    key: "value"
    };

    await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/auth/me`,
        bodyParameters,
        config,
    )
    .then((response) => {
        //set user state
        if(response.data){
          Router.push('/dashboard');
        }
    })
    .catch((error) => {

        //assign error to state "validation"
        console.log(error)
    })
  }

  const handleSubmit = async event => {
    event.preventDefault();

    //initialize formData
    const formData = new FormData();
    //append data to formData
    formData.append('email', email);
    formData.append('password', password);

    //send data to server
    const config = {
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length",
      }
    };

    //send data to server
    await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/auth/login`, formData, config)
    .then((response) => {
        //set token on cookies
        Cookies.set('token', response.data.access_token);

        //redirect to dashboard
        Router.push('/dashboard');
    })
    .catch((error) => {

        //assign error to state "validation"
        // setValidation(error.response.data);
        console.log(error)
    })

  }

  const handleKeyUp = () => {
    if (email.length > 0 && password.length > 0) setEnable(false);
    else setEnable(true);
  };

  useEffect(() => {
    //check token
    if(Cookies.get('token')) {
      getUser()
      //redirect page dashboard
      // Router.push('/dashboard');
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-bold text-center text-gray-700">Rental</h1>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              value={email}
              onKeyUp={handleKeyUp}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              value={password}
              onKeyUp={handleKeyUp}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-4">
            <button
            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            type="submit"
            id="button-input"
            disabled={isEnable}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
