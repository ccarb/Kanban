import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { isASCII } from "../../utils/isAscii";
import { isNum } from "../../utils/isAscii";

function SignUpForm(){
    const [username, setUsername] = useState('');
    const [userValidationError, setUserValidationError] = useState('Please enter a username. ');
    const [usernameWasFocused, setUsernameWasFocused] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordValidationError, setPasswordValidationError] = useState('Please use at least 8 characters. ');
    const [passwordWasFocused, setPasswordWasFocused] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [repeatPasswordValidationError, setRepeatPasswordValidationError] = useState('');
    const [repeatPasswordWasFocused, setRepeatPasswordWasFocused] = useState('');
    
    useEffect(
        () => {
            validateUser(username);
        }
    ,[username]);

    useEffect(
        () => {
            validatePassword(password);
        }
    ,[password]);

    useEffect(
        () => {
            validateRepeatPassword(password, repeatPassword);
        }
    , [repeatPassword])

    function validateUser(username){
        let validationText='';
        if (!isASCII(username)){
            validationText=validationText.concat('Please use only letters, numbers and the following symbols @+-._ . ');
        }
        if (username.length > 150){
            validationText=validationText.concat('Please use less than 150 characters. ');
        }
        if (username.length === 0) {
            validationText=validationText.concat('Please enter a username. ');
        }
        setUserValidationError(validationText);
    } 

    function validatePassword(password=''){
        let validationText='';
        if (password.length<8){
            validationText=validationText.concat('Please use at least 8 characters. ');
        }
        if (isNum(password)){
            validationText=validationText.concat('Please do not use only numbers. ')
        }
        setPasswordValidationError(validationText);
    }

    function validateRepeatPassword(password, repeatPassword){
        let validationText='';
        if (password !== repeatPassword){
            validationText = validationText.concat('Password does not match. ')
        }
        setRepeatPasswordValidationError(validationText);
    }

    return (
        <Form.Group>
            <Form.Label>Username: </Form.Label>
            <Form.Control type="text" name="username" maxLength="150" pattern="^[0-9,A-Z,a-z,@,.,+,\-,_]*$" onChange={(event) => setUsername(event.target.value)} onFocus={() => setUsernameWasFocused(true)} required/>
            {usernameWasFocused && <div className="text-danger">{userValidationError}</div>}
            <Form.Label>Password: </Form.Label>
            <Form.Control type="password" minLength={8} name="password" onChange={(event) => setPassword(event.target.value)} onFocus={() => setPasswordWasFocused(true)} required/>
            {passwordWasFocused && <div className="text-danger">{passwordValidationError}</div>}
            <Form.Label>Repeat password: </Form.Label>
            <Form.Control type="password" name="repeat_password" onChange={(event) => setRepeatPassword(event.target.value)} onFocus={() => setRepeatPasswordWasFocused(true)} required/>
            {repeatPasswordWasFocused && <div className="text-danger">{repeatPasswordValidationError}</div>}
        </Form.Group>
    )
}

export default SignUpForm;