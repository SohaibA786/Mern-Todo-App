import React, { useEffect, useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  const [profile, setProfile] = useState(JSON.parse(sessionStorage.getItem('profile')) || null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      sessionStorage.setItem('user', JSON.stringify(codeResponse));
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    const getUser = async () => {
      if (user && user.access_token) {
        try {
          const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          });
          try {
            await axios.post('https://mern-todo-server-sohaib.vercel.app/user', {
              email: response.data.email,
            })
          } catch (error) {
            console.log("Error occured while logging user in", error.message)
          }

          setProfile(response.data);
          sessionStorage.setItem('profile', JSON.stringify(response.data));
        } catch (error) {
          console.log(error);
        }
      }
    }
    getUser();
  }, [user])

  const logout = () => {
    googleLogout();
    
    sessionStorage.removeItem('profile');
    sessionStorage.removeItem('user');
    setProfile(null);
    setUser(null);
  };

  return (
    <>
      {
        !user?.access_token ? (
          <header>
            <button
              onClick={login}
              style={{ margin: "auto" }}
              className='login-button'
            >
              Login <img src='https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' height={20} alt='Google logo' />
            </button>
          </header>
        ) : (
          <>
            <header>
              <button
                onClick={logout}
                className='login-button'
              >
                Logout <img src='https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png' height={20} alt='Google logo' />
              </button>
              <img
                src={profile?.picture}
                alt='profile pic'
                className='profile'
              />
            </header>
          </>
        )
      }

      <div className='todo-app'>
        <TodoList profile={profile} />
      </div>

      <footer>
        <p>Copyright © MERN TODO 2023. All rights reserved.</p>
        <p>Made with 🤍 by <a target='_blank' href="https://linkedin.com/in/engr-sohaib">Engr. Sohaib</a></p>
      </footer>

    </>
  );
}

export default App;
