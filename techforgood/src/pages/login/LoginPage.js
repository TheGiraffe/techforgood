import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import login from '../../features/firebase/auth/login';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const { logoutMessage } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrMessage('');
        const { result, error } = await login(email, password);
        if (error) {
            setErrMessage(error.message);
            return console.error(error);
        }
        console.log(result);
        return navigate('/dashboard');
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
                <br />
                <label style={{marginRight: "29px"}}>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {logoutMessage && <p style={{color: 'green'}}>{logoutMessage}</p>}
            {errMessage ? <div style={{ color: "red" }}>{errMessage}</div> : null}
        </div>
    );
};

export default LoginPage;

