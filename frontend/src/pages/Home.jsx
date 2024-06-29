import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routes.js';
import { Container, Row } from 'react-bootstrap';
import Channels from '../components/channels/Channels.jsx';
import Chat from '../components/chat/Chat.jsx';

const Home = () => {
  const navigate = useNavigate();
  // filter.loadDictionary('ru');
  // filter.loadDictionary('en');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(ROUTES.login);
    }
  }, [navigate]);

  return (
      <Container className='h-100 my-4 overflow-hidden rounded shadow'>
        <Row className='h-100 bg-white flex-md-row'>
          <Channels />
          <Chat />
        </Row>
      </Container>
  );
};

export default Home;