CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
INSERT INTO blogs (author, url, title, likes)
VALUES ('TeppoTestiMies', 'https://jokujollonen.com/', 'TestimiehenBlogit', 10);

INSERT INTO blogs (author, url, title)
VALUES ('Testimiehen Vaimo', 'https://testaajienblogi.com/', 'Toisenlainenblogi');