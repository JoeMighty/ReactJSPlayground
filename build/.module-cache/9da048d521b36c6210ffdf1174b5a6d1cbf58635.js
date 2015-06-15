var data = [
  {author: "Pete Hunt", text: "This is one comment dynamically rendered"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentList = React.createClass({displayName: "CommentList",
  render: function() {

    var commentNodes = this.props.data.map(function (comment) {
      return (
        React.createElement(Comment, {author: comment.name}, 
          comment.body
        )
      );
    });
    return (
      React.createElement("div", {className: "commentList"}, 
        commentNodes
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author) {
            return;
        }
        // TODO: send request to the server
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },
    render: function() {
    return (
        React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
            React.createElement("input", {type: "text", placeholder: "Your name", ref: "author"}), 
            React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
            React.createElement("input", {type: "submit", value: "Post"})
        )
    );
    }
});

var CommentBox = React.createClass({displayName: "CommentBox",
    getInitialState: function() {
        return {data: []};
    },

    loadCommentsFromServer: function() {
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
        // TODO: submit to the server and refresh the list
    },

    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            React.createElement("div", {className: "commentBox"}, 
                React.createElement("h1", null, "Gooo REACT JS!"), 
                React.createElement(CommentForm, null), 
                React.createElement(CommentList, {data: this.state.data})
            )
        );
    }
});

var Comment = React.createClass({displayName: "Comment",
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author, " and ", this.props.child
        ), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});

React.render(
 React.createElement(CommentBox, {url: "http://jsonplaceholder.typicode.com/comments", pollInterval: 9000}),
  document.getElementById('content')
);