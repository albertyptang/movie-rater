var Movie = Backbone.Model.extend({
  remove: function(){
    this.trigger('removing', this);
  }
});

var Movies = Backbone.Collection.extend({
  model: Movie,

  initialize: function(){
    this.on('removing', function(movie){
      this.remove(movie);
    }, this);
  }
});

var MovieView = Backbone.View.extend({
  template: _.template('<div class="movie"> \
                          <div><%- title %></div> \
                          <div><%- year %></div> \
                          <div><%- rating %></div> \
                          <div class="like">liked</div> \
                          <div class="remove">remove</div> \
                        </div>'),
  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  },

  events: {
    'click .like' : 'toggleLike',
    'click .remove' : 'remove'
  },

  remove: function(){
    this.model.remove();
  },

  toggleLike: function(){
    console.log(this);
    var like = this.$('.like').text() === "liked" ? "unlike" : "liked";
    this.$('.like').text(like);
  }
});

var MoviesView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);
    this.render();
  },

  nav: _.template('<div class="nav"> \
                     <form class="form"> \
                      <input placeholder="movie title" type="text" name="movietitle"> \
                      <input placeholder="year" type="text" name="year"> \
                      <input placeholder="rating" type="text" name="rating"> \
                      <button class="addMovie" type="submit">Add movie</button> \
                    <form> \
                  </div>'),
  events: {
    'click .addMovie': 'addMovie'
  },
  addMovie: function(e){
      var that = this;
      $('.form').on('submit', function(e){
        e.preventDefault();
        var arr = ($(this).serializeArray());
        that.collection.add({
          title: arr[0].value,
          year: arr[1].value,
          rating: arr[2].value
      }, { at: 0 });
      console.log(that.collection);
    })
  },
  render: function(movies){
    this.$el.html(this.nav());
    _.each(this.collection.models, function(movie){
      var movieView = new MovieView({model: movie});
      this.$el.append(movieView.render());
    }, this);
    return this.$el;
  }

});

$(function(){
  var movies = new Movies(movieData);
  var moviesview = new MoviesView({collection: movies, el: '.movies'});
});
