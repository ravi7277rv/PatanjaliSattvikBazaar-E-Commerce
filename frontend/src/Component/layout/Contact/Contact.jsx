import React, { useEffect, useState } from 'react';
import './Contact.css';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { submitContact } from '../../../actions/contactAction';


const Contact = () => {

  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');





  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("email", email);
    formData.set("message", message);

    dispatch(submitContact(formData));
    // console.log(name,email,message);
    setName('');
    setEmail('');
    setMessage('');
  };


  return (
    <div className="centerdisplay">
      <div className="contactway">
        <div className="owner">
          <h3>Sameer Singh</h3>
          <p>Owner & Director</p>
        </div>
        <div className="location">
          <h3>Location</h3>
          <p>Lohanipur, Patna</p>
          <p>Pincode - 800003</p>
          <p>Phone - 8083289760</p>
        </div>
      </div>
      <div className="contact-page">
        <h2>Contact Us</h2>
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >

          <label htmlFor="name">Name</label>
          <input
            type='text'
            id='name'
            placeholder='ex.. enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id='email'
            type="email"
            placeholder='ex.. demo@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id='message'
            placeholder='ex.. your message'
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default Contact;
