// AJAX related code for the home page http://www.colinalford.com/
// Initializes page with data and loads more on user actions

$(document).ready(function() {

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
                url: 'http://localhost:3000/api/blog',
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
                $last.append('<h2 class="title">'+element.title+'</h2>');
                $last.append('<hr/>');
                $last.append('<div class="date">'+date.toLocaleString()+'</div>');
                $last.append('<div class="body">'+element.body+'</div>');
            });
        }
    }

    // Initializes page with most recent blog entries on page load
    Blogs.getBlogs().done(function(results) {
        Blogs.renderBlogs(results);
    });

    // Infinity Scroll -- Event handler to watch for user scroll,
    // then load next 10 blog entries from the API call
    $(window).scroll(function() {

        // Gets dimensions of window and document and sets point to trigger scroll
        var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
        var  scrolltrigger = 0.95;

        // If user scrolls to 95% of page, they have reached the end of the page,
        // and there are no AJAX requests that haven't completed and rendered,
        // it will execute the code
        if ((wintop/(docheight-winheight)) > scrolltrigger && Blogs.endOfPage === false && Blogs.requesting === false) {

            // Gets date of the last item rendered to page
            var lastItem = $('#lastPostsLoader .blog-post:last-child').attr('id');

            // When true, does not allow any other AJAX requests to be fired off
            // until complete
            Blogs.requesting = true;

            // When promise is returned from AJAX call, first checks to see that
            // result empty array. If so, it sets endOfPage to true and disables
            // further AJAX requests. Then it checks if it is not currently at
            // endOfPage and, if not, it renders HTML from JSON result.
            Blogs.getBlogs(lastItem).done(function(result){
                if (result.length === 0) {
                    $('#lastPostsLoader').append('<hr/><div class="blog-post end-content">End Of Content: Scroll To Top Or Refresh To Check For New Content</div>');
                    Blogs.endOfPage = true;
                }
                if (Blogs.endOfPage !== true && result[0] !== undefined) {
                    Blogs.renderBlogs(result)
                    Blogs.requesting = false;
                } else if (Blogs.endOfPage !== true && result[0] === undefined) {
                    console.log(result.message);
                    $('#lastPostsLoader').append('<div class="blog-post error-message">Something has gone wrong. Try refreshing the page and please let an admin know.</div>');
                    Blogs.requesting = false;
                    Blogs.endOfPage = true;
                }
            })
            .error(function(result){
                console.log("you are a failure");
                console.log(result);
            });
        }
    });

});
