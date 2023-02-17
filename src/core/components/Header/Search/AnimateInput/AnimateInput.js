import { useState, useEffect, forwardRef } from 'react';

const AnimateInput = (props, ref) => {
  const initPlaceHolder = 'What do you want to search?';
  const [placeholder, setPlaceholder] = useState(initPlaceHolder.slice(0, 0));
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intr = setInterval(() => {
      setPlaceholder(initPlaceHolder.slice(0, placeholderIndex));
      if (placeholderIndex + 1 > initPlaceHolder.length) {
        setPlaceholderIndex(0);
      } else {
        setPlaceholderIndex(placeholderIndex + 1);
      }
    }, 50);
    return () => {
      clearInterval(intr);
    };
  });

  return (
    <input
      ref={ref}
      className="h-10 w-[190px] md:w-96 px-5 text-slate-400 outline-none caret-pink-500"
      type="text"
      placeholder={placeholder}
    />
  );
};

export default forwardRef(AnimateInput);
