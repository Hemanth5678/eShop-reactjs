import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Service.module.scss';

const cx = classNames.bind(styles);

const Service = ({ link = '', url = '', Icon, title, desc }) => {
  return (
    <div className={cx('box')}>
      <div className={cx('icon')}>
        <Icon />
      </div>
      <div className={cx('detail')}>
        <h3 className={cx('title')}>
          {link && <a href={link}>{title}</a>}
          {url && <Link to={url}>{title}</Link>}
        </h3>
        <p className={cx('desc')}>{desc}</p>
      </div>
    </div>
  );
};

export default Service;
