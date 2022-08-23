import React, { useState } from 'react';
import { Form, Input, message, Select, Switch, Button, Radio } from 'antd';
import { SketchPicker } from 'react-color'
import { phoneNumberReg, emailReg } from '../../../consts/reg';
import { getUserInfo, putUserInfo, postUserInfo } from '../../../api';
import CommonModal from '../../../components/CommonModal';

import './index.css';

const { TextArea } = Input;

const radioMap = [
  {key: '0', value: 0, label: 'input'},
  {key: '1', value: 1, label: 'select'},
]

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
          email: values.email
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
          email: values.email
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

  const Picker = ({ value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);

    function onChangeColor(_color) {
      onChange?.(_color.hex);
    }

    return (
      <>
        <Button style={{ backgroundColor: `${value}`}} onClick={() => setShowPicker(true)}> 点我更换颜色 </Button>
        {showPicker ? (
          <div className="pick-background-color__popover">
            <div className="pick-background-color__cover" onClick={() => setShowPicker(false)} />
            <SketchPicker color={value || ''} onChange={onChangeColor} />
          </div>
        ) : null}
      </>
    )
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
        <Form.Item name='switch' valuePropName="checked" label='开关' >
          <Switch />
        </Form.Item>
        <Form.Item name='picker' label='颜色选择' >
          <Picker />
        </Form.Item>
        <Form.Item>
          <Radio.Group
            onChange={onChangeRadio}
            value={currentRadio}  
          >
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
              <Select.Option value="1">111</Select.Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </CommonModal>
  );
};

export default ModalAddPersonInfo;