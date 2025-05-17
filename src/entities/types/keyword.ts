export interface KeywordItem {
  key: string;
  rank: number; // 랭킹
  keyword: string; // 키워드
  category1: string; // 1차 카테고리
  category2: string; // 2차 카테고리
  category3: string; // 3차 카테고리
  searchVolume: number; // 검색량
  prevSearchVolume: number; // 전주 검색량
  growthRate: number; // 증감률
  productCount: number; // 상품수
  competitionLevel: string; // 경쟁강도
}
