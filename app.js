const express = require('express'),
app         = express(),
bodyParser  = require('body-parser'),
methodOverride = require('method-override'),
mongoose    = require('mongoose'),
eSanitizer = require('express-sanitizer');
const blog = require("./models/blog.js");
const PORT = process.env.PORT || 8080;
const path = require('path')

//connecting to the database
mongoose.connect("mongodb://localhost/blogApp", {useNewUrlParser: true, useUnifiedTopology: true});

//app config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(eSanitizer()); //this must be implemented after the body-parser
app.use(methodOverride("_method"));

//RESTful Routes


app.get("/", function(req, res){
    
    res.redirect("/blogs");
    
})

//'INDEX' Route
app.get("/blogs", async(req, res)=>{

    blog.find({})
        .then((blogs)=>{
            res.render('index', {blogs});
        })
        .catch((error)=>{
            res.redirect('/');
        })

})

//'NEW' Route
app.get('/blogs/new', function(req, res){
    
    res.render('newBlog');
    
})

//'CREATE' Route
app.post('/blogs', function(req, res){
    
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    blog.create(req.body.blog)
        .then((_blog)=>{
            res.render('/blogs');
        })
        .catch((error)=>{
            res.render('newBlog');
        })
    
})


//SHOW ROUTE

app.get('/blogs/:id', async (req, res)=>{

    try {

        const _blog = await blog.findById(req.params.id);

        res.render('show', {blog: _blog});

    } catch (error) {

        res.redirect('/blogs');

    }
    
})

//EDIT ROUTE

app.get('/blogs/:id/edit', async(req, res)=>{
    
    try {

        const __blog = await blog.findById(req.params.id);

        res.render('edit', {blog: __blog});

    } catch (error) {
        res.redirect('/blogs');
    }
    
})

//UPDATE ROUTE

app.put('/blogs/:id', async (req, res)=>{
    
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    
    try {
        const updatedBlog = await blog.findByIdAndUpdate(req.params.id);
        res.redirect(`/blogs/${req.params.id}`)
    } catch (error) {
        res.redirect('/blogs');
    }

    
});

//DESTROY ROUTE

app.delete('/blogs/:id', async (req, res)=>{

    /**
     *  @Date modified 02/23/2020
     * 
     *  Updated By: Diego Matheus
     * 
     *  @summary
     * 
     *  Packages were updated, and by doing so, 
     *  a couple of the template engine's outdated instructions broke, 
     *  causing a forced debug and update of these mentioned instructions.
     * 
     *  *TIP*
     * 
     *  Refactor into async - await.
     *  Build the client side on React or Angular
     *  Refactor the API and the controllers-routes.
     */
   try {
        await blog.findByIdAndRemove(req.params.id);
        return redirect("/blogs")
   } catch (error) {
       console.log(error);
       return error;
   }
    
})


app.listen(PORT, function(){
    console.log(`[Success] :: Server is running at port ${PORT}`);
})
    