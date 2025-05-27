
export default function HomePage() {
    return (
        <>
            <div>
                <h1 style={{ color: "#61ba88", fontSize: "8em" }}>Tech For Good</h1>
                <h3 style={{ color: "#00522c" }}>Look for your next tech opportunity(?)</h3>
            </div>
            <div>
                <button onClick={() => { window.location.href = '/search' }}>Search for work</button>
            </div>
        </>
    )
}