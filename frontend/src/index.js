import ReactDOM from 'react-dom/client';
import './index.css';
import './init18n.jsx';
import init from './init';
import socket from './socket';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await init(socket));
};

app();
