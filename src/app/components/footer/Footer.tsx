import { FaFacebookF, FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-[linear-gradient(90deg,#232526_0%,#414345_100%)] text-gray-300 pt-10 pb-6">
      <div className="container mx-auto px-6 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
        
        {/* Cột 1: Logo + mô tả */}
        <div>
          <h2 className="text-white text-3xl font-extrabold mb-3">ITSeek</h2>
          <p className="text-sm text-gray-400">
            Nền tảng công nghệ giúp bạn phát triển kỹ năng, công việc và dự án IT của mình.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Trang chủ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Việc làm IT</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Công ty</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Liên hệ hỗ trợ</a></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 123 Code Street, Hà Nội</li>
            <li>📞 +84 123 456 789</li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> support@itseek.vn
            </li>
          </ul>

          {/* Mạng xã hội */}
          <div className="flex items-center gap-4 mt-4 text-gray-400">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaGithub /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ITSeek. All rights reserved.
      </div>
    </footer>
  );
};
