import { useState } from 'react';
import { Pressable as RNPressable } from 'react-native';

// removes sticky `active:` classes and gives a light, always-resetting press feedback
const strip = (c) =>
  typeof c === 'string' ? c.replace(/\bactive:\S+/g, '').replace(/\s+/g, ' ').trim() : c;

const Pressable = ({ className, style, disabled, plain = false, onPressIn, onPressOut, ...props }) => {
  const [down, setDown] = useState(false);
  return (
    <RNPressable
      {...props}
      disabled={disabled}
      className={strip(className)}
      style={[style, down && !disabled && !plain ? { opacity: 0.9 } : null]}
      onPressIn={(e) => { setDown(true); onPressIn?.(e); }}
      onPressOut={(e) => { setDown(false); onPressOut?.(e); }}
    />
  );
};

export default Pressable;