import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-heading">
        <h2>About Patanjali Sattvik Bazaar</h2>
        <p>Your One-Stop Shop for Authentic Ayurvedic and Natural Products</p>
      </div>
      <div className="about-description">
        <div className="about-info">
          <h3>Our Vision</h3>
          <p>
            We envision a world where individuals embrace the power of Ayurveda and natural healing for their overall well-being. Our mission is to provide easy access to high-quality, authentic Ayurvedic products that promote a balanced and harmonious lifestyle.
          </p>
        </div>
        <div className="about-info">
          <h3>Our Commitment</h3>
          <p>
            At Patanjali Sattvik Bazaar, we are committed to sourcing and curating the finest Ayurvedic and natural products. We prioritize quality, purity, and sustainability to ensure that our customers receive products that are safe, effective, and environmentally friendly.
          </p>
        </div>
        <div className="about-info">
          <h3>Our Range of Products</h3>
          <p>
            Explore our diverse range of products, including personal care items, health supplements, herbal remedies, food and beverages, and more. Each product is carefully selected, adhering to Ayurvedic principles and crafted with the utmost care to enhance your well-being naturally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;