import { useState } from "react";
import signup from "../../features/firebase/auth/signup";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [ requiredUserAge, setRequiredUserAge ] = useState(15);
    const [ accountType, setAccountType ] = useState('');
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setLastName ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ organizationName, setOrganizationName ] = useState('');
    const [ website, setWebsite ] = useState('');
    const [ orgContactEmail, setOrgContactEmail ] = useState('');
    const [ userDOB, setUserDOB ] = useState(Date);
    const [ privacyAgreed, setPrivacyAgreed ] = useState(false);
    const [ interests, setInterests ] = useState([]);
    const [ errMessage, setErrMessage ] = useState('');
    const navigate = useNavigate();

    const interestOptions = [
        {value: "FrontEndDevelopment", id: "frontendDev", label: "Front-End Development"},
        {value: "BackEndDevelopment", id: "backendDev", label: "Back-End Development"},
        {value: "FullStackDevelopment", id: "fullstackDev", label: "Full-Stack Development"},
        {value: "MobileAppDevelopment", id: "mobileDev", label: "Mobile App Development"},
        {value: "UIUXDesign", id: "uiuxDesign", label: "UI/UX Design"},
        {value: "ProjectManagement", id: "projectManagement", label: "Project Management"},
        {value: "DatabaseManagement", id: "databaseManagement", label: "Database Management"},
        {value: "TestInterest", id: "testInterest", label: "Test Interest"}
    ]

    const updateInterestsList = (value, checked) => {
        const updatedInterests = interests;
        if (checked){
            updatedInterests.push(value);
        } else {
            const i = updatedInterests.indexOf(value);
            updatedInterests.splice(i, 1)
        }
        setInterests(updatedInterests)
    }

    const handleSignup = async (event) => {
        event.preventDefault();
        setErrMessage('')

        let signupObj;

        if (accountType === "volunteer"){
            signupObj = {
                accountType: accountType,
                email: email,
                password: password,
                username: username,
                firstName: firstName,
                lastName: lastName,
                DOB: userDOB,
                interests: interests,
                privacyAgreed: privacyAgreed
            }
        } else if (accountType === "organization"){
            signupObj = {
                accountType: accountType,
                email: email,
                password: password,
                organizationName: organizationName,
                website: website,
                orgContactEmail: orgContactEmail,
                contactFirstName: firstName,
                contactLastName: lastName,
                privacyAgreed: privacyAgreed
            }
        } else {
            signupObj = {}
        }
        
        const {result, error} = await signup(signupObj);
        if (error){
            if (error == "Not Approved"){
                setErrMessage("Sorry, your email address is not on the approved testers list. If this is a mistake, please make sure you typed your email address in correctly, and reach out to us if needed.")
            }
            return console.error(error);
        }
        console.log(result);
        return navigate('/login')

    }
    return(
        <div className="signupFormWrapper">
            <h2>Join Code For Good</h2>
            <form className="signupForm" onSubmit={handleSignup}>
                <div style={{marginBottom: "1em"}}>
                    <h3>I am joining as: 
                    <input type="radio" name="accountType" id="volunteer" value="volunteer" onChange={(e) => {setAccountType(e.target.value)}} />
                    <label htmlFor="volunteer">A Volunteer</label>
                    <input required type="radio" name="accountType" id="organization" value="organization" onChange={(e) => {setAccountType(e.target.value)}} />
                    <label htmlFor="organization">An Organization</label>
                    </h3>
                </div>
                {accountType ? (
                    <>
                        {accountType === "organization" ? (
                            <div className="userDetails">
                                <label htmlFor="organizationName">
                                    <div>Organization Name: </div>
                                    <input required type="text" id="organizationName" name="organizationName" onChange={(e) => {setOrganizationName(e.target.value)}} placeholder="Organization Name" />
                                </label>
                                <label htmlFor="organizationWebsite">
                                    <div>Website: </div>
                                    <input type="text" id="organizationWebsite" name="organizationWebsite" onChange={(e) => {setWebsite(e.target.value)}} placeholder="Organization Website" />
                                </label>
                                <label htmlFor="email">
                                    <div>Email: </div>
                                    <input required type="email" id="email" name="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="example@example.com" />
                                </label>
                                <label htmlFor="password">
                                    <div>Password: </div>
                                    <input required type="password" id="password" name="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" />
                                </label>
                                <h3>Organization Contact:</h3>
                                <label htmlFor="firstName">
                                    <div>First Name: </div>
                                    <input required type="text" id="firstName" name="firstName" onChange={(e) => {setFirstName(e.target.value)}} placeholder="First Name" />
                                </label>
                                <label htmlFor="lastName">
                                    <div>Last Name: </div>
                                    <input required type="text" id="lastName" name="lastName" onChange={(e) => {setLastName(e.target.value)}} placeholder="Last Name" />
                                </label>
                                <label htmlFor="orgContactEmail">
                                    <div>Contact Email: </div>
                                    <input required type="email" id="orgContactEmail" name="orgContactEmail" onChange={(e) => {setOrgContactEmail(e.target.value)}} placeholder="example@example.com" />
                                </label>
                            </div>
                        ) : (
                            <div className="formWrapper">
                                <div className="userDetails">
                                    <label htmlFor="firstName">
                                        <div>First Name: </div>
                                        <input required type="text" id="firstName" name="firstName" onChange={(e) => {setFirstName(e.target.value)}} placeholder="First Name" />
                                    </label>
                                    <label htmlFor="lastName">
                                        <div>Last Name: </div>
                                        <input required type="text" id="lastName" name="lastName" onChange={(e) => {setLastName(e.target.value)}} placeholder="Last Name" />
                                    </label>
                                    <label htmlFor="email">
                                        <div>Email: </div>
                                        <input required type="email" id="email" name="email" onChange={(e) => {setEmail(e.target.value)}} placeholder="example@example.com" />
                                    </label>
                                    <label htmlFor="username">
                                        <div>Username: </div>
                                        <input required type="text" id="username" name="username" onChange={(e) => {setUsername(e.target.value)}} placeholder="Username" />
                                    </label>
                                    <label htmlFor="password">
                                        <div>Password: </div>
                                        <input required type="password" id="password" name="password" onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" />
                                    </label>
                                    <label htmlFor="DOB">
                                        <div>Date of Birth: </div>
                                        <input required type="date" id="DOB" name="DOB" onChange={(e) => {
                                            const now = new Date();
                                            const today = {
                                                year: parseInt(now.getFullYear()),
                                                month: parseInt(now.getMonth()) + 1,
                                                day: parseInt(now.getDate())
                                            }
                                            const birthdate = {
                                                year: parseInt(e.target.value.slice(0,4)),
                                                month: parseInt(e.target.value.slice(5,7)),
                                                day: parseInt(e.target.value.slice(8,10))
                                            }
                                            let age = today.year - birthdate.year;
                                            if (birthdate.month > today.month){
                                                age -= 1
                                            } else if (birthdate.month === today.month){
                                                if (birthdate.day > today.day){
                                                    age -= 1
                                                }
                                            }

                                            if (age - requiredUserAge >= 0){
                                                e.target.setCustomValidity('')
                                                setUserDOB(e.target.value)
                                            } else {
                                                e.target.setCustomValidity(`You must be at least ${requiredUserAge} years old to create an account.`)
                                            }
                                            }} onInput={(e) => {e.target.setCustomValidity('')}} />
                                    </label>
                                </div>
                                <div className="userOptions">
                                    <h3>My Interests:</h3>
                                    <div style={{display: "grid", gridTemplateColumns:"1fr 1fr 1fr"}}>
                                        {interestOptions.map((interest, idx) => {
                                            return (
                                                <span key={idx}>
                                                    <input type="checkbox" name="volunteerTypes" id={interest.id}
                                                        onChange={(e) => {updateInterestsList(e.target.value, e.target.checked); console.log(interests)}} 
                                                        value={interest.value}/>
                                                    <label htmlFor={interest.id}>{interest.label}</label>
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                    )}
                    <div style={{margin: "1em"}}>
                    <input type="checkbox" onChange={(e) => {setPrivacyAgreed(e.target.checked)}} required name="privacyAgreement" id="privacyAgree" />
                    <label htmlFor="privacyAgree">I agree to the <a href="#">Privacy Terms</a></label>
                    </div>
                    <button type="submit">Sign Up</button>
                </>) : (<></>) }
            </form>
            {errMessage ? <div style={{color: "red"}}>{errMessage}</div> : <></>}
        </div>
    )
}

export default SignupPage