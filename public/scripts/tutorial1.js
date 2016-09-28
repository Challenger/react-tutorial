
var CommentBox = React.createClass({
  displayName: 'CommentBox',

  getInitialState: function() {
    return { data: [] }
  },

  componentDidMount: function() {
    this.loadComments();
    setInterval(this.loadComments, this.props.pollInterval)
  },

  loadComments: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function(comment) {
    const old_comments = this.state.data;
    comment.id = Date.now();
    var new_comments = old_comments.concat([comment]);
    this.setState({data: new_comments});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: old_comments})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      React.createElement(
        'div',
        {className: "commentBox"},
        "Hello, world! I am a CommentBox.",
        React.createElement('h1', { }, "Comments"),
        React.createElement(CommentList, { data: this.state.data }),
        React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit})
      )
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function buildComments(comment) {
      return React.createElement(Comment,
                                 { author: comment.author, key: comment.id },
                                 comment.text)
    });

    return (React.createElement('div',
                                { className: "commentList" },
                                "Hello, world! I am a CommentList",
                                commentNodes
                               )
    );
  }
});


var Comment = React.createClass({
  render: function() {
    var md = new Remarkable();
    return (
      React.createElement(
        'div',
        {className: "comment"},
        React.createElement('h3',
                            {className: "commentAuthor"},
                            this.props.author),
        React.createElement('span',
                            {dangerouslySetInnerHTML: {__html:  md.render(this.props.children.toString())}})
      )
    );
  }
});


var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: "", text: ""};
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value})
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value})
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return ;
    }
    this.props.onCommentSubmit({ author: author, text: text});
    this.setState({author: '', text: ''});
  },

  render: function() {
    return (
        <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
        <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />
        <input type="submit" value="Post" />
        </form>
    );
  }
});


ReactDOM.render(
  React.createElement(CommentBox, { url: "/api/comments", pollInterval: 2000 } ),
  document.getElementById('content')
);
