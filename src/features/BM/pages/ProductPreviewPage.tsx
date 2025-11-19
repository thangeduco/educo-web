// src/features/BM/pages/ProductPreviewPage.tsx

import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../../../app/layout/Header';
import Footer from '../../../app/layout/Footer';
import styles from './ProductPreviewPage.module.css';
import type { BMProductDto } from '../model/BMProductDto';
import { useCMCourseService } from '../../CM/hooks/useCMCourseService';

interface ProductPreviewLocationState {
  product?: BMProductDto;
}

const ProductPreviewPage: React.FC = () => {
  const { productCode: productCodeParam } = useParams<{ productCode: string }>();
  const location = useLocation();
  const state = (location.state || {}) as ProductPreviewLocationState;

  const product = state.product;

  // GỌI CM COURSE
  const resolvedProductCode = product?.product_code || productCodeParam || '';
  const {
    course: cmCourse,
    loading: cmLoading,
    error: cmError,
  } = useCMCourseService(resolvedProductCode);

  if (!product) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Không tìm thấy thông tin khoá học</h2>
            <p>Vui lòng quay lại trang chủ để chọn khoá học.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // THÔNG TIN PRODUCT (BMProductDto)
  const productCode = product.product_code || productCodeParam || '';
  const productTitle = product.product_title || product.name || '';

  const tutorialVideoUrl =
    product.tutorial_video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ';

  const saleKitUrl = product.sale_kit_url || '/images/1.jpg';

  const userGuideLink = product.user_guide_link || '/huong-dan-su-dung';

  const productMeta: any = product as any;
  const courseMeta: any = cmCourse as any;

  // TEXT DYNAMIC TỪ BACKEND (NẾU CÓ)
  const heroSubtitle: string =
    productMeta?.hero_subtitle ||
    productMeta?.short_description ||
    'Khoá học này được thiết kế để đồng hành cùng con và bố mẹ, từ nỗi lo hiện tại đến kết quả học tập rõ ràng sau từng giai đoạn.';

  const parentConcernLabel: string =
    productMeta?.parent_concern_label ||
    'Dành cho những bố mẹ đang trăn trở về nền tảng và cảm xúc học tập của con.';

  // HÌNH ẢNH CỤ THỂ TỪ CMCourseDto
  const outcomeImage = cmCourse?.outcome_image_url || '/images/1.jpg';
  const planImage = cmCourse?.plan_image_url || '/images/1.jpg';
  const companionImage = cmCourse?.sol_image_url || '/images/1.jpg';

  // TITLES & DESCRIPTIONS TỪ CMCourse (NẾU CÓ)
  const outcomeTitle: string =
    courseMeta?.outcome_section_title || 'Con sẽ thay đổi như thế nào sau khoá học?';
  const outcomeDesc: string =
    courseMeta?.outcome_section_desc ||
    'Sau khoá học, con nắm vững các mảng kiến thức trọng tâm, tự tin hơn khi làm bài và hình thành thói quen học tập đều đặn.';

  const planTitle: string =
    courseMeta?.plan_section_title || 'Lộ trình học rõ ràng cho từng giai đoạn';
  const planDesc: string =
    courseMeta?.plan_section_desc ||
    'Educo chia hành trình học thành các chặng nhỏ, với tốc độ chuẩn và tốc độ linh hoạt để phù hợp với lịch sinh hoạt của từng gia đình.';

  const companionTitle: string =
    courseMeta?.companion_section_title ||
    'Trong suốt hành trình, con và bố mẹ không học một mình';
  const companionDesc: string =
    courseMeta?.companion_section_desc ||
    'Hệ thống phần mềm và giáo viên Educo liên tục cập nhật tiến độ, gửi báo cáo, nhắc học, khen thưởng và gợi ý cách để bố mẹ đồng hành cùng con.';

  const pricingTitle: string =
    productMeta?.pricing_section_title || 'Chính sách giá & cách sử dụng đơn giản';
  const pricingDesc: string =
    productMeta?.pricing_section_desc ||
    'Chi phí minh bạch, không phát sinh thêm trong suốt khoá. Bố mẹ có thể dễ dàng theo dõi tiến độ và kết quả học của con trên điện thoại.';

  // ===== CÂU CHUYỆN THÀNH QUẢ TỪ HỌC SINH (TỪ BMProductDto.success_stories) =====
  const successStories = product.success_stories || [];

  // Chunk thành từng hàng 2 học sinh
  const storyRows: typeof successStories[] = [];
  for (let i = 0; i < successStories.length; i += 2) {
    storyRows.push(successStories.slice(i, i + 2));
  }

  // HANDLERS
  const handleRegisterClick = () => {
    console.log('Đăng ký khoá học', productCode, productTitle);
    // TODO: điều hướng sang trang đăng ký / mở modal đăng ký
  };

  const handleTrialClick = () => {
    console.log('Học thử khoá học', productCode, productTitle);
    // TODO: điều hướng sang bài học thử / mở modal học thử
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        <section className={styles.section}>
          {/* HERO TIẾP NỐI TỪ HOMEPAGE */}
          <div className={styles.heroHeader}>
            <div className={styles.breadcrumb}>
              Hành trình của con / <span>{productTitle}</span>
            </div>
            <h1 className={styles.sectionHeader}>{productTitle}</h1>
            <p className={styles.heroSubtitle}>{heroSubtitle}</p>
            <p className={styles.heroConcern}>{parentConcernLabel}</p>
          </div>

          {cmLoading && (
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>Đang tải nội dung chi tiết...</span>
            </div>
          )}
          {cmError && (
            <div className={styles.metaRow}>
              <span className={styles.metaItem} style={{ color: 'red' }}>
                Lỗi khi tải nội dung chi tiết: {cmError}
              </span>
            </div>
          )}

          {/* 4 KHỐI CHÍNH: OUTCOME – LỘ TRÌNH – ĐỒNG HÀNH – GIÁ & HƯỚNG DẪN */}
          <div className={styles.previewGrid}>
            {/* OUTCOME */}
            <div className={styles.previewItem}>
              <h3 className={styles.previewTitle}>{outcomeTitle}</h3>
              <p className={styles.previewText}>{outcomeDesc}</p>
              <div className={styles.imageWrapper}>
                <img
                  src={outcomeImage}
                  alt="Kết quả học tập sau khoá học"
                  className={styles.previewImage}
                />
              </div>
            </div>

            {/* LỘ TRÌNH */}
            <div className={styles.previewItem}>
              <h3 className={styles.previewTitle}>{planTitle}</h3>
              <p className={styles.previewText}>{planDesc}</p>
              <div className={styles.imageWrapper}>
                <img
                  src={planImage}
                  alt="Lộ trình học tập và tốc độ học"
                  className={styles.previewImage}
                />
              </div>
            </div>

            {/* QUÁ TRÌNH ĐỒNG HÀNH */}
            <div className={styles.previewItem}>
              <h3 className={styles.previewTitle}>{companionTitle}</h3>
              <p className={styles.previewText}>{companionDesc}</p>
              <div className={styles.imageWrapper}>
                <img
                  src={companionImage}
                  alt="Hệ thống đồng hành cùng con và bố mẹ"
                  className={styles.previewImage}
                />
              </div>
            </div>

            {/* GIÁ & HƯỚNG DẪN */}
            <div className={styles.previewItem}>
              <h3 className={styles.previewTitle}>{pricingTitle}</h3>
              <p className={styles.previewText}>{pricingDesc}</p>
              <div className={styles.imageWrapper}>
                <img
                  src={saleKitUrl}
                  alt="Chính sách giá và hướng dẫn"
                  className={styles.previewImage}
                />
              </div>
              <a
                href={userGuideLink}
                className={styles.usageLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem hướng dẫn sử dụng phần mềm
              </a>
            </div>
          </div>

          {/* VIDEO GIỚI THIỆU */}
          <div className={styles.videoSection}>
            <h3 className={styles.previewTitle}>
              Xem nhanh về hành trình con sẽ trải nghiệm
            </h3>
            <p className={styles.previewText}>
              Video giới thiệu giúp bố mẹ hình dung cụ thể hơn cách con học trên Educo,
              từ giao diện bài học đến cách hệ thống nhắc học và ghi nhận tiến bộ.
            </p>
            <div className={styles.videoWrapper}>
              <iframe
                src={tutorialVideoUrl}
                title="Video giới thiệu khoá học"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* ===== CÂU CHUYỆN THÀNH QUẢ TỪ HỌC SINH ===== */}
          {successStories.length > 0 && (
            <div className={styles.storySection}>
              <h3 className={styles.storySectionTitle}>
                Những câu chuyện thật sau khi hoàn thành khoá học
              </h3>
              <p className={styles.storySectionDesc}>
                Mỗi câu chuyện dưới đây là một hành trình nhỏ: từ nỗi lo ban đầu của gia
                đình, đến những chuyển biến rõ rệt trong việc học và thái độ với môn Toán
                của con.
              </p>

              {storyRows.map((row, rowIndex) => (
                <div className={styles.storyRow} key={`story-row-${rowIndex}`}>
                  {row.map((s, idx) => (
                    <div
                      key={`${s.title}-${idx}`}
                      className={styles.storyCard}
                    >
                      <div className={styles.storyAvatarWrapper}>
                        <img
                          src={s.image_url || '/images/default-student-avatar.jpg'}
                          alt={s.title || 'Học sinh Educo'}
                          className={styles.storyAvatar}
                        />
                      </div>
                      <div className={styles.storyBody}>
                        <h4 className={styles.storyTitle}>{s.title}</h4>
                        <p className={styles.storyText}>{s.story}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
              className={styles.trialButton}
              onClick={handleTrialClick}
            >
              Học thử miễn phí
            </button>
            <button
              type="button"
              className={styles.registerButton}
              onClick={handleRegisterClick}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPreviewPage;
