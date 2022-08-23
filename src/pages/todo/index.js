import React, { useState } from 'react';
import  ModalAddPersonInfo  from './ModalAddPersonInfo';
import  ListPersonInfo  from './ListPersonInfo';

import 'antd/dist/antd.css';
import './index.css';

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="to-do-list">
      <div className="to-do-list__box">
        <div className="to-do-list__box-title">TODO-LIST</div>
        <div className="to-do-list__box-content">
          <div className="to-do-list__box-content-list">
            <ListPersonInfo />
          </div>
          <div 
            className="to-do-list__box-content-btn"
            onClick={() => setVisible(true)}  
          >
            +添加
          </div>
        </div>
      </div>
      <ModalAddPersonInfo 
        type='add' 
        visible={visible} 
        close={() => setVisible(false)} 
      />
    </div>
  );
};

export default App;