const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    return (
        <div className="container">
            {children}
        </div>

    );
};

export default Container;