
import LoginBlock from "/static/components/login.js";
import BoardBlock from "/static/components/board_block.js";


class DonutWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_logged_in: false,
      allow_actions: true,
    };
  }

  update_logged_in(bool) {
    this.setState({is_logged_in: bool});
  }

  update_allow_actions(bool) {
    this.setState({allow_actions: bool});
  }

  logout() {
    if (this.state.allow_actions) {
      window.localStorage.removeItem("id_token");
      this.setState({is_logged_in: false});
    }
  }

  componentDidMount() {
    var token = window.localStorage.getItem("id_token");
    if (token == 'somerandomtokenstringwf2367f2345bny679') {
      this.setState({is_logged_in: true});
    }
  }

  render() {
    return (
      <div className="donut_world">
        {!this.state.is_logged_in &&
          <div className="home_div">
            <LoginBlock 
              update_logged_in={(x) => this.update_logged_in(x)}
            />
            <img id="donut_gif" src="/static/images/spinning_donut.gif" alt="Spinning donut" />
          </div>
        }

        {this.state.is_logged_in &&
          <div className="content_div">
            <p> <button onClick={()=>this.logout()}>Logout</button> </p>

            <BoardBlock
              allow_actions={this.state.allow_actions}
              update_allow_actions={(x) => this.update_allow_actions(x)}
            />
          </div>
        }
      </div>
    );
  }
}


export default DonutWorld;
