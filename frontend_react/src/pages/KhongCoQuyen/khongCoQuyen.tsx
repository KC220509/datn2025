import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './khongcoquyen.module.css';

const KhongCoQuyen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>403</h1>
        <h2 className={styles.title}>Truy cập bị từ chối!</h2>
        <p className={styles.message}>
          Rất tiếc, bạn không có quyền truy cập vào trang này. 
          Vui lòng liên hệ với Quản trị viên hoặc quay lại trang chủ.
        </p>
        <button 
          className={styles.backButton} 
          onClick={() => navigate('/')}
        >
          Quay lại Trang Chủ
        </button>
      </div>
      
      <div className={styles.iconWrapper}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className={styles.lockIcon}
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0110 0v4"></path>
        </svg>
      </div>
    </div>
  );
};

export default KhongCoQuyen;