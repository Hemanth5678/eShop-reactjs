import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './BackToTop.module.scss';

import { MdKeyboardArrowUp } from 'react-icons/md';

const cx = classNames.bind(styles);

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, []);

  const listenToScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cx('back-to-top', { active: isVisible })} onClick={() => handleClickToTop()}>
      <MdKeyboardArrowUp />
    </div>
  );
};

export default BackToTop;
