import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <HashLoader
                color='#C2272D'
                size={100}
            />
        </div>
    )
}

export default Loading;