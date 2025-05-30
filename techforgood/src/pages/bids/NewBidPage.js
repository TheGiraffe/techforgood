import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getDataByExactAttributeValue, getDataById } from "../../features/firebase/getData";

export default function NewBidPage() {
    const [title, setTitle] = useState('')
    const [proposal, setProposal] = useState('')
    let [requestParams, setRequestParams] = useSearchParams();
    const [requestTitle, setRequestTitle] = useState(requestParams.get("title"))
    const [requestID, setRequestID] = useState(requestParams.get("request"))
    const [userSearchQuery, setUserSearchQuery] = useState('')
    const [teamMembers, setTeamMembers] = useState([]);
    const [errMessage, setErrMessage] = useState("")

    const searchUsers = async () => {
        // console.log(userSearchQuery.length)
        let result = null;
        let error = null;
        if (userSearchQuery.length > 0){
            try {
                result = await getDataByExactAttributeValue("publicprofiles", "publicEmail", userSearchQuery)
                // console.log(result)
                // console.log(teamMembers)
                if (teamMembers.length < 5){
                    setTeamMembers([...teamMembers , result.result[0]])
                } else {
                    setErrMessage("Sorry you can only have up to 6 people on a team.")
                }
                
            } catch (err){
                error = err
            }
        }
        return {result, error}
    }

    const removeTeamMember = (index) => {
        // console.log(index)
        // console.log(teamMembers.length)
        setTeamMembers(teamMembers.filter((item, i) => i != index))
        if (errMessage == "Sorry you can only have up to 6 people on a team."){
            setErrMessage("")
        }
        //user_email@emailing.com
    }
    // Add button to request contact information to profiles
    // Person you are requesting has to approve request

    return (
        <div className="row">
            <div className="col" style={{ backgroundColor: "green" }}>

            </div>
            <div className="col-7 m-4">
                <h3 className="mb-2">Applying for: <Link to={{ pathname: `../search/expanded/${requestID}` }}>{requestTitle}</Link></h3>
                <form className="NewBidForm">
                    <div style={{display:"flex", flexDirection:"column"}}>
                    <label className="my-2">
                        <div>Bid Title:</div>
                        {/* <div style={{ fontSize: "0.75em" }}>A short, catchy title for your bid.</div> */}
                        <input style={{width: "80%"}} required type="text" placeholder="A short, catchy title for your bid." />
                    </label>
                    <label className="my-2">
                        <div>Proposal:</div>
                        <textarea style={{width: "80%", minHeight: "10em"}} placeholder="Please provide a detailed description of your idea for the project."></textarea>
                    </label>
                    <label className="my-2">
                        <div>Timeline:</div>
                        <textarea style={{width: "80%", minHeight: "8em"}} placeholder="Please provide an overview of your deliverables and when you expect to deliver them. Feel free to separate MVP portions from reach goals/features."></textarea>
                    </label>
                    <label className="my-2">
                        <div>Links:</div>
                        <textarea style={{width: "80%", minHeight: "5em"}} placeholder="Add any links and link descriptions here."></textarea>
                    </label>
                    <label className="my-2">
                        <div>Add Other Team Members:</div>
                        <input type="email" style={{width: "50%"}} 
                            placeholder="email@example.com" 
                            onChange={(e) => {setUserSearchQuery(e.target.value)}}
                            /> <button type="button" onClick={searchUsers}>Search</button>
                            {teamMembers.length > 0 ? teamMembers.map((person, idx) => {
                                return(
                                    <div key={idx}> {idx  + 1}. {person.displayName} : {person.publicEmail} <button type="button" onClick={() => removeTeamMember(idx)}>X</button></div>
                                )
                                
                            }) : <></>}
                    </label>
                    </div>
                    <button className="my-2" type="submit">Submit Bid</button>
                </form>
                <div style={{color: "red"}}>{errMessage}</div>
            </div>
        </div>
    )
}