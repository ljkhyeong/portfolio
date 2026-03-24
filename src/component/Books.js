import "../css/Books.css";
import { assetPath } from "../utils/assetPath";
import { bookSections } from "../data/books";

const Books = () => {
  return (
    <div className="details">
      <div className="section">
        <div className="section__title">Books</div>
        <div className="section__list">
          <div className="section__list-item">
            <div className="text">
              운영체제, 네트워크, 자바, 스프링, 코드 품질처럼 실무에서 계속
              맞닥뜨리는 주제를 다시 정리하기 위해 읽은 책들입니다.
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
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Books;
