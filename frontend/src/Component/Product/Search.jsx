import React, { Fragment, useState } from 'react';
import './Search.css'
import { useNavigate } from 'react-router-dom';
import Metadata from '../layout/MetaData';

const Search = () => {

  const [keyword, setKeyWord] = useState("");

  const navigate = useNavigate(); // insetead of history we will use useNavigate

  const searchsubmitHnadler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Fragment>
      <Metadata title={`Search for Patanjali-Proudcts`} />
      <form className='searchBox' onSubmit={searchsubmitHnadler}>
        <input
          type="text"
          placeholder='Search a Product....'
          onChange={(e) => setKeyWord(e.target.value)}
        />
        <input type='submit' value="Search" />
      </form>

    </Fragment>

  );
}

export default Search;
