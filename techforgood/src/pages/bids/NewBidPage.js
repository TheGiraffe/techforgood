import { useState } from "react";

export default function NewBidPage(){
    const [ proposal, setProposal ] = useState('')
    return(
        <div>
            <form>
                <label>
                    <div>Title:</div>
                    <input required type="text" placeholder="A short, catchy title for your bid." />
                    <div style={{fontSize: "0.75em"}}>A short, catchy title for your bid.</div>
                </label>
            </form>
        </div>
    )
}