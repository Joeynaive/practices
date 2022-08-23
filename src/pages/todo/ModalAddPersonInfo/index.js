import React from 'react';
import { Form, Input, message } from 'antd';
import { phoneNumberReg, emailReg } from '../../../consts/reg';
import { getUserInfo, postUserInfo, postUser } from '../../../api';
import CommonModal from '../../../components/CommonModal';

import './index.css';

const { TextArea } = Input;

const ModalAddPersonInfo = (props) => {
  const [form] = Form.useForm();

  const { 
    visible, 
    close, 
    onClose, 
    onSubmitSuccess, 
    uid, 
    type 
  } = props;

  function onCloseModal() {
    form.setFieldsValue({
      userName: '',
      phoneNumber: '',
      email: '',
      personInfo: '',
    })
  };

  function onOpen() {
    if(type === 'edit') {
      getUserInfo(uid).then((res) => {
        const { userName = '', phoneNumber = '', email = '' } = res?.data?.data;
        form.setFieldsValue({
          userName,
          phoneNumber,
          email,
        });
      }).catch(() => {});
    }
  };

  function clickOk() {
    form.validateFields().then(values =>{
      if (type === 'add') {
        postUser({
          userName: values.userName, 
          phoneNumber: values.phoneNumber, 
          email: values.email
        }).then(() => {
          message.success('提交成功');
          close();
          onSubmitSuccess && onSubmitSuccess();
        }).catch(() => {
          message.error('提交失败');
        }).finally(() => {
          onClose && onClose();
        })
      } else {
        postUserInfo({
          uid: values.uid, 
          userName: values.userName, 
          phoneNumber: values.phoneNumber, 
          email: values.email
        }).then(() => {
          message.success('编辑成功');
          close();
          onSubmitSuccess && onSubmitSuccess();
        }).catch(() => {
          message.error('编辑失败');
        }).finally(() => {
          onClose && onClose();
        });
      }
    });
  };

  function clickCancel() {
    close();
    form.setFieldsValue({
      userName: '',
      phoneNumber: '',
      email: '',
      personInfo: '',
    })
  };

  return (
    <CommonModal
      title={type === 'add' ? '请填写您的个人信息' : '请修改您的个人信息'}
      wrapClassName='modal-add'
      okText='确定'
      cancelText='取消'
      visible={visible}
      onOk={clickOk}
      onCancel={clickCancel}
      onOpen={onOpen}
      onClose={onCloseModal}
    >
      <Form form={form} layout='vertical' >
        <Form.Item
          name='userName'
          label='姓名'
          required
          rules={[
            { required: true, message: '请输入您的姓名'}
          ]}>
          <Input placeholder='请输入您的姓名'/>
        </Form.Item>
        <Form.Item
          name='phoneNumber'
          label='手机号'
          required
          rules={[
            { required: true, message: '请输入您的手机号'},
            { pattern: phoneNumberReg, message: '请输入正确的手机号'}
          ]}>
          <Input placeholder='请输入您的手机号'/>
        </Form.Item>
        <Form.Item
          name='email'
          label='邮箱'
          rules={[
            { pattern: emailReg, message: '请输入正确的邮箱格式' }
          ]}>
          <Input placeholder='请输入您的姓名'/>
        </Form.Item>
        <Form.Item name='personInfo' label='个人介绍' >
          <TextArea rows={4} placeholder='请输入' />
        </Form.Item>
      </Form>
    </CommonModal>
  );
};

export default ModalAddPersonInfo;