import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../app/layout/Header';
import Footer from '../../../app/layout/Footer';
import styles from './ProductPreviewPage.module.css';
import { useProductDetail } from '../hooks/useProductDetail';
import type { ProductSaleKitDto } from '../model/BMProductDto';
import LoginForm from '../components/users/LoginForm';
import RegisterForm from '../components/users/RegisterForm';

const ProductPreviewPage: React.FC = () => {
  const { productCode: productCodeParam } = useParams<{ productCode: string }>();
  const productCode = productCodeParam || '';
  const navigate = useNavigate();

  const { product, loading, error } = useProductDetail(productCode);

  // ===== POPUP ĐĂNG NHẬP =====
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  // ===== POPUP ĐĂNG KÝ =====
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const openRegisterPopup = () => setIsRegisterPopupOpen(true);
  const closeRegisterPopup = () => setIsRegisterPopupOpen(false);

  const saleKit: ProductSaleKitDto | null = product?.saleKit ?? null;

  const learningSection = saleKit?.learningSection ?? null;
  const parentSupportSection = saleKit?.parentSupportSection ?? null;
  const pricingSection = saleKit?.pricingSection ?? null;
  const successStories = saleKit?.successStories ?? [];

  const title =
    product?.productName ||
    product?.productCode ||
    productCode ||
    'Chi tiết khoá học';

  const heroSubtitle =
    (product?.metadataJson as any)?.heroSubtitle ||
    'Khoá học được thiết kế để đồng hành cùng con và bố mẹ, từ nỗi lo hiện tại đến kết quả học tập rõ ràng sau từng giai đoạn.';

  const parentConcernLabel =
    (product?.metadataJson as any)?.parentConcernLabel ||
    'Dành cho những bố mẹ đang trăn trở về nền tảng và cảm xúc học tập của con.';

  const handleRegisterClick = () => {
    if (!productCode) {
      console.warn('Không có productCode để điều hướng sang SubscriptionPage');
      return;
    }

    navigate(`/subscription/${productCode}`, {
      state: {
        product,
        from: 'ProductPreviewPage',
      },
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header truyền cả onLoginClick & onRegisterClick để mở popup giống HomePage */}
      <Header
        onLoginClick={openLoginPopup}
        onRegisterClick={openRegisterPopup}
      />

      <main className={styles.mainContent}>
        <section className={styles.section}>
          {/* HERO */}
          <div className={styles.heroHeader}>
            <div className={styles.breadcrumb}>
              Hành trình của con / <span>{title}</span>
            </div>
            <h1 className={styles.sectionHeader}>{title}</h1>
            <p className={styles.heroSubtitle}>{heroSubtitle}</p>
            <p className={styles.heroConcern}>{parentConcernLabel}</p>
          </div>

          {/* LOADING & ERROR */}
          {loading && (
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                Đang tải thông tin chi tiết khoá học...
              </span>
            </div>
          )}

          {error && !loading && (
            <div className={styles.metaRow}>
              <span className={styles.metaItemError}>{error}</span>
            </div>
          )}

          {!loading && !error && !product && (
            <div className={styles.metaRow}>
              <span className={styles.metaItemError}>
                Không tìm thấy thông tin khoá học.
              </span>
            </div>
          )}

          {/* SECTION 1 – LEARNING */}
          {learningSection && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>
                1. Con học được gì & lộ trình
              </div>
              <div className={styles.sectionInner}>
                <div className={styles.sectionImage}>
                  <img
                    src={learningSection.imageUrl}
                    alt={learningSection.title}
                    className={styles.sectionImageTag}
                  />
                </div>
                <div className={styles.sectionText}>
                  <h2 className={styles.sectionTitle}>
                    {learningSection.title}
                  </h2>
                  <ul className={styles.highlightList}>
                    {learningSection.highlights.map((h, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <span className={styles.highlightBullet}>✓</span>
                        <span className={styles.highlightText}>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {learningSection.inspirationalQuote && (
                    <p className={styles.inspirationalQuote}>
                      “{learningSection.inspirationalQuote}”
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2 – PARENT SUPPORT */}
          {parentSupportSection && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>
                2. Bố mẹ đồng hành & phần mềm dễ dùng
              </div>
              <div className={styles.sectionInner}>
                <div className={styles.sectionImage}>
                  <img
                    src={parentSupportSection.imageUrl}
                    alt={parentSupportSection.title}
                    className={styles.sectionImageTag}
                  />
                </div>
                <div className={styles.sectionText}>
                  <h2 className={styles.sectionTitle}>
                    {parentSupportSection.title}
                  </h2>
                  <ul className={styles.highlightList}>
                    {parentSupportSection.highlights.map((h, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <span className={styles.highlightBullet}>✓</span>
                        <span className={styles.highlightText}>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {parentSupportSection.inspirationalQuote && (
                    <p className={styles.inspirationalQuote}>
                      “{parentSupportSection.inspirationalQuote}”
                    </p>
                  )}
                  {parentSupportSection.guideUrl && (
                    <a
                      href={parentSupportSection.guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.guideLink}
                    >
                      Xem hướng dẫn chi tiết cho bố mẹ
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3 – PRICING */}
          {pricingSection && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>
                3. Học phí & cách đăng ký
              </div>
              <div className={styles.sectionInner}>
                <div className={styles.sectionImage}>
                  <img
                    src={pricingSection.imageUrl}
                    alt={pricingSection.title}
                    className={styles.sectionImageTag}
                  />
                </div>
                <div className={styles.sectionText}>
                  <h2 className={styles.sectionTitle}>
                    {pricingSection.title}
                  </h2>
                  <ul className={styles.highlightList}>
                    {pricingSection.highlights.map((h, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <span className={styles.highlightBullet}>✓</span>
                        <span className={styles.highlightText}>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {pricingSection.inspirationalQuote && (
                    <p className={styles.inspirationalQuote}>
                      “{pricingSection.inspirationalQuote}”
                    </p>
                  )}
                  {pricingSection.guideUrl && (
                    <a
                      href={pricingSection.guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.guideLink}
                    >
                      Xem hướng dẫn đăng ký & thanh toán
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4 – SUCCESS STORIES */}
          {successStories && successStories.length > 0 && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionLabel}>
                4. Câu chuyện thật từ học sinh đã học
              </div>
              <div className={styles.storiesSection}>
                <p className={styles.storiesIntro}>
                  Mỗi câu chuyện là một hành trình nhỏ: từ nỗi lo ban đầu của
                  gia đình, đến những chuyển biến rõ rệt trong việc học và thái
                  độ với môn Toán của con.
                </p>
                <div className={styles.storiesGrid}>
                  {successStories.map((story) => (
                    <div key={story.id} className={styles.storyCard}>
                      <div className={styles.storyAvatarWrapper}>
                        <img
                          src={story.avatarUrl}
                          alt={story.storyTitle}
                          className={styles.storyAvatar}
                        />
                      </div>
                      <div className={styles.storyBody}>
                        <h4 className={styles.storyTitle}>
                          {story.storyTitle}
                        </h4>
                        <p className={styles.storyContent}>
                          {story.storyContent}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* STICKY BOTTOM BAR */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <div className={styles.bottomBarText}>
            Sẵn sàng để con bắt đầu hành trình học tập hiệu quả hơn với Educo?
          </div>
          <div className={styles.bottomBarActions}>
            <button
              type="button"
              className={styles.registerButton}
              onClick={handleRegisterClick}
            >
              Chọn khóa học này cho con
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* POPUP ĐĂNG NHẬP – dùng loginModal* */}
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
                  // LoginForm đã set UserContext, ở đây chỉ cần đóng popup
                  closeLoginPopup();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* POPUP ĐĂNG KÝ – dùng style riêng registerModal* */}
      {isRegisterPopupOpen && (
        <div className={styles.registerModalBackdrop}>
          <div className={styles.registerModalContent}>
            <div className={styles.registerModalHeader}>
              <div className={styles.registerModalTitle}>
                Đăng ký tài khoản mới
              </div>
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
                onRegisterSuccess={() => {
                  // Đăng ký xong đã auto-login, chỉ cần đóng popup
                  closeRegisterPopup();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPreviewPage;
