import './App.css';
import Header from './Component/layout/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebFont from "webfontloader";
import React, { useState, useEffect } from 'react';
import Footer from './Component/layout/footer/Footer';
import Home from './Component/Home/Home';
import ProdcutDetails from './Component/Product/ProdcutDetails';
import Products from './Component/Product/Products';
import Search from './Component/Product/Search';
import LoginSignup from './Component/User/LoginSignup';
import store from "./Store";
import { loaderUser } from './actions/userAction';
import { useSelector } from 'react-redux';
import UserOptions from './Component/layout/Header/UserOptions';
import Profile from './Component/User/Profile.jsx';
import ProtectedRoute from './Component/Route/ProtectedRoute';
import UpdateProfile from './Component/User/UpdateProfile';
import UpdatePassword from './Component/User/UpdatePassword';
import ForgotPassword from './Component/User/ForgotPassword';
import ResetPassword from './Component/User/ResetPassword.jsx';
import Cart from './Component/Cart/Cart';
import Shipping from './Component/Cart/Shipping';
import ConfirmOrder from './Component/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './Component/Cart/Payment.jsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './Component/Cart/OrderSuccess';
import MyOrders from './Component/Order/MyOrders';
import OrderDetails from './Component/Order/OrderDetils';
import Dashboard from './Component/Admin/Dashboard';
import ProductList from './Component/Admin/ProductList';
import NewProduct from './Component/Admin/NewProduct';
import UpdateProduct from './Component/Admin/UpdateProduct';
import OrderList from './Component/Admin/OrderList';
import ProcessOrder from './Component/Admin/ProcessOrder';
import UsersList from './Component/Admin/UsersList';
import UpdateUser from './Component/Admin/UpdateUser';
import ProductReviews from './Component/Admin/ProductReviews';
import Contact from '../src/Component/layout/Contact/Contact';
import About from '../src/Component/layout/About/About';
import NotFound from './Component/layout/NotFound/NotFound';





function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loaderUser());

    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());


  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path='/' Component={Home} />
        <Route exact path='/product/:id' Component={ProdcutDetails} />
        <Route exact path='/products' Component={Products} />
        <Route path="/products/:keyword" Component={Products} />

        <Route exact path='/search' Component={Search} />

        <Route exact path="/contact" Component={Contact } />

        <Route exact path="/about" Component={About} />

        <Route exact path='/login' Component={LoginSignup} />

        <Route path='/password/forgot' element={<ForgotPassword />} />

        <Route path='/password/reset/:token' element={<ResetPassword />} />

        {/* --------- Below Route is working as the protected Route ------------------------- */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />} >
          
          <Route path="/account" element={<Profile />} />
          <Route path="/me/updateProfile" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/login/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />


          {stripeApiKey && (
            <Route exact
              path="/process/payment"
              element={<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>} />
          )}

          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />




          <Route
            isAdmin={true}
            path="/admin/dashboard"
            element={<Dashboard />}
          />

          <Route
            isAdmin={true}
            path="/admin/products"
            element={<ProductList />}
          />

          <Route
            isAdmin={true}
            path="/admin/product"
            element={<NewProduct />}
          />


          <Route
            isAdmin={true}
            path="/admin/product/:id"
            element={<UpdateProduct />}
          />

          <Route
            isAdmin={true}
            path="/admin/orders"
            element={<OrderList />}
          />

          <Route
            isAdmin={true}
            path="/admin/order/:id"
            element={<ProcessOrder />}
          />

          <Route
            isAdmin={true}
            path="/admin/users"
            element={<UsersList />}
          />


          <Route
            isAdmin={true}
            path="/admin/user/:id"
            element={<UpdateUser />}
          />

          <Route
            isAdmin={true}
            path="/admin/reviews"
            element={<ProductReviews />}
          />



        </Route>
        {/* ------------------------------------------------------  */}

        <Route path='/cart' Component={Cart} />
        <Route path='*' Component={NotFound} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
