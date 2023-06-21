import { useRef, useContext } from "react";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import Context from "../../context";
import baseURL from "../../baseUrl/baseUrl";

function SignUp(props) {
  const { toggleModal } = props;

  const { cometChat, setIsLoading } = useContext(Context);

  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const getInputs = () => {
    const fullname = fullnameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    return { fullname, email, password, confirmPassword };
  }

  const isSignupValid = ({ fullname, email, password, confirmPassword }) => {
    if (validator.isEmpty(fullname)) {
      alert("Please input your fullname");
      return false;
    }
    if (!validator.isEmail(email)) {
      alert("Please input a valid email address");
      return false;
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
      alert("Please input your password. Your password must have at least 6 characters");
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      alert("Please input your confirm password");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Confirm password and password must be the same");
      return false;
    }
    return true;
  };

  const createUser = async ({ id, email, password, fullname, avatar }) => {
    const url = baseURL + 'users/create'; // Update the URL with the correct backend route
    return await axios.post(url, { id, email, password, fullname, avatar });
  };
  
  const createCometChatAccount = async ({ id, fullname, avatar }) => {
    const authKey = `${process.env.REACT_APP_COMETCHAT_AUTH_KEY}`;
    const user = new cometChat.User(id);
    user.setName(fullname);
    user.setAvatar(avatar);
    return await cometChat.createUser(user, authKey);
  };

  const generateAvatar = () => {
    const avatars = [
      'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
      'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
      'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
      'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
      'https://data-us.cometchat.io/assets/images/avatars/wolverine.png'
    ];
    const avatarPosition = Math.floor(Math.random() * avatars.length);
    return avatars[avatarPosition];
  }

  const signup = async () => {
    const { fullname, email, password, confirmPassword } = getInputs();
    if (isSignupValid({ fullname, email, password, confirmPassword })) {
      setIsLoading(true);
      const avatar = generateAvatar();
      const id = uuidv4();
      const response = await createUser({ id, email, password, fullname, avatar });
      if (response && response.data.message) {
        alert(response.data.message);
      } else if (response && response.data.email) {
        const createdAccount = await createCometChatAccount({ id, fullname, avatar });
        if (createdAccount) {
          alert(`${response.data.email} was created successfully! Please sign in with your created account`);
        }
      }
      toggleModal(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title">Sign Up</div>
          <div className="signup__close">
            <img
              alt="close"
              onClick={() => toggleModal(false)}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/__geKiQnSG-.png"
            />
          </div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          <input type="text" placeholder="Fullname" ref={fullnameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="password" placeholder="Password" ref={passwordRef} />
          <input
            type="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
          />
          <button className="signup__btn" onClick={signup}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
