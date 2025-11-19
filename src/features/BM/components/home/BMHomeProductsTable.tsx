// src/features/BM/components/BMHomeProductsTable.tsx

import React from 'react';
import styles from './BMHomeProductsTable.module.css';
import type {
  BMProductDto,
  BMProductDtoList,
} from '../../model/BMProductDto';

/**
 * Kiểu dữ liệu cho sản phẩm được chọn.
 */
export interface SelectedProduct {
  product: BMProductDto;
}

interface BMHomeProductTableProps {
  products?: BMProductDtoList;
  onProductSelect?: (selected: SelectedProduct) => void;
}

const FIXED_LEVELS: { code: number; label: string }[] = [
  { code: 1, label: 'Cơ bản' },
  { code: 2, label: 'Nâng cao' },
  { code: 3, label: 'Luyện thi' },
];

const BMHomeProductsTable: React.FC<BMHomeProductTableProps> = ({
  products,
  onProductSelect,
}) => {
  const productList: BMProductDtoList =
    products && Array.isArray(products) && products.length > 0 ? products : [];
  const [activeProductKey, setActiveProductKey] = React.useState<string | null>(
    null
  );

  const getProductKey = (product: BMProductDto) =>
    `${product.grade ?? 'g'}-${product.level ?? 'l'}-${product.name}`;

  const handleClickProduct = (product: BMProductDto) => {
    const key = getProductKey(product);
    setActiveProductKey(key);
    // 👉 Chỉ emit ra ngoài cho HomePage xử lý điều hướng
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

  const renderTableForGrades = (grades: number[]) => {
    if (!grades || grades.length === 0) {
      return (
        <div className={styles.productsTableWrap}>
          <div className={styles.emptyRangeText}>
            Hiện chưa có sản phẩm cho khối này.
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
              {FIXED_LEVELS.map((lv) => (
                <th key={lv.code} className={styles.headerLevelCol}>
                  {lv.label}
                </th>
              ))}
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

              return (
                <tr key={grade} className={rowColorClass}>
                  <td className={styles.gradeCell}>
                    <div
                      className={`${styles.gradeSquare} ${gradeColorClass}`}
                    >
                      {grade}
                    </div>
                  </td>

                  {FIXED_LEVELS.map((lv) => {
                    const product = productsOfGrade.find(
                      (c) => c.level === lv.code
                    );

                    if (!product) {
                      return (
                        <td key={lv.code}>
                          <span className={styles.emptyCell}>—</span>
                        </td>
                      );
                    }

                    const productKey = getProductKey(product);
                    const isActive = activeProductKey === productKey;

                    return (
                      <td key={lv.code}>
                        <button
                          type="button"
                          className={`${styles.productPill} ${gradeColorClass} ${
                            isActive ? styles.productPillActive : ''
                          }`}
                          onClick={() => handleClickProduct(product)}
                        >
                          {product.name}
                        </button>
                      </td>
                    );
                  })}
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
