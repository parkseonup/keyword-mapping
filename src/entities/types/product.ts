export interface ProductItem {
  key: string;
  id: string; // 상품번호
  type: string; // 상품구분
  name: string; // 상품명
  salesStatus: string; // 판매상태
  productStatus: string; // 상품상태
  marketPrice: number; // 시중 판매가
  salePrice: number; // 판매가
  discountedPrice: number; // 판매가(자사몰 할인 적용)
}
