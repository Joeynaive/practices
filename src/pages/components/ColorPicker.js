import React, { useState } from 'react';
import { Button } from 'antd';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  function onChangeColor(_color) {
    onChange && onChange(_color.hex);
  }

  return (
    <>
      <Button style={{ backgroundColor: value }} onClick={() => setShowPicker(true)}> 点我更换颜色 </Button>
      {showPicker ? (
        <div className="pick-background-color__popover">
          <div className="pick-background-color__cover" onClick={() => setShowPicker(false)} />
          <SketchPicker color={value} onChange={onChangeColor} />
        </div>
      ) : null}
    </>
  )
}

export default ColorPicker;