import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './styles.css';
import { DataProvider } from './lib/DataContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Season from './pages/Season.jsx';
import HallOfFame from './pages/HallOfFame.jsx';
import Players from './pages/Players.jsx';
import PlayerProfile from './pages/PlayerProfile.jsx';
import { EventList, EventRecap } from './pages/Events.jsx';
import Faq from './pages/Faq.jsx';
import Shop from './pages/Shop.jsx';
import { SHOP_ENABLED } from './merch.js';

function NotFound() {
  return <div className="wrap page-head"><h1>Nothing here</h1><p><Link to="/">Back home</Link></p></div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="season" element={<Season />} />
            <Route path="season/:year" element={<Season />} />
            <Route path="hall-of-fame" element={<HallOfFame />} />
            <Route path="players" element={<Players />} />
            <Route path="players/:slug" element={<PlayerProfile />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/:id" element={<EventRecap />} />
            <Route path="faq" element={<Faq />} />
            {SHOP_ENABLED && <Route path="shop" element={<Shop />} />}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
