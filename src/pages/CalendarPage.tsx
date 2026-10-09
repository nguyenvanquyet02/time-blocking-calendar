import React, { Suspense, useState } from 'react';
const loadUserPage = () => import('./UserPage')

const UserPage = React.lazy(loadUserPage)

const CalendarPage: React.FC = () => {
  const [showUserPage, setShowUserPage] = useState(false);
  const [status, setStatus] = useState("Chưa preload UserPage");
  // Tải module nhưng chưa yêu cầu React render component
  const handlePreload = async () => {
    setStatus("Đang tải...");

    try {
      await loadUserPage();
      setStatus("Đã tải module, chưa render UserPage");
    } catch {
      setStatus("Tải module thất bại");
    }
  };
  return (
    <div>
      <button onClick={handlePreload}>
        1. Preload UserPage
      </button>

      <button onClick={() => setShowUserPage(true)}>
        2. Hiển thị UserPage
      </button>

      <p>{status}</p>

      {showUserPage && (
        <Suspense fallback={<p>Đang render UserPage...</p>}>
          <UserPage />
        </Suspense>
      )}
    </div>
  )
};
export default CalendarPage;
