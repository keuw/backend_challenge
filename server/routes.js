const axios = require("axios");

const route1 = (req, res) => {
    res.status(200).send({
        success: "true",
    });
};

const route2 = (req, res) => {
    const { tags, sortBy, direction } = req.params;
    const validSortValues = [
        "id",
        "author",
        "authorId",
        "likes",
        "popularity",
        "reads",
        "tags",
        undefined,
    ];
    const validDirections = ["asc", "desc", undefined];

    if (validSortValues.indexOf(sortBy) === -1) {
        res.status(400).send({
            error: "sortBy parameter is invalid",
        });
    }

    if (validDirections.indexOf(direction) === -1) {
        res.status(400).send({
            error: "direction parameter is invalid",
        });
    }

    let tagArray = tags.split(",");
    let getPaths = tagArray.map((tag, i) => {
        return axios.get(
            `http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`
        );
    });
    axios
        .all([...getPaths])
        .then(
            axios.spread((...responses) => {
                let data = [];
                for (let i = 0; i < responses.length; i++) {
                    data[i] = responses[i].data.posts;
                }

                let posts = [];
                let idSet = {};
                for (let i = 0; i < data.length; i++) {
                    let postList = data[i];
                    for (let j = 0; j < postList.length; j++) {
                        if (!(postList[i].id in idSet)) {
                            posts.push(postList[i]);
                            idSet[postList[i].id] = true;
                        }
                    }
                }

                if (sortBy) {
                    if (direction === "desc") {
                        posts = posts.sort((a, b) =>
                            b[sortBy] > a[sortBy] ? 1 : -1
                        );
                    } else {
                        posts = posts.sort((a, b) =>
                            b[sortBy] < a[sortBy] ? 1 : -1
                        );
                    }
                }
                res.status(200).send(posts);
            })
        )
        .catch((errors) => {
            res.status(400).send({
                error: "Tags parameter is required",
            });
            console.log(error);
        });
};

module.exports = {
    route1,
    route2,
};
