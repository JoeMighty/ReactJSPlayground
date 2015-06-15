var data = [
  {author: "Pete Hunt", text: "This is one comment dynamically rendered"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentList = React.createClass({
  render: function() {

    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.name}>
          {comment.body}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author) {
            return;
        }
        // TODO: send request to the server
        this.props.onCommentSubmit({author: author, text: text});

        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';
        return;
    },
    render: function() {
    return (
        <form className="commentForm" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Your name" ref="author" />
            <input type="text" placeholder="Say something..." ref="text" />
            <input type="submit" value="Post" />
        </form>
    );
    }
});

var CommentBox = React.createClass({
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
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="commentBox">
                <h1>Gooo REACT JS!</h1>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
                <CommentList data={this.state.data} />
            </div>
        );
    }
});

var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author} and {this.props.child}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});

React.render(
 <CommentBox url="http://jsonplaceholder.typicode.com/comments" pollInterval={9000} />,
  document.getElementById('content')
);