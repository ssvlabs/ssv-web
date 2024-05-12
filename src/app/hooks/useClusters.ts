// import { useQuery } from '@tanstack/react-query';
// import { useState } from 'react';
// import { useAccount } from 'wagmi';

// export const useClusters = () => {
//   const [page, setPage] = useState(1);
//   const account = useAccount();
//   const query = useQuery({
//     staleTime: 1000 * 60 * 5, // 5 minutes
//     queryKey: ['clusters', account.address, page],
//     queryFn: () => {
//       return {};
//     },
//     placeholderData: {
//       clusters: [],
//       pagniation: {
//         page: 1,
//         per_page: 7,
//         total: 0
//       }
//     },
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     enabled: Boolean(account.address)
//   });
// };
