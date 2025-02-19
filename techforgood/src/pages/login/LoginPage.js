import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../../features/firebase/auth/login';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrMessage('')
        const {result, error} = await login(email, password);
        if (error){
            setErrMessage(error.message);
            return console.error(error);
        }
        console.log(result);
        return navigate('/profile')
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={onSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
            </form>
            {errMessage ? <div style={{color: "red"}}>{errMessage}</div> : <></>}
        </div>
    );
};


export default LoginPage;

