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
        })))
    })

}

function show(req, res) {
    const { id } = req.params;

    const sqlMovie = 'SELECT * FROM movies WHERE id = ?';

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

        const sqlReviews = 'SELECT * FROM movies_db.reviews WHERE movie_id = ?';

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
};

function storeReview(req, res) {
    const { id } = req.params;
    const { text, name, vote } = req.body;

    if (!text || !name || !vote) {
        return res.status(400).json({
            errorMessage: 'Inserire tutti i campi!'
        });
    };


    res.send('ho aggiunto una nuova recensione');

}

module.exports = { index, show, storeReview };