// Retrieve the limit from environment variable, or default to 20 if not set
const limit = Number(process.env.LIMIT) ?? 40  

//count the number of pages for pagination
async function countPages(totalDocuments = 0) {
    return Math.ceil(totalDocuments / limit)
};

module.exports = countPages;