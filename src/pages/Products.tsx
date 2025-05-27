import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function NoticeModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-55 p-4">
      <div className="bg-white rounded-2xl w-[327px] h-[620px] flex flex-col gap-4 p-4 pb-6 shadow-lg">
        {/* Top Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M14.6967 14.6967C14.8897 14.8897 14.8897 15.2026 14.6967 15.3956C14.5037 15.5886 14.1908 15.5886 13.9978 15.3956L10 11.3978L6.00224 15.3956C5.80924 15.5886 5.49635 15.5886 5.30335 15.3956C5.11035 15.2026 5.11035 14.8897 5.30335 14.6967L9.30113 10.6989L5.30335 6.70112C5.11035 6.50812 5.11035 6.19523 5.30335 6.00223C5.49635 5.80923 5.80924 5.80923 6.00224 6.00223L10 10L13.9978 6.00223C14.1908 5.80923 14.5037 5.80923 14.6967 6.00223C14.8897 6.19523 14.8897 6.50812 14.6967 6.70112L10.6989 10.6989L14.6967 14.6967Z" 
                fill="rgba(15, 19, 36, 0.6)"
              />
            </svg>
          </button>
        </div>

        {/* Container */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Text */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal text-text-muted leading-[1.43] tracking-[-0.007em]">
              notice
            </span>
            <h2 className="text-2xl font-bold text-text-primary leading-[1.33] tracking-[-0.0125em]">
              매장 카운터에서 상품을 주문해주세요
            </h2>
            <p className="text-base font-normal text-text-primary leading-[1.5] tracking-[-0.0125em]">
              현재 온라인 스토어를 운영하고 있지 않습니다. 구매를 원하신다면 카운터에서 상품을 다시 한번 문의 부탁드립니다.
            </p>
          </div>

          {/* Image */}
          <div className="flex-1 bg-gray-200 rounded-lg bg-cover bg-center overflow-hidden">
            <img
              src="/images/modal_img_sample.jpg"
              alt="매장 안내"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 py-12 gap-12">
          {/* Shop Card Wrap */}
          <div className="h-[740px]">
            <div 
              className="flex flex-col gap-2 cursor-pointer"
              onClick={handleProductClick}
            >
              {/* Image */}
              <div className="w-full h-[180px] bg-gray-200 rounded-lg bg-cover bg-center overflow-hidden">
                <img
                  src="/images/shop_img_sample.jpg"
                  alt="esspresso syrup"
                  className="w-full h-full object-cover"
                />
              </div>
              
                             {/* Text Content */}
               <div className="flex flex-col">
                 <span className="text-sm font-normal text-text-muted leading-[1.43] tracking-[-0.007em]">
                   coffee
                 </span>
                 <span className="text-base font-semibold text-text-primary leading-[1.5] tracking-[-0.0125em]">
                   esspresso syrup
                 </span>
                 <span className="text-base font-normal text-text-primary leading-[1.5] tracking-[-0.0125em]">
                   23,000원
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <NoticeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
} 