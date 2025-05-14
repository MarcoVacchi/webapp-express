const conn = require('../data/movies_db');

function index(req, res) {

    const { search } = req.query;

    let sql = `
        SELECT
    movies.*, AVG(reviews.vote) as avg_vote
    FROM
    movies
    LEFT JOIN 
    reviews on movies.id = reviews.movie_id
    `;

    if (search) {
        sql += `WHERE title like "%${search}%" OR director LIKE "%${search}%" OR abstract LIKE "%${search}%" `
    }

    sql += `GROUP BY movies.ID`

    conn.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database non connesso!" })
        res.json(results.map(result => ({
            ...result,
            imagepath: process.env.DB_IMG + result.image
        })));
    });

};

function show(req, res) {
    const { id } = req.params;

    const sqlMovie = `
        SELECT 
            movies.*, 
            AVG(reviews.vote) AS avg_vote
        FROM 
            movies
        LEFT JOIN 
            reviews ON movies.id = reviews.movie_id
        WHERE 
            movies.id = ?
        GROUP BY 
            movies.id
    `;

    conn.query(sqlMovie, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                errorMessage: "Database non connesso!"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                errorMessage: 'Nessun record trovato!',
                id
            });
        }

        const movie = results[0];
        movie.imagepath = process.env.DB_IMG + movie.image;

        const sqlReviews = 'SELECT * FROM reviews WHERE movie_id = ?';

        conn.query(sqlReviews, [id], (err, reviewResults) => {
            if (err) {
                return res.status(500).json({
                    errorMessage: "Database non connesso!"
                });
            }

            movie.reviews = reviewResults;
            res.json(movie);
        });
    });
}

function storeReview(req, res) {
    const { id } = req.params;
    const { text, name, vote } = req.body;

    if (!text || !name || vote == null || vote === "") {
        return res.status(400).json({
            errorMessage: 'Inserire tutti i campi!'
        });
    }

    const sqlAdd = `INSERT INTO reviews (movie_id, text, name, vote) VALUES (?, ?, ?, ?)`;

    conn.query(sqlAdd, [id, text, name, vote], (err, addResult) => {
        if (err) {
            return res.status(500).json({ errorMessage: "Errore nel salvataggio della recensione" });
        };

        res.json({
            id,
            text,
            name,
            vote
        });
    });
};

function store(req, res) {
    const { title, director, genre, abstract } = req.body;

    if (!req.file) {
        return res.status(400).json({ errorMessage: "Immagine mancante!" });
    }

    const image = req.file.filename;

    const addMovieSql = `INSERT INTO movies (title, director, genre, abstract, image) VALUES (?, ?, ?, ?)`;

    conn.query(addMovieSql, [title, director, genre, abstract, image], (err, result) => {
        if (err) {
            return res.status(500).json({ errorMessage: "Errore nel salvataggio del film" });
        }

        res.status(201).json({
            message: "Film salvato con successo",
            movieId: result.insertId
        });
    });
}


module.exports = { index, show, storeReview, store };