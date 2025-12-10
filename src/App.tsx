import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm/SearchForm';
import SearchResult from './components/SearchResult/SearchResult';
import SearchHistory from './components/SearchHistory/SearchHistory';
import { Address, ApiResponse } from './types';
import './App.scss';

function App() {
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Address[][]>([]);

  // LocalStorage から履歴を読み込む
  useEffect(() => {
    const savedHistory = localStorage.getItem('zipcode-search-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('履歴の読み込みに失敗しました', e);
      }
    }
  }, []);

  // 履歴を LocalStorage に保存
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('zipcode-search-history', JSON.stringify(history));
    }
  }, [history]);

  const handleSearch = async (zipcode: string) => {
    setError(null);
    
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
      const data: ApiResponse = await response.json();
      
      if (data.status === 200) {
        if (data.results && data.results.length > 0) {
          const addresses = data.results.map(result => ({
            zipcode: result.zipcode, // API からの郵便番号を使用
            address: `${result.address1}${result.address2}${result.address3}`,
            kana: `${result.kana1}${result.kana2}${result.kana3}`
          }));
          
          setSearchResults(addresses);
          
          // 履歴に追加（同じ郵便番号がない場合のみ）
          const normalizedZipcode = addresses[0].zipcode;
          if (!history.some(item => item.length > 0 && item[0].zipcode === normalizedZipcode)) {
            setHistory(prev => [addresses, ...prev].slice(0, 10)); // 最大10件まで保存
          }
        } else {
          setSearchResults([]);
          setError('郵便番号が存在しません。');
        }
      } else {
        setError(data.message || 'エラーが発生しました。');
      }
    } catch (e) {
      setError('エラーが発生しました。');
      console.error(e);
    }
  };

  // 履歴から検索を再実行
  const handleHistorySelect = (addresses: Address[]) => {
    if (addresses && addresses.length > 0) {
      setSearchResults(addresses);
    }
  };

  // 履歴をクリア
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('zipcode-search-history');
  };

  return (
    <div className="app">
      <h1 className="app-title">住所検索</h1>
      
      <div className="app-description">
        <p>郵便番号を入力して住所を検索できます。</p>
        <p>郵便番号はハイフン「-」有無どちらでも検索可能です。</p>
        <p>(000-0000, 0000000 の形式で入力してください。)</p>
      </div>
      
      <SearchForm onSearch={handleSearch} error={error} />
      
      {searchResults.length > 0 && (
        <SearchResult results={searchResults} />
      )}
      
      {history.length > 0 && (
        <SearchHistory 
          history={history} 
          onSelect={handleHistorySelect} 
          onClear={clearHistory} 
        />
      )}
    </div>
  );
}

export default App;