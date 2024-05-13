import React from 'react';
import './page.css';
import ImagemLogin from '@/components/imagemLogin/imagemLogin';
import CardLogin from '@/components/cardLogin/cardLogin';

const Login: React.FC = () => {
  return (
    <div className="app">
      <div className="w-2/5">
        <ImagemLogin />
      </div>
      <div className="right-panel">
        <CardLogin />
      </div>
    </div>
  );
};

export default Login;