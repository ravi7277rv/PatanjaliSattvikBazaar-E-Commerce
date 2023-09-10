import { CONTACT_REQUEST, CONTACT_SUCCESS, CONTACT_FAIL } from '../constants/contactConstant'

// const initialState = {
//   loading: false,
//   success: false,
//   error: null,
// };

const contactReducer = (state = {contact: {} }, action) => {
  switch (action.type) {
    case CONTACT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case CONTACT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        contact: action.payload,
        error: null,
      };
    case CONTACT_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default contactReducer;