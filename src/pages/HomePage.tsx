import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
          Nguyễn Văn Quyết - 0979103083
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          4 EXP - Middle Frontend Developer - Viettel company
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/calendar')}
            className="flex items-center gap-2.5 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Mở Calendar
          </button>
          <a
            href="https://console.firebase.google.com/project/time-blocking-calendar/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.89 15.673L6.255.461A.542.542 0 017.27.289L9.813 5.06 3.89 15.673zm16.795 3.691L18.433 5.365a.54.54 0 00-.949-.1L9.815 15.673l7.31 4.346a1.087 1.087 0 001.55-.345zM14.5 7.5l-1.423-2.521a.54.54 0 00-.949 0L3.516 19.364l7.314-4.346L14.5 7.5z" />
            </svg>
            Firestore Console
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
