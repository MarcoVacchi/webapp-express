const conn = require('../data/movies_db');

function index(req, res) {
    const sql = `
        SELECT
    movies.*, AVG(reviews.vote) as avg_vote
    FROM
    movies
    LEFT JOIN 
    reviews on movies.id = reviews.movie_id
    GROUP BY movies.ID
    `;
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

    const sqlMovie = 'SELECT * FROM movies_db.movies WHERE id = ?';

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

module.exports = { index, show };