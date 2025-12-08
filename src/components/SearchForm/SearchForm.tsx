import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './SearchForm.scss';

interface SearchFormProps {
  onSearch: (zipcode: string) => void;
  error: string | null;
}

function SearchForm({ onSearch, error }: SearchFormProps) {
  const [zipcode, setZipcode] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 半角数字とハイフンのみを許可
    if (value === '' || /^[0-9\-]*$/.test(value)) {
      if (value.length <= 8) {
        setZipcode(value);
        setValidationError(null);
      }
    }
  };

  const validate = (): boolean => {
    if (!/^[0-9\-]+$/.test(zipcode)) {
      setValidationError('郵便番号は半角数字のみまたは半角数字とハイフンのみで入力してください。');
      return false;
    }
    
    const cleanZip = zipcode.replace('-', '');
    if (cleanZip.length !== 7 || (zipcode.includes('-') && zipcode.length !== 8)) {
      setValidationError('郵便番号は半角数字でハイフンありの8桁かハイフンなしの7桁で入力してください。');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validate()) {
      onSearch(zipcode);
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={zipcode}
          onChange={handleChange}
          placeholder="例: 100-0001"
          className="zipcode-input"
        />
        <button type="submit" disabled={zipcode === ''} className="search-button">
          検索
        </button>
      </div>
      
      {validationError && <p className="error-message">{validationError}</p>}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default SearchForm;