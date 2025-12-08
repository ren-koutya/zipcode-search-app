import { useState } from 'react';
import SearchForm from './components/SearchForm/SearchForm';
import SearchResult from './components/SearchResult/SearchResult';
import { Address, ApiResponse } from './types';
import './App.scss';

function App() {
  const [searchResults, setSearchResults] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (zipcode: string) => {
    setError(null);
    
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
      const data: ApiResponse = await response.json();
      
      if (data.status === 200) {
        if (data.results && data.results.length > 0) {
          const addresses = data.results.map(result => ({
            zipcode: zipcode,
            address: `${result.address1}${result.address2}${result.address3}`,
            kana: `${result.kana1}${result.kana2}${result.kana3}`
          }));
          
          setSearchResults(addresses);
        } else {
          setSearchResults([]);
          setError('郵便番号が存在しません。');
        }
      } else {
        setError('エラーが発生しました。');
      }
    } catch (e) {
      setError('エラーが発生しました。');
    }
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
    </div>
  );
}

export default App;