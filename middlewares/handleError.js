export default function handleError(err, res) {

    res.status(500);
    res.json({
        errorStatus: 500,
        errorMessage: err.message

    });
};