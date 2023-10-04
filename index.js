import express from 'express';
import _ from 'lodash';
import fetchBlogs from './fetchBlogs.js'

const app = express();

app.use(fetchBlogs);   //Application level middleware

var object = {total : null, longest: null, privacy: null, unique: null};
var values = _.memoize(_.values);
var timeout = 1 * 60 * 1000;  // 1 minute duration

function clearCache() {
	console.log('Clearing cache...');
	values.cache.set(object, [null, null, null, null]);
}


app.get('/api/blog-stats', (req, res) => {   //Blog data analysis endpoint

    try {
		const allblogsData = req.data;
        const totalNumberOfBlogs = _.size(allblogsData);
        const longestTitleBlog = _.reduce(allblogsData, (accum, blog) => { return _.size(blog.title) > _.size(accum.title) ? blog : accum; }, 0);
        const privacyTitles = _.size(_.filter(allblogsData, (blog) => { return _.includes(blog.title, "Privacy") }));
        const uniqueBlogs = _.uniqBy(allblogsData, 'title');

		if (values(object)[0] === null && values(object)[1] === null && values(object)[2] === null && values(object)[3] === null){

			console.log('Creating Cache values');
			values.cache.set(object, [totalNumberOfBlogs,longestTitleBlog,privacyTitles,uniqueBlogs]);
			setTimeout(clearCache, timeout);

		} else {
			console.log('showing cached values');
		}
        
        res.status(200).json({ totalNumberOfBlogs : values(object)[0], longestTitleBlog: values(object)[1], privacyTitles : values(object)[2], uniqueBlogs:values(object)[3] });
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }

})



app.get('/api/blog-search', (req, res) => {              //Blog search Endpoint

    // Use this - http://localhost:PORT/api/blog-search?query=anything

    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: `Please enter a valid search Query e.g., /api/blog-search?query=privacy` });
        }
        const allblogsData = req.data

        const searchBlogs = _.filter(allblogsData, (blog) => { return _.includes(_.toLower(blog.title), _.toLower(query)) })
      
          
        if (!_.size(searchBlogs) || !_.isArray(searchBlogs)) {

            return res.status(404).json({ error: `Nothing found that matches keyword- ${query}` });
        }

        res.status(200).json(searchBlogs);
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }



})


app.listen(6050, () => {
    console.log("server listening on 6050");
})

// function resolverTime(args) {
//     const now = new Date();
//     const key = `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}-${now.getHours()}-${now.getMinutes()}-${Math.floor(
//       now.getSeconds() / 10
//     ) * 10}-${args}`;
//     console.log("key", key);
//     return key;
//   }