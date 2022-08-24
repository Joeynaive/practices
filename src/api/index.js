const tableListDataSource = [];

export function getUserData(page, perPage) {
  return new Promise((resolve, reject) => {
    const userData = [];
    for (let i = 0; i < perPage; i++) {
      const index = (page - 1) * 10 + i + 1;
      userData.push({
        uid: index,
        userName: `tom${index}`,
        phoneNumber: `11222${index}`,
        email: `${index}032@google.com`
      });
    }
    setTimeout(() => {
      return resolve({
        data: {
          code: 0,
          message: 'ok',
          data: userData,
          total: 20,
          page,
          perPage,
        }
      })
    }, 100);
  })
}

export function getUserInfo(uid) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
        data: {
          code: 0,
          message: 'ok',
          data: {
            uid: uid,
            userName: `tom${uid}`,
            phoneNumber: `11222${uid}`,
            email: `${uid}032@google.com`
          }
        }
      })
    })
  })
}

export function putUserInfo({ uid, userName, phoneNumber, email, switchButton, radio, checkBox, picker, input, select }) {
  return new Promise((resolve, reject) => {
    const userData = [];
    userData.map(item => {
      if (item.uid === uid) {
        item.userName = userName;
        item.phoneNumber = phoneNumber;
        item.email = email;
        item.switchButton = switchButton;
        item.radio = radio;
        item.checkBox = checkBox;
        item.picker = picker;
        item.input = input;
        item.select = select;
      } else {
        return;
      }
    });
    setTimeout(() => {
      return resolve({
        data: {
          code: 200,
          data: userData,
          message: 'ok',
        }
      })
    }, 100);
  })
}

export function postUserInfo({ userName, phoneNumber, email, switchButton, radio, checkBox, picker, input, select }) {
  return new Promise((resolve, reject) => {
    const userData = [];
    userData.push({
      userName,
      phoneNumber,
      email,
      switchButton,
      radio,
      checkBox,
      picker,
      input,
      select,
    })
    setTimeout(() => {
      return resolve({
        data: {
          code: 200,
          message: 'ok',
        }
      })
    }, 100);
  })
}

export function deleteUserData({selectKeys}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
        data: {
          code: 200,
          message: 'ok',
        }
      })
    }, 100);
  })
}