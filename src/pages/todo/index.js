import React from 'react';
import ListPersonInfo from './ListPersonInfo';

import 'antd/dist/antd.css';
import './index.css';

const App = () => {
  return (
    <div className="to-do-list">
      <div className="to-do-list__title">TODO-LIST</div>
      <div className="to-do-list__content">
        <ListPersonInfo />
      </div>
    </div>
  );
};

export default App;