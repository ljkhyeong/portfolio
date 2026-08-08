import "../css/Books.css"
import { assetPath } from "../utils/assetPath"
import { bookSections } from "../data/books"

const Books = () => {
    return (
        <div className="details">
            <div className="section">
                <div className="section__title">학습 및 독서</div>
                <div className="section__list">
                    <div className="section__list-item">
                        <div className="text">
                            운영체제, 네트워크, 자바, 스프링, 코드 품질처럼 실무에서 자주 다시
                            확인하게 되는 주제를 중심으로 읽고, 필요한 내용은 스터디와 Notion으로
                            다시 정리하고 있습니다.
                        </div>
                    </div>
                </div>
            </div>
            {bookSections.map((section) => (
                <div className="section" key={section.category}>
                    <div className="section__title">{section.category}</div>
                    <div className="books-grid">
                        {section.books.map((book) => (
                            <article className="book-card" key={book.key}>
                                <img
                                    className="book-card__image"
                                    src={assetPath(book.image)}
                                    alt={book.title}
                                />
                                <div className="book-card__body">
                                    <div className="book-card__title">{book.title}</div>
                                    <div className="book-card__description">{book.description}</div>
                                    {book.studyLink ? (
                                        <a
                                            className="book-card__link"
                                            href={book.studyLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            스터디 노트
                                        </a>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Books
