// AJAX related code for the home page http://www.colinalford.com/
// Initializes page with data and loads more on user actions



    // Blog object
    var Blogs = {
        requesting: false, // Is an ajax event happening?
        endOfPage: false, // Has the user reached end of the content in database?

        // Fetches blog data from database via API
        // lastDate parameter defined in the API route
        // (see routes/blogs.js)
        getBlogs: function(date) {
            var promise = $.ajax({
                type: 'GET',
                url: '/api/blog',
                data: { lastDate: date },
                dataType: 'json',
            });

            return promise;
        },

        // Renders blogs to HTML by iterating over the array returned from the API
        renderBlogs: function(data) {
            $.each(data, function(index, element) {
                // Grabs date for formatting
                var date = new Date(element.created_at);

                $('#lastPostsLoader').append('<div class="blog-post" id="'+element.created_at+'"></div>');
                var $last = $('.blog-post:last');
                $last.append('<h2 id="'+element._id+'"class="title">'+element.title+'</h2>');
                $last.append('<hr/>');
                $last.append('<div class="date">'+date.toLocaleString()+'</div>');
                $last.append('<div class="body">'+element.body+'</div>');
                $last.append('<a href="/api/blog/'+element._id+'"><span class="link-spanner"></span></a>');
            });
        }
    }

    var Comments = {
        getComments: function(blog_id) {
            var promise = $.ajax({
                type: 'GET',
                url: '/api/comments/blog/'+blog_id,
            });

            return promise;
        },
        renderComments: function(data) {
            $.each(data, function(index, element) {
                var date = new Date(element.date);
                var $comments = $('#comments');
                $comments.append('<div class="comment-container"></div>');
                var $container = $('.comment-container:last');
                $container.append('<div class="comment-date">'+date.toLocaleString()+'</div>');
                $container.append('<div class="comment-body">'+element.body+'</div>');
                $container.append('<div class="comment-user">'+element.user.username+'</div>');
            });
        }
    }
