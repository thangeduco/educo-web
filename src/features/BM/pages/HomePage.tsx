// src/features/BM/pages/HomePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../app/context/UserContext';
import Header from '../../../app/layout/Header';
import Footer from '../../../app/layout/Footer';
import styles from './HomePage.module.css';
import { Quote, TrendingUp, CheckCircle2, Images } from 'lucide-react';

import HomeQAs from '../components/home/home_qas';
import HomeImageSlides from '../components/home/home_image_slides';
import { UserRole } from '../components/home/RoleGreeting';

import BMHomeProductsTable, {
  SelectedProduct,
} from '../components/home/BMHomeProductsTable';

import { useHomeQAs } from '../hooks/useHomeQAs';
import { useHomeImageSlides } from '../hooks/useHomeImageSlides';
import { useProductService } from '../hooks/useProductService';
import type { BMProductDtoList } from '../model/BMProductDto';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const role: UserRole = (user?.role as UserRole) || null;

  // PHẦN 1 – Q&A (Trăn trở của phụ huynh)
  const { qas, loading: qasLoading, error: qasError } = useHomeQAs();

  // PHẦN 2 – Image Slides (Evidence: Educo đã đồng hành thế nào)
  const {
    slides,
    loading: slidesLoading,
    error: slidesError,
    currentIndex,
    goToPrev,
    goToNext,
  } = useHomeImageSlides();

  // Lấy meta text từ slide hiện tại (data-driven, fallback bằng text mặc định)
  const currentSlide: any =
    Array.isArray(slides) && slides.length > 0
      ? (slides as any)[currentIndex] || (slides as any)[0]
      : null;

  const evidenceTitle: string =
    currentSlide?.section_title ||
    currentSlide?.headline ||
    currentSlide?.title ||
    'Educo đã đồng hành cùng các gia đình như thế nào?';

  const evidenceSubtitle: string =
    currentSlide?.section_subtitle ||
    currentSlide?.description ||
    currentSlide?.body ||
    'Một vài hành trình thực tế mà Educo đã cùng con và bố mẹ đi qua – từ những nỗi lo ban đầu đến kết quả học tập rõ ràng.';

  // Stats (nếu backend có stat_x_value / stat_x_label thì dùng, không thì fallback)
  const stat1Value: string =
    currentSlide?.stat_1_value || '95%';
  const stat1Label: string =
    currentSlide?.stat_1_label || 'Học sinh tiến bộ rõ rệt';

  const stat2Value: string =
    currentSlide?.stat_2_value || (slides?.length ? `${slides.length}+` : '300+');
  const stat2Label: string =
    currentSlide?.stat_2_label || 'Gia đình đã đồng hành cùng Educo';

  const stat3Value: string =
    currentSlide?.stat_3_value || '4.9/5';
  const stat3Label: string =
    currentSlide?.stat_3_label || 'Đánh giá tin tưởng từ phụ huynh';

  // PHẦN 3 – Danh sách khoá học
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProductService();

  const bmProductList: BMProductDtoList = Array.isArray(products)
    ? products
    : (products as any)?.data ?? [];

  const handleProductSelect = (selected: SelectedProduct) => {
    const { product } = selected;

    if (!product.product_code) {
      console.warn('[HomePage] product.product_code is missing', product);
      return;
    }

    navigate(`/preview/products/${product.product_code}`, {
      state: {
        product: product,
      },
    });
  };

  const totalCourses = bmProductList?.length || 0;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContent}>
        {/* 1. PHỤ HUYNH BƯỚC VÀO VỚI TRĂN TRỞ + Q&A */}
        <section className={`${styles.section} ${styles.qaSection}`}>
          <div className={styles.sectionHeader}>
            <CheckCircle2 size={20} className={styles.headerIcon} />
            Thấu hiểu trăn trở của Ba Mẹ
          </div>
          <p className={styles.sectionSubHeader}>
            Mỗi gia đình đều có một nỗi lo riêng: con học mãi không vào, sợ
            Toán, mất gốc hay thiếu động lực... Hãy trả lời vài câu hỏi
            <strong> Có / Không</strong> để Educo hiểu điều đang khiến bố mẹ đau đáu
            nhất hiện tại.
          </p>
          <div className={styles.blockFull}>
            <HomeQAs
              role={role}
              qas={qas}
              loading={qasLoading}
              error={qasError}
            />
          </div>
        </section>

        {/* 2. EVIDENCE: EDUCO ĐÃ ĐỒNG HÀNH NHƯ THẾ NÀO */}
        <section className={styles.evidenceSection}>
          <div className={styles.sectionHeaderInline}>
            <Images size={20} className={styles.headerIcon} />
            <span>Educo đã đồng hành cùng các gia đình như thế nào?</span>
          </div>

          <div className={styles.introGrid}>
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

            <div className={styles.introTextWrap}>
              <h2 className={styles.introTitle}>{evidenceTitle}</h2>
              <p className={styles.introDesc}>{evidenceSubtitle}</p>

              <div className={styles.introStats}>
                <div className={styles.statItem}>
                  <strong>{stat1Value}</strong>
                  <span>{stat1Label}</span>
                </div>
                <div className={styles.statItem}>
                  <strong>{stat2Value}</strong>
                  <span>{stat2Label}</span>
                </div>
                <div className={styles.statItem}>
                  <strong>{stat3Value}</strong>
                  <span>{stat3Label}</span>
                </div>
              </div>
              <p className={styles.introHint}>
                Mỗi slide là một câu chuyện thật: bắt đầu từ trăn trở của bố mẹ,
                và kết thúc bằng sự thay đổi rõ rệt trong việc học của con.
              </p>
            </div>
          </div>
        </section>

        {/* 3. PRODUCTS – LỘ TRÌNH HỌC CỤ THỂ */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <TrendingUp size={20} className={styles.headerIcon} />
            Lựa chọn lộ trình học phù hợp nhất cho con
          </div>
          <p className={styles.sectionSubHeader}>
            Dựa trên những trăn trở của bố mẹ, Educo thiết kế{' '}
            <strong>{totalCourses}</strong> lộ trình học khác nhau để phù hợp
            với từng điểm xuất phát và mục tiêu của con.
          </p>

          <div className={styles.blockFull}>
            {productsLoading && (
              <div className={styles.statusText}>
                Đang tải danh sách khoá học...
              </div>
            )}
            {productsError && !productsLoading && (
              <div className={styles.errorText}>
                Có lỗi khi tải khoá học: {productsError}
              </div>
            )}

            <div className={styles.tableResponsiveWrapper}>
              <BMHomeProductsTable
                products={bmProductList}
                onProductSelect={handleProductSelect}
              />
            </div>
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

      <Footer />
    </div>
  );
};

export default HomePage;
