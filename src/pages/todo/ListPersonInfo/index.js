import React, { useState } from 'react';
import { useMount } from 'ahooks';
import { Modal, Input, Table, Button, Pagination, message } from 'antd';
import  ModalAddPersonInfo  from '../ModalAddPersonInfo';
import { getUserData, deleteUserData } from '../../../api';

import './index.css';

const { Search } = Input;

const ListPersonInfo = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState();
  const [visible, setVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageTotal, setPageTotal] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [uid, setUid] = useState(0);

  useMount(() => {
    fetchUserData(pageNumber, pageSize);
  })

  function fetchUserData(current, perPage) {
    getUserData(current, perPage).then(res=> {
      setDataSource(res?.data?.data);
      setPageNumber(res?.data?.page);
      setPageTotal(res?.data?.total);
      setPageSize(res?.data?.perPage);
    })
  }

  function onChangePagination(pNumber, pSize) {
    setPageNumber(pNumber);
    fetchUserData(pNumber, pSize);
  }

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
          <div onClick={() => edit(record)} style={{ cursor: 'pointer'}}><a>编辑</a></div>
        )
      },
    },
    {
      title: '删除',
      render: (_, record) => <div onClick={() => handleDelete(record)} style={{ cursor: 'pointer'}}><a>删除</a></div>,
    },
  ];

  function handleDelete(record) {
    Modal.confirm({
      title: `确定删除${record.userName || ''} ？`,
      onOk: () => {
        const newData = dataSource.filter((item) => item.uid !== record.uid);
        setDataSource(newData);
      },
    });
  };

  function edit(record) {
    setVisible(true);
    setUid(record.uid);
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  function deleteSelect() {
    deleteUserData(selectedRowKeys).then(res => {
      message.success('删除成功');
      setSelectedRowKeys([]);
      fetchUserData(pageNumber, pageSize);
    }).catch(() => {})
  }

  function reset() {
    fetchUserData(1, pageSize);
  }

  function search(value) {
    if (value !== '') {
      const newData = dataSource.filter((item) => item.userName === value);
      setDataSource(newData);
    }
  }

  return (
    <div className='list-person-info'>
      <div className='list-person-info__header'>
        <Search placeholder="请输入姓名" allowClear onSearch={search} style={{ width: 200 }} />
        <Button className='list-person-info__header-btn' onClick={reset}>
          重置
        </Button>
        <Button className='list-person-info__header-btn' type="primary" onClick={deleteSelect}>
          删除
        </Button>
      </div>
      <Table 
        size='small'
        rowKey="uid"
        pagination={false}
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={dataSource} 
      />
      <Pagination 
        className='list-person-info__pagination'
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
      <ModalAddPersonInfo 
        type='edit' 
        uid={uid} 
        visible={visible} 
        close={() => setVisible(false)} 
      />
    </div>
  );
};

export default ListPersonInfo;