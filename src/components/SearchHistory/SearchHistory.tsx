import React, { useState, useRef, useEffect } from 'react';
import { Address } from '../../types';
import './SearchHistory.scss';

interface SearchHistoryProps {
  history: Address[][];
  onSelect: (addresses: Address[]) => void;
  onClear: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onClear }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // 3件ごとにグループ化
  const groupSize = 3;
  const historyGroups = [];
  for (let i = 0; i < history.length; i += groupSize) {
    historyGroups.push(history.slice(i, i + groupSize));
  }
  
  const totalPages = historyGroups.length;

  // カルーセルのページネーション処理
  const navigateCarousel = (direction: number) => {
    const newPage = Math.max(0, Math.min(currentPage + direction, totalPages - 1));
    setCurrentPage(newPage);
    
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: newPage * carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  // スクロールイベントのリスナー設定
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollPosition = carousel.scrollLeft;
      const cardWidth = carousel.clientWidth;
      const newPage = Math.round(scrollPosition / cardWidth);
      
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [currentPage]);

  return (
    <div className="search-history">
      <div className="history-header">
        <h2 className="history-title">検索履歴</h2>
        <button className="clear-history-button" onClick={onClear}>
          履歴を消去
        </button>
      </div>
      
      <div className="carousel-container">
        {totalPages > 1 && (
          <button 
            className="carousel-button prev-button" 
            onClick={() => navigateCarousel(-1)}
            disabled={currentPage === 0}
          >
            &lt;
          </button>
        )}
        
        <div className="carousel-wrapper" ref={carouselRef}>
          {historyGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="history-group">
              {group.map((addresses, index) => {
                if (addresses.length === 0) return null;
                
                // 郵便番号は最初の結果のものを使用
                const zipcode = addresses[0].zipcode;
                
                return (
                  <div 
                    className="history-item" 
                    key={index}
                    onClick={() => onSelect(addresses)}
                  >
                    <div className="history-result">
                      {/* 郵便番号ヘッダー */}
                      <div className="history-zipcode-header">
                        <div className="history-result-item">
                          <span className="history-label">郵便番号:</span>
                          <span className="history-value">{zipcode}</span>
                        </div>
                      </div>
                      
                      {/* 住所とカナ */}
                      <div className="history-addresses-container">
                        {addresses.map((address, addressIndex) => (
                          <div key={addressIndex} className="history-result-card">
                            <div className="history-result-item">
                              <p className="history-value">
                                <span className="history-label">住所:</span> {address.address}
                              </p>
                              <p className="history-value">
                                <span className="history-label">カナ:</span> {address.kana}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <button 
            className="carousel-button next-button" 
            onClick={() => navigateCarousel(1)}
            disabled={currentPage === totalPages - 1}
          >
            &gt;
          </button>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="carousel-indicators">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button 
              key={index}
              className={`indicator ${index === currentPage ? 'active' : ''}`}
              onClick={() => navigateCarousel(index - currentPage)}
              aria-label={`ページ ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;