import React, { useState } from 'react';
import { Form, Input, message, Select, Switch, Button, Radio, Checkbox } from 'antd';
import { phoneNumberReg, emailReg } from '../../../consts/reg';
import { radioMap, selectMap, checkBoxMap } from '../../../consts/person';
import { getUserInfo, putUserInfo, postUserInfo } from '../../../api';
import CommonModal from '../../../components/CommonModal';
import ColorPicker from '../../../components/ColorPicker';

import './index.css';

const { TextArea } = Input;

const ModalAddPersonInfo = (props) => {
  const [form] = Form.useForm();
  const [currentRadio, setCurrentRadio] = useState(0);
  const { 
    visible, 
    close, 
    onClose, 
    onSubmitSuccess, 
    uid, 
    type 
  } = props;

  function onCloseModal() {
    onClose && onClose();
    form.setFieldsValue({
      userName: '',
      phoneNumber: '',
      email: '',
      personInfo: '',
      picker: '',
      switch: false,
      input: '',
      radio: 0,
      checkBox: [0, 1],
    })
  }

  function onOpenModal() {
    if (type === 'edit') {
      getUserInfo(uid).then((res) => {
        const { userName = '', phoneNumber = '', email = '' } = res?.data?.data ?? {};
        form.setFieldsValue({
          userName,
          phoneNumber,
          email,
        });
      }).catch(() => {});
    }
  }

  function onClickOk() {
    form.validateFields().then(values =>{
      if (type === 'add') {
        postUserInfo({
          userName: values.userName, 
          phoneNumber: values.phoneNumber, 
          email: values.email,
          switchButton: values.switch,
          radio: values.radio,
          checkBox: values.checkBox,
          picker: values.picker,
          input: values.input,
          select: values.select,
        }).then(() => {
          message.success('提交成功');
          close();
          onSubmitSuccess && onSubmitSuccess();
        }).catch(() => {
          message.error('提交失败');
        });
      } else {
        putUserInfo({
          uid: values.uid, 
          userName: values.userName, 
          phoneNumber: values.phoneNumber, 
          email: values.email,
          switchButton: values.switch,
          radio: values.radio,
          checkBox: values.checkBox,
          picker: values.picker,
          input: values.input,
          select: values.select,
        }).then(() => {
          message.success('编辑成功');
          close();
          onSubmitSuccess && onSubmitSuccess();
        }).catch(() => {
          message.error('编辑失败');
        });
      }
    });
  }

  function onChangeRadio(e) {
    setCurrentRadio(e.target.value);
  }

  return (
    <CommonModal
      title={type === 'add' ? '请填写您的个人信息' : '请修改您的个人信息'}
      wrapClassName='modal-add'
      okText='确定'
      cancelText='取消'
      visible={visible}
      onOk={onClickOk}
      onCancel={close}
      onOpen={onOpenModal}
      onClose={onCloseModal}
    >
      <Form 
        form={form} 
        layout='vertical' 
        initialValues={{
          select: 0,
        }}
      >
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
        <Form.Item name='switch' valuePropName="checked" label='开关' >
          <Switch />
        </Form.Item>
        <Form.Item name='checkBox' label='多选' >
          <Checkbox.Group>
            {checkBoxMap.map(item => {
              return (
                <Checkbox key={item.key} value={item.value}>{item.label}</Checkbox>
              )
            })}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name='picker' label='颜色选择' >
          <ColorPicker />
        </Form.Item>
        <Form.Item name='radio'>
          <Radio.Group onChange={onChangeRadio}>
            {radioMap.map(item => {
              return (
                <Radio value={item.value} key={item.key}>{item.label}</Radio>
              )
            })}
          </Radio.Group>
        </Form.Item>
        {currentRadio === 0 && (
          <Form.Item name='input'>
            <Input placeholder='请输入'/>
          </Form.Item>
        )}
        {currentRadio === 1 && (
          <Form.Item name='select'>
            <Select>
              {selectMap.map(item => {
                return (
                  <Select.Option key={item.key} value={item.value}>{item.label}</Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        )}
      </Form>
    </CommonModal>
  );
};

export default ModalAddPersonInfo;