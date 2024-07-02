import ReactDOM from 'react-dom/client';
import './init18n.jsx';
import init from './init';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(await init());
};

app();
