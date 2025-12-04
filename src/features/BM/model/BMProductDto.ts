// src/features/BM/model/BMProductDto.ts

/**
 * ============================
 * SALE KIT DTO (từ edu-be)
 * ============================
 */

export interface ProductSaleKitSectionBaseDto {
  imageUrl: string;
  title: string;
  highlights: string[];
  inspirationalQuote: string;
}

export interface ProductSaleKitSectionWithGuideDto
  extends ProductSaleKitSectionBaseDto {
  guideUrl: string;
}

export interface ProductSaleKitSuccessStoryDto {
  id: string;
  avatarUrl: string;
  storyTitle: string;
  storyContent: string;
}

export interface ProductSaleKitDto {
  version: number;
  learningSection: ProductSaleKitSectionBaseDto;
  parentSupportSection: ProductSaleKitSectionWithGuideDto;
  pricingSection: ProductSaleKitSectionWithGuideDto;
  successStories: ProductSaleKitSuccessStoryDto[];
}

/**
 * ============================
 * SALE TERMS DTO (từ edu-be)
 * ============================
 */

export interface ProductSaleTermsBenefitsDto {
  title: string;
  shortDescription: string[];
  detailedUrl: string;
}

export interface ProductSaleTermsSupportDto {
  title: string;
  chatLabel: string;
  chatUrl: string;
  zaloCskh: string;
  zaloTeacher: string;
  zaloCeo: string;
}

export interface ProductSaleTermsDto {
  benefits: ProductSaleTermsBenefitsDto;
  support: ProductSaleTermsSupportDto;
}

/**
 * ============================
 * SUBSCRIPTION PREVIEW DTO
 * BE tự sinh: now() → 31/05 năm sau
 * ============================
 */
export interface SubscriptionPreviewDto {
  startAt: string; // ISO string
  endAt: string;   // ISO string
  label: string;   // e.g. "26/11/2025 - 31/05/2026"
}

/**
 * ============================
 * PRODUCT DTO cho FE
 * Map 1-1 với ProductResponseDto backend
 * ============================
 */
export interface BMProductDto {
  productId: number;
  productCode: string;
  productName: string;
  productType: string;
  description?: string;
  price: number;
  currency: string;
  billingCycle?: string;
  isActive: boolean;
  trialDays?: number;
  metadataJson?: any;

  saleKit: ProductSaleKitDto | null;
  saleTerms: ProductSaleTermsDto | null;

  /** subscriptionPreview BE tự tính — FE dùng để hiển thị */
  subscriptionPreview: SubscriptionPreviewDto;

  createdAt: string;
  updatedAt: string;

  /**
   * Backward compatibility (nếu BE cũ vẫn trả snake_case)
   * Có thể loại bỏ dần.
   */
  product_title?: string;
  product_code?: string;
  product_name?: string;
  sale_kit?: any;
  sale_terms?: any;
}

/**
 * ============================
 * LIST ITEM DTO
 * ============================
 */
export interface BMProductListItemDto {
  productId: number;
  productCode: string;
  productName: string;
  productType: string;
  price: number;
  currency: string;
  isActive: boolean;
}
