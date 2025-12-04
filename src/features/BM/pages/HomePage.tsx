// src/features/edu/pages/HomePage/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../app/context/UserContext';
import Header from '../../../app/layout/Header';
import Footer from '../../../app/layout/Footer';
import styles from './HomePage.module.css';
import { Quote, TrendingUp, Images } from 'lucide-react';

import HomeQAs from '../components/home/home_qas';
import HomeImageSlides from '../components/home/home_image_slides';
import { UserRole } from '../components/home/RoleGreeting';

import BMHomeProductsTable, {
  SelectedProduct,
} from '../components/home/BMHomeProductsTable';

import { useHomeQAs } from '../hooks/useHomeQAs';
import { useHomeImageSlide } from '../hooks/useHomeImageSlide';
import { useHomeCourses } from '../hooks/useHomeCourses';
import { useHomeArchievement } from '../hooks/useHomeArchievement';

import { HomePageCoursesDto } from '../model/home-page-param.dto';
import ChatWidget from '../components/chat/ChatWidget';
import LoginForm from '../components/users/LoginForm';
import RegisterForm from '../components/users/RegisterForm';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const role: UserRole = (user?.role as UserRole) || null;

  // Popup đăng nhập
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  // Popup đăng ký
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

  // Toast thông báo đăng ký thành công
  const [showRegisterSuccessToast, setShowRegisterSuccessToast] =
    useState(false);

  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  const openRegisterPopup = () => setIsRegisterPopupOpen(true);
  const closeRegisterPopup = () => setIsRegisterPopupOpen(false);

  const handleRegisterSuccess = () => {
    // Đóng popup đăng ký
    closeRegisterPopup();

    // Bật toast thông báo đăng ký thành công + auto-login đã được xử lý trong registerUser
    setShowRegisterSuccessToast(true);
    setTimeout(() => {
      setShowRegisterSuccessToast(false);
    }, 4000);
  };

  // 1 – Q&A (Trăn trở của phụ huynh)
  const { qas, loading: qasLoading, error: qasError } = useHomeQAs();

  // 2 – Image Slides
  const {
    slides,
    loading: slidesLoading,
    error: slidesError,
    currentIndex,
    goToPrev,
    goToNext,
  } = useHomeImageSlide();

  // 2 – Thành tựu của Educo
  const {
    achievement,
    loading: achievementLoading,
    error: achievementError,
  } = useHomeArchievement();

  // 3 – Danh sách khoá học
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useHomeCourses();

  const homeCourseList: HomePageCoursesDto = Array.isArray(courses)
    ? courses
    : [];

  const handleProductSelect = (selected: SelectedProduct) => {
    const { product } = selected;
    const courseCode = (product as any).courseCode;

    if (!courseCode) {
      console.warn(
        '[HomePage] courseCode is missing on selected product',
        product
      );
      return;
    }

    navigate(`/preview/products/${courseCode}`, {
      state: {
        product,
      },
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Toast đăng ký thành công (hiện trên cùng, tự tắt) */}
      {showRegisterSuccessToast && (
        <div className={styles.toastContainer}>
          <div className={styles.toastSuccess}>
            🎉 Đăng ký thành công! Hệ thống đã tự động đăng nhập cho bạn.
          </div>
        </div>
      )}

      {/* Header nhận onLoginClick & onRegisterClick để mở popup */}
      <Header
        onLoginClick={openLoginPopup}
        onRegisterClick={openRegisterPopup}
      />

      <main className={styles.mainContent}>
        {/* 1. Q&A */}
        <section className={`${styles.section} ${styles.qaSection}`}>
          <div className={styles.blockFull}>
            <HomeQAs
              role={role}
              qas={qas}
              loading={qasLoading}
              error={qasError}
            />
          </div>
        </section>

        {/* 2. EVIDENCE: TRÁI = THÀNH TỰU (2/5) – PHẢI = SLIDE (3/5) */}
        <section className={styles.evidenceSection}>
          <div className={styles.sectionHeaderInline}>
            <Images size={20} className={styles.headerIcon} />
            <span>Educo đã đồng hành cùng các gia đình như thế nào?</span>
          </div>

          <div className={styles.introGrid}>
            {/* Trái: Thành tựu của Educo (2/5) */}
            <div className={styles.achievementWrapper}>
              {achievementLoading && (
                <div className={styles.statusText}>
                  Đang tải thông tin thành tựu...
                </div>
              )}

              {achievementError && !achievementLoading && (
                <div className={styles.errorText}>
                  Có lỗi khi tải thông tin thành tựu: {achievementError}
                </div>
              )}

              {!achievementLoading && !achievementError && achievement && (
                <div className={styles.achievementCard}>
                  {achievement.intro && (
                    <p className={styles.achievementIntro}>
                      {achievement.intro}
                    </p>
                  )}

                  {achievement.highlights &&
                    achievement.highlights.length > 0 && (
                      <ul className={styles.achievementList}>
                        {achievement.highlights.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}

                  {achievement.note && (
                    <p className={styles.achievementNote}>
                      {achievement.note}
                    </p>
                  )}
                </div>
              )}

              {!achievementLoading && !achievementError && !achievement && (
                <div className={styles.statusText}>
                  Chưa có thông tin thành tựu để hiển thị.
                </div>
              )}
            </div>

            {/* Phải: Image Slides (3/5) */}
            <div className={styles.introImageWrapper}>
              <HomeImageSlides
                slides={slides}
                loading={slidesLoading}
                error={slidesError}
                currentIndex={currentIndex}
                goToPrev={goToPrev}
                goToNext={goToNext}
              />
            </div>
          </div>
        </section>

        {/* 3. PRODUCTS – LỘ TRÌNH HỌC CỤ THỂ */}
        <section className={`${styles.section} ${styles.productsSection}`}>
          <div className={styles.sectionHeader}>
            <TrendingUp size={20} className={styles.headerIcon} />
            Lựa chọn khoá học phù hợp nhất cho con
          </div>

          <div className={styles.blockFull}>
            {coursesLoading && (
              <div className={styles.statusText}>
                Đang tải danh sách khoá học...
              </div>
            )}
            {coursesError && !coursesLoading && (
              <div className={styles.errorText}>
                Có lỗi khi tải khoá học: {coursesError}
              </div>
            )}

            {!coursesLoading && !coursesError && (
              <div className={styles.tableResponsiveWrapper}>
                <BMHomeProductsTable
                  products={homeCourseList}
                  onProductSelect={handleProductSelect}
                />
              </div>
            )}

            <div className={styles.mobileHint}>
              ← Vuốt ngang để xem thêm thông tin từng khoá →
            </div>
          </div>
        </section>

        {/* 4. TRIẾT LÝ & LỜI TỰA TỪ CEO */}
        <section className={styles.founderSection}>
          <div className={styles.founderContent}>
            <Quote size={50} className={styles.quoteIcon} />
            <h2 className={styles.founderPhilosophyTitle}>
              Triết lý đồng hành cùng con và gia đình
            </h2>
            <blockquote className={styles.philosophyQuote}>
              "Tôi tin rằng mỗi đứa trẻ đều có một tiềm năng riêng, chỉ là có
              được dẫn dắt đúng cách hay không. Educo không đơn thuần là một
              khoá học Toán, mà là một hành trình: thấu hiểu trăn trở của bố
              mẹ, đồng hành cùng con từng bước nhỏ, và kiên trì cùng gia đình
              cho đến khi nhìn thấy sự tự tin thật sự trong ánh mắt của các em.
              Sự tiến bộ của con bạn chính là thước đo thành công của chúng
              tôi."
            </blockquote>
            <div className={styles.founderInfo}>
              <div className={styles.founderName}>Đào Đức Thăng</div>
              <div className={styles.founderTitle}>
                Nhà sáng lập & CEO Educo
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* POPUP ĐĂNG NHẬP */}
      {isLoginPopupOpen && (
        <div className={styles.loginModalBackdrop}>
          <div className={styles.loginModalContent}>
            <div className={styles.loginModalHeader}>
              <div className={styles.loginModalTitle}>Đăng nhập tài khoản</div>
              <button
                type="button"
                className={styles.loginModalCloseButton}
                onClick={closeLoginPopup}
                aria-label="Đóng đăng nhập"
              >
                ×
              </button>
            </div>
            <div className={styles.loginModalBody}>
              <LoginForm
                onLoginSuccess={() => {
                  closeLoginPopup();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* POPUP ĐĂNG KÝ */}
      {isRegisterPopupOpen && (
        <div className={styles.registerModalBackdrop}>
          <div className={styles.registerModalContent}>
            <div className={styles.registerModalHeader}>
              <div className={styles.registerModalTitle}>Đăng ký tài khoản mới</div>
              <button
                type="button"
                className={styles.registerModalCloseButton}
                onClick={closeRegisterPopup}
                aria-label="Đóng đăng ký"
              >
                ×
              </button>
            </div>
            <div className={styles.registerModalBody}>
              <RegisterForm
                defaultRole="parent"
                onRegisterSuccess={handleRegisterSuccess}
              />
            </div>
          </div>
        </div>
      )}

      <ChatWidget />
      <Footer />
    </div>
  );
};

export default HomePage;
