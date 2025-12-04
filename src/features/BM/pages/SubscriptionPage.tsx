import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../app/layout/Header';
import Footer from '../../../app/layout/Footer';
import styles from './SubscriptionPage.module.css';
import { useProductDetail } from '../hooks/useProductDetail';
import type { ProductSaleTermsDto } from '../model/BMProductDto';
import QRCode from 'react-qr-code';
import LoginForm from '../components/users/LoginForm';
import RegisterForm from '../components/users/RegisterForm';
import { User, useUser } from '../../../app/context/UserContext';
import {
  fetchChildrenOfParent,
  fetchParentsOfStudent,
} from '../../BM/api/authServiceApi';

type InfoFieldKey =
  | 'parentName'
  | 'parentPhone'
  | 'parentEmail'
  | 'parentPassword'
  | 'studentName'
  | 'studentDob'
  | 'studentGender'
  | 'studentUsername'
  | 'studentPassword';

const SubscriptionPage: React.FC = () => {
  const { productCode: productCodeParam } =
    useParams<{ productCode: string }>();
  const productCode = productCodeParam || '';

  const navigate = useNavigate();
  const { user } = useUser(); // Lấy user từ context (sau khi LoginForm / RegisterForm đăng nhập xong)

  const { product, loading, error } = useProductDetail(productCode);

  const saleTerms: ProductSaleTermsDto | null = product?.saleTerms ?? null;
  const benefits = saleTerms?.benefits ?? null;
  const support = saleTerms?.support ?? null;

  // Tên khóa học: productCode_productName (fallback)
  const courseTitle = useMemo(() => {
    if (product?.productCode && product?.productName) {
      return `${product.productCode}_${product.productName}`;
    }
    if (product?.productName) return product.productName;
    if (product?.productCode) return product.productCode;
    if (productCode) return productCode;
    return 'Khoá học Educo';
  }, [product, productCode]);

  // Dòng 1: + Khoá học: PRODUCT_CODE_PRODUCT_NAME
  const courseLineValue = useMemo(() => {
    if (product?.productCode && product?.productName) {
      return `${product.productCode}_${product.productName}`;
    }
    return courseTitle;
  }, [product, courseTitle]);

  // Thời gian học
  const durationLabel =
    product?.subscriptionPreview?.label ||
    'Thời gian học sẽ được tính từ thời điểm kích hoạt đến 31/05 năm sau';

  // Giá
  const priceLabel = useMemo(() => {
    if (!product) return '100.000 VND';
    const value = Number(product.price);
    const amount = Number.isFinite(value)
      ? value.toLocaleString('vi-VN')
      : product.price;
    return `${amount} ${product.currency || 'VND'}`;
  }, [product]);

  const benefitShortDescriptions: string[] =
    benefits?.shortDescription && Array.isArray(benefits.shortDescription)
      ? benefits.shortDescription
      : [];

  // Form state
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDob, setStudentDob] = useState('');
  const [studentGender, setStudentGender] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [activeInfoField, setActiveInfoField] = useState<InfoFieldKey | null>(
    null,
  );

  // Khoá/disable các vùng khi đã login và fill tự động
  const [parentFieldsDisabled, setParentFieldsDisabled] = useState(false);
  const [studentFieldsDisabled, setStudentFieldsDisabled] = useState(false);

  // ===== POPUP ĐĂNG NHẬP =====
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  // ===== POPUP ĐĂNG KÝ =====
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const openRegisterPopup = () => setIsRegisterPopupOpen(true);
  const closeRegisterPopup = () => setIsRegisterPopupOpen(false);

  // Cờ đánh dấu: login/register đã hoàn thành + đã auto-fill hay chưa
  const [loginCompleted, setLoginCompleted] = useState(false);
  const [autoFilledFromLogin, setAutoFilledFromLogin] = useState(false);

  // QR & subscription tạm thời
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [qrPayload, setQrPayload] = useState<string | null>(null);

  // Hoàn thành form: nếu vùng nào bị disable (do login) thì không bắt buộc mật khẩu
  const isParentSectionComplete =
    parentName.trim() &&
    parentPhone.trim() &&
    parentEmail.trim() &&
    (parentFieldsDisabled || parentPassword.trim());

  const isStudentSectionComplete =
    studentName.trim() &&
    studentDob.trim() &&
    studentGender.trim() &&
    studentUsername.trim() &&
    (studentFieldsDisabled || studentPassword.trim());

  const isFormComplete = Boolean(
    isParentSectionComplete && isStudentSectionComplete,
  );

  const toggleInfo = (field: InfoFieldKey) => {
    setActiveInfoField((current) => (current === field ? null : field));
  };

  /**
   * Callback từ popup LoginForm
   * - Đóng popup
   * - Đánh dấu loginCompleted = true, để useEffect dùng user từ context auto-fill
   */
  const handleLoginSuccessWithoutUser = () => {
    closeLoginPopup();
    setAutoFilledFromLogin(false);
    setLoginCompleted(true);
  };

  /**
   * Callback từ popup RegisterForm
   * - Đóng popup
   * - registerUser đã auto-login → user trong context đã có
   * - Đánh dấu loginCompleted = true để useEffect auto-fill
   */
  const handleRegisterSuccess = () => {
    closeRegisterPopup();
    setAutoFilledFromLogin(false);
    setLoginCompleted(true);
  };

  /**
   * Sau khi loginCompleted = true và user từ context đã có,
   * tự động:
   *  - Nếu role parent: fill Thông tin phụ huynh + lấy danh sách con
   *  - Nếu role student: fill Thông tin học sinh + lấy danh sách phụ huynh
   */
  useEffect(() => {
    if (!loginCompleted) return;
    if (autoFilledFromLogin) return;
    if (!user) return;

    // Đảm bảo chỉ chạy 1 lần cho lần login/register vừa rồi
    setAutoFilledFromLogin(true);

    const anyUser: any = user;
    const role = anyUser.role as string | undefined;
    const roles: string[] = (anyUser.roles as string[]) || [];

    const isParent = role === 'parent' || roles.includes('parent');
    const isStudent = role === 'student' || roles.includes('student');

    const fullName =
      anyUser.fullName || anyUser.name || anyUser.username || '';
    const phone =
      anyUser.phone ||
      anyUser.profile?.phone ||
      anyUser.profile?.mobile ||
      '';
    const email = anyUser.email || '';
    const username =
      anyUser.username || anyUser.userName || anyUser.login || '';

    // Nếu là phụ huynh
    if (isParent) {
      // Fill block phụ huynh
      if (fullName) setParentName(fullName);
      if (phone) setParentPhone(phone);
      if (email) setParentEmail(email);
      setParentPassword('');
      setParentFieldsDisabled(true);

      // Gọi API lấy danh sách con
      if (anyUser.id) {
        (async () => {
          try {
            const children = await fetchChildrenOfParent(anyUser.id as number);
            if (children && children.length > 0) {
              const child: any = children[0];

              const childFullName =
                child.fullName || child.name || child.username || '';
              const childUsername =
                child.username || child.userName || child.login || '';
              const childDob =
                child.profile?.dob || child.dob || child.birthDate || '';
              const childGender =
                child.profile?.gender || child.gender || '';

              if (childFullName) setStudentName(childFullName);
              if (childUsername) setStudentUsername(childUsername);
              if (childDob) setStudentDob(childDob);
              if (childGender) setStudentGender(childGender);

              setStudentFieldsDisabled(true);
            }
          } catch (e) {
            console.error(
              '[SubscriptionPage] Lỗi khi tải danh sách con của phụ huynh:',
              e,
            );
          }
        })();
      }
    }
    // Nếu là học sinh
    else if (isStudent) {
      const dob =
        anyUser.profile?.dob || anyUser.dob || anyUser.birthDate || '';
      const gender =
        anyUser.profile?.gender || anyUser.gender || '';

      // Fill block học sinh
      if (fullName) setStudentName(fullName);
      if (dob) setStudentDob(dob);
      if (gender) setStudentGender(gender);
      if (username) setStudentUsername(username);
      setStudentPassword('');
      setStudentFieldsDisabled(true);

      // Gọi API lấy danh sách phụ huynh
      if (anyUser.id) {
        (async () => {
          try {
            const parents = await fetchParentsOfStudent(anyUser.id as number);
            if (parents && parents.length > 0) {
              const parent: any = parents[0];

              const pFullName =
                parent.fullName || parent.name || parent.username || '';
              const pPhone =
                parent.phone ||
                parent.profile?.phone ||
                parent.profile?.mobile ||
                '';
              const pEmail = parent.email || '';

              if (pFullName) setParentName(pFullName);
              if (pPhone) setParentPhone(pPhone);
              if (pEmail) setParentEmail(pEmail);

              setParentFieldsDisabled(true);
            }
          } catch (e) {
            console.error(
              '[SubscriptionPage] Lỗi khi tải danh sách phụ huynh của học sinh:',
              e,
            );
          }
        })();
      }
    } else {
      // Role khác (admin, teacher, ...) → hiện tại không auto-fill thêm
      console.log(
        '[SubscriptionPage] User login không phải parent/student, bỏ qua auto-fill:',
        user,
      );
    }
  }, [loginCompleted, autoFilledFromLogin, user]);

  /**
   * TẠM THỜI generate subscriptionId + payload QR ở FE
   */
  useEffect(() => {
    if (!isFormComplete) {
      setSubscriptionId(null);
      setQrPayload(null);
      return;
    }

    if (subscriptionId) {
      return;
    }

    const generatedSubscriptionId = `SUB-${productCode || 'GEN'}-${Date.now()}`;

    const amountNumber = product ? Number(product.price) || 100000 : 100000;

    const bankAccountNumber = '0123456789';
    const bankBin = '970436';
    const bankName = 'EDUCO JSC';

    const description = `EDUCO ${courseLineValue} - ${studentName}`.slice(
      0,
      60,
    );

    const placeholderPayload = [
      'EDUCOQR',
      `BIN=${bankBin}`,
      `ACC=${bankAccountNumber}`,
      `NAME=${bankName}`,
      `AMT=${amountNumber}`,
      `CCY=${product?.currency || 'VND'}`,
      `SUB=${generatedSubscriptionId}`,
      `DESC=${description}`,
    ].join('|');

    setSubscriptionId(generatedSubscriptionId);
    setQrPayload(placeholderPayload);
  }, [
    isFormComplete,
    product,
    productCode,
    courseLineValue,
    studentName,
    subscriptionId,
  ]);

  const handleActivateClick = () => {
    if (!isFormComplete || !qrPayload || !subscriptionId) {
      alert(
        'Vui lòng điền đủ thông tin và tạo QR thanh toán trước khi kích hoạt khoá học.',
      );
      return;
    }

    console.log('Kích hoạt khoá học', {
      productCode,
      courseTitle,
      parentName,
      parentPhone,
      parentEmail,
      studentName,
      studentDob,
      studentGender,
      studentUsername,
      subscriptionId,
      qrPayload,
    });

    navigate(`/courses/${productCode}/weeks/1`);
  };

  const handleOpenChat = () => {
    if (support?.chatUrl) {
      window.open(support.chatUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Link chat chưa được cấu hình cho khoá học này.');
    }
  };

  // =================== RENDER ===================
  return (
    <div className={styles.pageContainer}>
      {/* Header nhận onLoginClick & onRegisterClick để mở popup giống HomePage */}
      <Header
        onLoginClick={openLoginPopup}
        onRegisterClick={openRegisterPopup}
      />

      <main className={styles.mainContent}>
        <section className={styles.section}>
          {/* HERO + STATUS */}
          <div className={styles.heroHeader}>
            <div className={styles.breadcrumb}>
              <span className={styles.stepFlow}>
                Đăng ký → Thanh toán → Kích hoạt tài khoản tự động
              </span>
            </div>
          </div>

          {(loading || error || (!loading && !error && !product)) && (
            <div className={styles.metaRow}>
              {loading && (
                <span className={styles.metaItem}>
                  Đang tải thông tin chi tiết khoá học...
                </span>
              )}
              {error && !loading && (
                <span className={styles.metaItemError}>{error}</span>
              )}
              {!loading && !error && !product && (
                <span className={styles.metaItemError}>
                  Không tìm thấy thông tin khoá học.
                </span>
              )}
            </div>
          )}

          {/* VÙNG 1 – THÔNG TIN KHOÁ HỌC */}
          <div className={styles.courseInfoBlock}>
            <div className={styles.courseInfoLeft}>
              <div className={styles.sectionLabel}>1. Thông tin khoá học</div>

              <div className={styles.courseLine}>
                <span className={styles.courseLineLabel}>
                  + Khoá học:&nbsp;
                </span>
                <span className={styles.courseLineValue}>
                  {courseLineValue}
                </span>
              </div>

              <div className={styles.courseMetaRow}>
                <div className={styles.courseMetaItem}>
                  <span className={styles.courseMetaLabel}>
                    + Thời gian:&nbsp;
                  </span>
                  <span className={styles.courseMetaValue}>
                    {durationLabel}
                  </span>
                </div>
                <div className={styles.courseMetaItem}>
                  <span className={styles.courseMetaLabel}>
                    + Giá:&nbsp;
                  </span>
                  <span className={styles.coursePrice}>{priceLabel}</span>
                </div>
              </div>
            </div>

            <div className={styles.benefitColumn}>
              {benefits && (
                <>
                  <div className={styles.benefitTitleLine}>
                    <span className={styles.benefitTitleHighlight}>
                      {benefits.title}
                    </span>
                  </div>

                  {benefitShortDescriptions.length > 0 && (
                    <ul className={styles.benefitList}>
                      {benefitShortDescriptions.map((item, idx) => (
                        <li key={idx} className={styles.benefitItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {benefits.detailedUrl && (
                    <div className={styles.courseDetailLine}>
                      <span className={styles.courseLineLabel}>
                        + Chi tiết thông tin khoá học:&nbsp;
                      </span>
                      <a
                        href={benefits.detailedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.guideLink}
                      >
                        Xem tại đây
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* VÙNG 2 – THÔNG TIN ĐĂNG KÝ (form) */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionLabel}>
                2. Thông tin đăng ký
                <span className={styles.requiredMark}>*</span>
              </div>
              <button
                type="button"
                className={styles.existingAccountButton}
                onClick={openLoginPopup}
              >
                Đã có tài khoản
              </button>
            </div>

            <div className={styles.formDescription}>
              Bố mẹ vui lòng điền đầy đủ thông tin để tạo tài khoản cho mình và
              cho con. Các thông tin này dùng để đăng nhập và hỗ trợ trong suốt
              quá trình học.
            </div>

            {/* TODO: Giữ nguyên/điền lại toàn bộ phần form hiện tại của bạn ở đây
                (mình không thay đổi logic form, chỉ cập nhật popup). */}
          </div>

          {/* ========== VÙNG 3 + 4: HỖ TRỢ & QR THANH TOÁN ========== */}
          {/* TODO: Giữ nguyên/điền lại vùng Hỗ trợ & QR thanh toán hiện tại của bạn,
              dùng handleOpenChat, qrPayload, subscriptionId, isFormComplete, handleActivateClick, QRCode, v.v. */}
        </section>
      </main>

      <Footer />

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
              <LoginForm onLoginSuccess={handleLoginSuccessWithoutUser} />
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
                onRegisterSuccess={handleRegisterSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
