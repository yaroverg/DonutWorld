
class LoginBlock extends React.Component {
  login() {
    var username = document.getElementById('login_username').value;
    var password = document.getElementById("login_password").value;

    if (username != 'user' || password != 'user') {
      document.getElementById('login_username').value = '';
      document.getElementById("login_password").value = '';
      alert('login failed, try again');
      return;
    }
    window.localStorage.setItem("id_token", 'somerandomtokenstringwf2367f2345bny679');
    this.props.update_logged_in(true);
  }

  render () {
    return (
      <div className='login_block' id='login_block'>
        <h4>Log into Donut World</h4>

        <div className="login_username_div">
          <label htmlFor="username"><b>Username </b></label>
          <input id="login_username" placeholder="Enter username"></input>
        </div>

        <div className="login_password_div">
          <label htmlFor="password"><b>Password </b></label>
          <input type="password" id="login_password" placeholder="Enter password"></input>
        </div>

        <div className="login_button_div">
          <button onClick={()=>this.login()}>Login</button>
        </div>

        <p>(hint: type in "user" for both)</p>

      </div>
    );
  }
}

export default LoginBlock;
