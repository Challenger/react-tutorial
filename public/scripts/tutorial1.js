
var CommentBox = React.createClass({
  displayName: 'CommentBox',

  render: function() {
    return (
      React.createElement(
        'div',
        {className: "commentBox"},
        "Hello, world! I am a CommentBox.",
        React.createElement('h1', { }, "Comments"),
        React.createElement(CommentList, { data: this.props.data }),
        React.createElement(CommentForm)
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
  render: function() {
    return (
        <div className="commentForm">
        Hello, world! I am a CommentForm.
        </div>
    );
  }
});


var data = [
  {id: 1, author: "Pete Hunt*", text: "This is one comment"},
  {id: 2, author: "Jordan Walke*", text: "This is *another* comment"}
];

ReactDOM.render(
  React.createElement(CommentBox, { data: data, url: "/api/comment" } ),
  document.getElementById('content')
);
