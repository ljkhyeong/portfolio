const PrintPage = ({ number, path, meta, footer, dark = false, variant = "", children }) => {
    const className = [
        "print-page",
        dark ? "print-page--dark" : "",
        variant ? `print-page--${variant}` : "",
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <section className={className} data-print-page data-page-number={number}>
            <header className="print-page__header">
                <span>{path}</span>
                <span>{meta}</span>
            </header>
            {children}
            <footer className="print-page__footer">
                <span>{footer}</span>
                <span>{number}</span>
            </footer>
        </section>
    )
}

export default PrintPage
