import { useState } from 'react';
import type { Address } from '../../types/index';
import './SearchHistory.scss';

interface SearchHistoryProps {
  history: Address[][];
}

function SearchHistory({ history }: SearchHistoryProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;
  const totalPages = Math.ceil(history.length / pageSize);

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const visibleHistory = history.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="search-history">
      <div className="carousel">
        <div className="carousel-container">
          {visibleHistory.map((results, historyIndex) => (
            <div key={historyIndex} className="history-item">
              {results.map((result, resultIndex) => (
                <div key={resultIndex} className="history-card">
                  <div className="history-card-content">
                    <div className="history-detail">
                      <span className="label">郵便番号:</span>
                      <span className="value">{result.zipcode}</span>
                    </div>
                    <div className="history-detail">
                      <span className="label">住所:</span>
                      <span className="value">{result.address}</span>
                    </div>
                    <div className="history-detail">
                      <span className="label">住所(カタカナ):</span>
                      <span className="value">{result.kana}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="carousel-controls">
          <button 
            className="carousel-button prev" 
            onClick={handlePrev} 
            disabled={currentPage === 0}
          >
            前へ
          </button>
          
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-dot ${i === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(i)}
              />
            ))}
          </div>
          
          <button 
            className="carousel-button next" 
            onClick={handleNext} 
            disabled={currentPage === totalPages - 1}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchHistory;