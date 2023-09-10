import React, { Fragment, useEffect, useState } from 'react';
// import { Carousel } from 'react-responsive-carousel';
import './ProductDetails.css'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { clearErrors, getProductDetails, newReview } from "../../actions/productAction";
import Loader from '../layout/Loader/Loader';
import ReviewCard from './ReviewCard';
import { useAlert } from "react-alert";
import MetaData from '../layout/MetaData';
import { addItemsToCart } from "../../actions/cartAction";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from '../../constants/productConstant';


const ProdcutDetails = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { id } = useParams();//instead of params we have to use the useParams() from react router dom
    const { product, loading, error } = useSelector(
        (state) => state.productDetails
    );

    console.log(product);



    const { success, error: reviewerror } = useSelector(
        (state) => state.newReview
    )

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const increseQuantity = () => {
        if (product.stock <= quantity) return;
        const qty = quantity + 1;
        setQuantity(qty);
    }

    const decreseQuantity = () => {
        if (1 >= quantity) return;

        const qty = quantity - 1;
        setQuantity(qty);
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success('Item Added To Cart');
    };

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));

        setOpen(false);
    };

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (reviewerror) {
            alert.error(reviewerror);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(id)); // instead of params use useParams 
    }, [dispatch, id, error, alert, reviewerror, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${product.name} -- Patanjali`} />
                    <div className='ProductDetails'>
                        <div>

                            {/* <Carousel> */}
                                
                                {product.images &&
                                    product.images.map((item, i) => (
                                        <img
                                            className='CarouselImage'
                                            key={i}
                                            src={item.url}
                                            alt={`${i} Slide`}
                                        />
                                    ))}

                               
                            {/* </Carousel> */}
                        </div>
                        <div>
                            <div className='detailsBlock-1'>
                                <h2>{product.name}</h2>
                                {/* <p>Product # ${product._id}</p> */}
                            </div>
                            <div className='detailsBlock-2'>
                                <Rating   {...options} />
                                <span>({product.numOfReviews} Reviews)</span>
                            </div>
                            <div className='detailsBlock-3'>
                                <h2>{`₹${product.price}`}</h2>
                                <div className='detailsBlock-3-1'>
                                    <div className='detailsBlock-3-1-1'>
                                        <button onClick={decreseQuantity}>-</button>
                                        <input readOnly value={quantity} type='number' />
                                        <button onClick={increseQuantity}>+</button>
                                    </div>
                                    <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Add to Cart</button>
                                </div>
                                <p>
                                    Status:
                                    <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>
                            <div className='detailsBlock-4'>
                                Description : <p>{product.description}</p>
                            </div>

                            <button onClick={submitReviewToggle} className='submitReview'>Submint Review</button>
                        </div>
                    </div>
                    <h3 className='reviewsHeading'>REVIEWS</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {product.reviews && product.reviews[0] ? (
                        <div className='reviews'>
                            {product.reviews &&
                                product.reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
                        </div>
                    ) : (
                        <p className='noReviews'>NO Reviews Yet</p>
                    )}

                </Fragment>
            )}
        </Fragment>
    );
}

export default ProdcutDetails;
