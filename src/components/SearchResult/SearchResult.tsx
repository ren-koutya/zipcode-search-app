import type { Address } from '../../types/index';
import './SearchResult.scss';

interface SearchResultProps {
  results: Address[];
}

function SearchResult({ results }: SearchResultProps) {
  return (
    <div className="search-result">
      <h2>検索結果</h2>
      
      {results.map((result, index) => (
        <div key={index} className="result-card">
          <div className="result-item">
            <span className="label">郵便番号:</span>
            <span className="value">{result.zipcode}</span>
          </div>
          <div className="result-item">
            <span className="label">住所:</span>
            <span className="value">{result.address}</span>
          </div>
          <div className="result-item">
            <span className="label">住所(カタカナ):</span>
            <span className="value">{result.kana}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SearchResult;