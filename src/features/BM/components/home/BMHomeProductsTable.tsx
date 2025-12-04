// src/features/BM/components/BMHomeProductsTable.tsx

import React from 'react';
import styles from './BMHomeProductsTable.module.css';
import type {
  HomePageCourseItemDto,
  HomePageCoursesDto,
} from '../../model/home-page-param.dto';

export interface SelectedProduct {
  product: HomePageCourseItemDto;
}

interface BMHomeProductTableProps {
  products?: HomePageCoursesDto;
  onProductSelect?: (selected: SelectedProduct) => void;
}

const BMHomeProductsTable: React.FC<BMHomeProductTableProps> = ({
  products,
  onProductSelect,
}) => {
  const productList: HomePageCoursesDto =
    products && Array.isArray(products) && products.length > 0 ? products : [];

  const [activeProductKey, setActiveProductKey] = React.useState<string | null>(
    null
  );

  const getProductKey = (product: HomePageCourseItemDto) =>
    `${product.grade ?? 'g'}-${product.courseCode}-${product.title}`;

  const handleClickProduct = (product: HomePageCourseItemDto | null) => {
    if (!product) return;

    const key = getProductKey(product);
    setActiveProductKey(key);

    if (onProductSelect) {
      onProductSelect({ product });
    }
  };

  const allGrades = Array.from(
    new Set(
      productList
        .map((c) => c.grade)
        .filter((g): g is number => g !== null && g !== undefined)
    )
  ).sort((a, b) => a - b);

  const gradesLeft = allGrades.filter((g) => g >= 1 && g <= 6);
  const gradesRight = allGrades.filter((g) => g >= 7 && g <= 12);

  const getColorVariantByGrade = (grade: number | null | undefined) => {
    if (!grade) return 1;
    return ((grade - 1) % 4) + 1;
  };

  const findProductByType = (
    productsOfGrade: HomePageCoursesDto,
    type: 'BASIC' | 'ADVANCE' | 'EXAM'
  ): HomePageCourseItemDto | null => {
    const upperType = type.toUpperCase();
    const product = productsOfGrade.find((p) =>
      p.courseCode?.toUpperCase().includes(upperType)
    );
    return product ?? null;
  };

  const getExamFallbackLabel = (grade: number) => {
    if (grade >= 2 && grade <= 5) return 'Luyện thi CLC';
    if (grade >= 6 && grade <= 9) return 'Luyện thi chuyên';
    if (grade >= 10 && grade <= 12) return 'Luyện thi ĐH top';
    return 'Luyện thi';
  };

  const getButtonVariantClass = (
    variant: number,
    level: 'basic' | 'advance' | 'exam'
  ): string => {
    const suffix =
      level === 'basic'
        ? 'Basic'
        : level === 'advance'
        ? 'Advance'
        : 'Exam';

    const key = `courseButton${suffix}Variant${variant}`;
    return (styles as Record<string, string>)[key] ?? '';
  };

  const renderCourseButton = (
    product: HomePageCourseItemDto | null,
    fallbackLabel: string,
    variant: number,
    level: 'basic' | 'advance' | 'exam',
    isActive: boolean
  ) => {
    const disabled = !product;
    const variantClass = getButtonVariantClass(variant, level);

    return (
      <button
        type="button"
        className={[
          styles.courseButton,
          variantClass,
          isActive ? styles.courseButtonActive : '',
          disabled ? styles.courseButtonDisabled : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => handleClickProduct(product)}
        disabled={disabled}
      >
        {product?.title ?? fallbackLabel}
      </button>
    );
  };

  const renderTableForGrades = (grades: number[]) => {
    if (!grades || grades.length === 0) {
      return (
        <div className={styles.productsTableWrap}>
          <div className={styles.emptyRangeText}>
            Hiện chưa có khoá học cho khối này.
          </div>
        </div>
      );
    }

    return (
      <div className={styles.productsTableWrap}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th className={styles.headerGradeCol}>Khối</th>
              <th className={styles.headerLevelCol}>Khoá học</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => {
              const productsOfGrade = productList.filter(
                (c) => c.grade === grade
              );

              const variant = getColorVariantByGrade(grade);
              const rowColorClass =
                (styles as Record<string, string>)[
                  `rowColorVariant${variant}`
                ] ?? '';
              const gradeColorClass =
                (styles as Record<string, string>)[
                  `gradeColorVariant${variant}`
                ] ?? styles.gradeColorDefault;

              const basicProduct = findProductByType(productsOfGrade, 'BASIC');
              const advanceProduct = findProductByType(
                productsOfGrade,
                'ADVANCE'
              );
              const examProduct = findProductByType(productsOfGrade, 'EXAM');

              const examFallbackLabel = getExamFallbackLabel(grade);

              return (
                <tr key={grade} className={rowColorClass}>
                  <td className={styles.gradeCell}>
                    <div
                      className={`${styles.gradeSquare} ${gradeColorClass}`}
                    >
                      {grade}
                    </div>
                  </td>

                  <td>
                    {productsOfGrade.length === 0 ? (
                      <span className={styles.emptyCell}>—</span>
                    ) : (
                      <div className={styles.courseColumns}>
                        <div className={styles.courseCell}>
                          {renderCourseButton(
                            basicProduct,
                            'Cơ bản',
                            variant,
                            'basic',
                            basicProduct
                              ? activeProductKey === getProductKey(basicProduct)
                              : false
                          )}
                        </div>
                        <div className={styles.courseCell}>
                          {renderCourseButton(
                            advanceProduct,
                            'Nâng cao',
                            variant,
                            'advance',
                            advanceProduct
                              ? activeProductKey ===
                                getProductKey(advanceProduct)
                              : false
                          )}
                        </div>
                        <div className={styles.courseCell}>
                          {renderCourseButton(
                            examProduct,
                            examFallbackLabel,
                            variant,
                            'exam',
                            examProduct
                              ? activeProductKey === getProductKey(examProduct)
                              : false
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={styles.productsSplitLayout}>
      <div className={styles.productsColumn}>
        {renderTableForGrades(gradesLeft)}
      </div>
      <div className={styles.productsColumn}>
        {renderTableForGrades(gradesRight)}
      </div>
    </div>
  );
};

export default BMHomeProductsTable;
