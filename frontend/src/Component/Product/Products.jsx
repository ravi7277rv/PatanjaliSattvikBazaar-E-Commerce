import React, { Fragment, useEffect, useState } from 'react';
import './Products.css'
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useParams } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import { useAlert } from 'react-alert';
import { Typography } from '@material-ui/core';
import { Slider } from '@material-ui/core';
import MetaData from '../layout/MetaData';


const categories = [
    "Digestives",
      "Health Drinks",
      "Fruit Beverages",
      "Health Wellness",
      "Diet Food",
      "Spices",
      "Dal & Pulses",
      "Edible Oil",
      "Dry Fruits"
  ];


const Products = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 10000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] =useState(0);

    const { products, loading, error, productsCount, resultPerPage } = useSelector(
        (state) => state.products
    );

    const { keyword } = useParams(); // instead of params we are using useParams

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(keyword,currentPage,price,category,ratings))
    }, [dispatch, keyword, alert, error,currentPage,price,category,ratings]);

  
    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>

                    <MetaData title="PRODUCTS -- PATANJALI  "/>
                    <h2 className='productsHeading'>Products</h2>

                    <div className='products'>
                        {products && products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider
                            value={price}
                            onChange={priceHandler}
                            valueLabelDisplay='auto'
                            aria-labelledby='range-slide'
                            min={0}
                            max={1000}
                        />
                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    
                    <fieldset>
                        <Typography component="legend">Ratings</Typography>
                        <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
                    </fieldset>

                    </div>

                    {resultPerPage < productsCount &&
                        <div className="paginationBox">
                            <Pagination
                                activepage={currentPage}
                                itemscountperpage={resultPerPage}
                                totalitemscount={productsCount}
                                onChange={setCurrentPageNo}
                                nextpagetext="Next"
                                prevpagepext="Prev"
                                firstpagetext="1st"
                                lastpagetext="Last"
                                itemclass="page-item"
                                linkclass="page-link"
                                activeclass="pageItemActive"
                                activelinkclass="pageLinkActive"
                            />
                        </div>
                    }
                </Fragment>
            }
        </Fragment>
    );
}

export default Products;
