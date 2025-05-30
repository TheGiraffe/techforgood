
export default function HomePage() {
    return (
        <div className="homePage">
            <div style={{padding: "1em"}}>
                <h1 style={{ color: "#61ba88", fontSize: "5rem"}}>Tech For Good</h1>
                <h3 style={{ color: "white" }}>Look for your next tech opportunity(?)</h3>
            </div>
            <div>
                <button onClick={() => { window.location.href = '/search' }}>Search for work</button>
            </div>
        </div>
    )
}