var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var React = require('react');

// Components
var FluxMessageApp = require('./components/FluxMessageApp.react');

var Home = React.createClass({
  render: function() {
    return (
      <div>
        <header>
          <ul>
            <li><Link to="messages">Messages</Link></li>
          </ul>
        </header>
        <RouteHandler/>
      </div>
    );
  }
});

var TestHome = React.createClass({
  render: function() {
    return (
      <div>
        This is the home page
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={Home}>
    <Route name="messages" handler={FluxMessageApp}/>
    <DefaultRoute handler={TestHome}/>
  </Route>
);

module.exports = routes;