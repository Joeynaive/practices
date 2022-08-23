import React, { useState } from 'react';
import { useMount } from 'ahooks';
import { Modal, Input, Table, Button, Pagination, message } from 'antd';
import  ModalAddPersonInfo  from './ModalAddPersonInfo';
import { getUserData, deleteUserData } from '../../api';

import 'antd/dist/antd.css';
import './index.css';

const { Search } = Input;

const App = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState();
  const [visible, setVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageTotal, setPageTotal] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [currentEditingUid, setCurrentEditingUid] = useState(0);
  const [currentModalType, setCurrentModalType] = useState('');

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      editable: true,
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      editable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      editable: true,
    },
    {
      title: '编辑',
      render: (_, record) => {
        return (
          <div onClick={() => onClickEditButton(record)} style={{ cursor: 'pointer'}}>
            <a>编辑</a>
          </div>
        )
      },
    },
    {
      title: '删除',
      render: (_, record) => (
        <div onClick={() => onClickDeleteItem(record)} style={{ cursor: 'pointer'}}>
          <a>删除</a>
        </div>
      ),
    },
  ];

  function fetchUserData(current, perPage) {
    getUserData(current, perPage).then(res => {
      const { 
        data = [], 
        page = 1, 
        total = 0, 
        perPage = 3 
      } = res?.data ?? {};
      setDataSource(data);
      setPageNumber(page);
      setPageTotal(total);
      setPageSize(perPage);
    }).catch(() => {});
  };

  function onChangePagination(pNumber, pSize) {
    setPageNumber(pNumber);
    fetchUserData(pNumber, pSize);
  };

  function onClickDeleteItem(record) {
    Modal.confirm({
      title: `确定删除${record.userName || ''} ？`,
      onOk() {
        const newData = dataSource.filter((item) => item.uid !== record.uid);
        setDataSource(newData);
      },
    });
  };

  function onClickEditButton(record) {
    setVisible(true);
    setCurrentEditingUid(record.uid);
    setCurrentModalType('edit');
  };

  function onClose() {
    setCurrentEditingUid('');
  };

  function onClickDeleteRows() {
    deleteUserData(selectedRowKeys).then(res => {
      message.success('删除成功');
      setSelectedRowKeys([]);
      fetchUserData(pageNumber, pageSize);
    }).catch(() => {});
  };

  function onClickResetButton() {
    fetchUserData(1, pageSize);
  };

  function search(value) {
    if (value !== '') {
      const newData = dataSource.filter((item) => item.userName === value);
      setDataSource(newData);
    } else {
      fetchUserData(pageNumber, pageSize);
    }
  };

  function onClickAddButton() {
    setVisible(true);
    setCurrentModalType('add');
  }

  useMount(() => {
    fetchUserData(pageNumber, pageSize);
  });

  return (
    <div className="to-do-list">
      <div className="to-do-list__title">TODO-LIST</div>
      <div className="to-do-list__content">
        <div className='to-do-list__content-header'>
          <Search 
            placeholder="请输入姓名" 
            allowClear 
            onSearch={search} 
            style={{ width: 200 }} />
          <Button className='to-do-list__content-header-btn' onClick={onClickResetButton}>
            重置
          </Button>
          <Button className='to-do-list__content-header-btn' type="primary" onClick={onClickDeleteRows}>
            删除
          </Button>
          <Button className='to-do-list__content-header-btn' type="primary" onClick={onClickAddButton}>
            添加
          </Button>
        </div>
        <Table 
          size='small'
          rowKey="uid"
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange(newSelectedRowKeys) {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }} 
          columns={columns} 
          dataSource={dataSource}
        />
        <Pagination 
          className='to-do-list__content-pagination'
          size='small'
          current={pageNumber}
          pageSize={pageSize}
          total={pageTotal}
          onChange={onChangePagination}
          defaultCurrent={1}
          defaultPageSize={5}
          pageSizeOptions={['3', '5', '8', '10']}
          showTotal={(total) => `共${total}条`}
          showSizeChanger
          showQuickJumper
        />  
      </div>
      <ModalAddPersonInfo 
        type={currentModalType} 
        uid={currentEditingUid} 
        visible={visible} 
        close={() => setVisible(false)} 
        onClose={onClose}
        onSubmitSuccess={() => fetchUserData(pageNumber, pageSize)}
      />
    </div>
  );
};

export default App;