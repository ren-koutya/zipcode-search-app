import type { Address } from '../../types/index';
import './SearchResult.scss';

interface SearchResultProps {
  results: Address[];
}

function SearchResult({ results }: SearchResultProps) {
  // 結果が空の場合は何も表示しない
  if (!results || results.length === 0) return null;
  
  // 郵便番号は結果の最初のものを使用する
  const zipcode = results[0].zipcode;
  
  return (
    <div className="search-result">
      {/* 郵便番号は一度だけ表示 */}
      <div className="zipcode-header">
        <div className="result-item">
          <span className="label">郵便番号:</span>
          <span className="value">{zipcode}</span>
        </div>
      </div>
      
      <div className="address-list">
        {results.map((result, index) => (
          <div key={index} className="result-card">
            <div className="result-item">
              <p className="value"><span className="label">住所:</span>{result.address}</p>
              <p className="value"><span className="label">カナ:</span>{result.kana}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResult;