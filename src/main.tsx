import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './stores/store.ts'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dữ liệu được coi là mới trong 5' (không refetch liên tục)
      // nhóm kiểm soát refetch tự động
      refetchOnWindowFocus: true, // focus lại tab tự động refetch khi data stale
      refetchOnMount: true, // refetch data stale khi component được render lại vào DOM
      refetchOnReconnect: true, // tự fetch lại khi có internet
      // nhóm polling - lấy dữ liệu theo chu kỳ
      refetchInterval: false, // tự refetch lại sau mỗi ...s
      refetchIntervalInBackground: false, // thu nhỏ(ẩn) có tiếp tục refetchInterval không
      // nhóm retry
      retry: 1, // retry 1 lần khi thất bại
      retryDelay: 2000 // thời gian chờ giữa các lần retry (mặc định 1000ms)
    }
  }

})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* QueryClientProvider dùng để bọc app, giúp cấp quyền truy cập cache cho toàn bộ app */}
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
      {/* component của react-query-tools để debug khi dev */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
