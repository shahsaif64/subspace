import axios from 'axios';

const fetchBlogs = async (req, res, next) => {
    try {
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });

        req.data = response.data.blogs;
        next();
    } catch (error) {
        return res.status(500).send({ error: "Service Unavailable or Internal server error occured" });
    }

}


export default fetchBlogs;


// https://intent-kit-16.hasura.app/api/rest/blogs \
//   --header 'x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'