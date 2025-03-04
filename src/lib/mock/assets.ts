import type { BAppAsset } from "@/api/b-app";
import type { Pagination } from "@/types/api";

// Mock assets data for testing and development
export const mockAssets: BAppAsset[] = [
  {
    token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    totalObligatedBalance: "5000000000000000000", // 5 ETH
    obligationsCount: 3,
  },
  {
    token: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", // wstETH
    totalObligatedBalance: "8000000000000000000", // 8 ETH
    obligationsCount: 5,
  },
  {
    token: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // stETH
    totalObligatedBalance: "10000000000000000000", // 10 ETH
    obligationsCount: 7,
  },
  {
    token: "0xae78736Cd615f374D3085123A210448E74Fc6393", // rETH
    totalObligatedBalance: "4500000000000000000", // 4.5 ETH
    obligationsCount: 2,
  },
  {
    token: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704", // cbETH
    totalObligatedBalance: "7200000000000000000", // 7.2 ETH
    obligationsCount: 4,
  },
  {
    token: "0x0000000000000000000000000000000000000000", // ETH
    totalObligatedBalance: "15000000000000000000", // 15 ETH
    obligationsCount: 8,
  },
  {
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    totalObligatedBalance: "5000000000", // 5,000 USDC (6 decimals)
    obligationsCount: 6,
  },
  {
    token: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
    totalObligatedBalance: "150000000", // 1.5 BTC (8 decimals)
    obligationsCount: 3,
  },
];

// Mock pagination data
export const mockPagination: Pagination = {
  total: 8,
  pages: 1,
  per_page: 10,
  page: 1,
  has_next_page: false,
};

// Function to get mock assets with pagination
export const getMockAssetsWithPagination = (
  page = 1,
  perPage = 10,
): { assets: BAppAsset[]; pagination: Pagination } => {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedAssets = mockAssets.slice(startIndex, endIndex);

  const pagination: Pagination = {
    total: mockAssets.length,
    pages: Math.ceil(mockAssets.length / perPage),
    per_page: perPage,
    page: page,
    has_next_page: page < Math.ceil(mockAssets.length / perPage),
  };

  return {
    assets: paginatedAssets,
    pagination,
  };
};

// Default mock data with pagination
export const defaultMockAssetsData = {
  assets: mockAssets,
  pagination: mockPagination,
};
