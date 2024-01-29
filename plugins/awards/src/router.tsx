import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AwardsListPage } from './components/AwardsListPage';
import { AwardsEditPage, AwardsNewPage, AwardsViewPage } from './components';

export const AwardsRouter = () => (
  <Routes>
    {/* awards.routes.root will take the user to this page */}
    <Route path="/" element={<AwardsListPage />} />
    <Route path="/new" element={<AwardsNewPage />} />
    <Route path="/edit/:uid" element={<AwardsEditPage />} />
    <Route path="/view/:uid" element={<AwardsViewPage />} />
  </Routes>
);