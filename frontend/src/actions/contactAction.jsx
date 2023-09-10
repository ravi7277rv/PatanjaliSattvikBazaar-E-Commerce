import axios from 'axios';
import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAIL } from '../constants/contactConstant'



// submitting the contact
export const submitContact = (formData) => async (dispatch) => {
  try {
    console.log(formData);

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    dispatch({ type: CONTACT_REQUEST });

    const { data } = await axios.post('/api/v1/contact', formData, config);

    dispatch({ type: CONTACT_SUCCESS, payload: data.contact });
  } catch (error) {
    dispatch({
      type: CONTACT_FAIL,
      payload: error.response?.data.error || 'An error occurred while submitting the contact form',
    });
  }
};