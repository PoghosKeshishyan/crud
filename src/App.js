import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { ClientPage } from './pages/ClientPage';
import { DetailPage } from './pages/DetailPage';
import { SendEmailPage } from './pages/SendEmailPage';
import axios from './axios';

export function App() {
  const [header, setHeader] = useState({});

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    const response = await axios.get('header');
    setHeader(response.data);
  }

  return (
    <div className='App'>
      <Header header={header} />

      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/client/:id' element={<ClientPage />} />
          <Route path='/client/:id/:month' element={<DetailPage />} />
          <Route path='/client/:id/:month/:week/result' element={<SendEmailPage />} />
        </Routes>
      </main>
    </div>
  )
}
