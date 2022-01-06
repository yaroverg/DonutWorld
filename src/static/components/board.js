
class Board extends React.Component {

  componentDidMount() {
    var new_walls = this.props.create_long_corridors(this.props.length, this.props.space);
    this.props.set_maze_start_end(new_walls, this.props.length, this.props.space);

    this.myDiv.addEventListener('keydown', (e) => this.props.on_key_press(e));
    this.myDiv.focus();
  }

  componentWillUnmount() {
    this.myDiv.removeEventListener('keydown', (e) => this.props.on_key_press(e));
  }


  render() {
    var board = [];
    var space = this.props.space;
    var len = this.props.length;
    var l_sq = len * len;
    
    for (var i = 0; i < l_sq; i++) {
      var b_style = {borderStyle: 'solid', backgroundColor: 'lightblue'};

      if (this.props.walls[i]) {
        var words = [];

        // in RP2 the corners have 3 distinct neighbors
        if (space == 'RP2' && (i == 0 || i == len - 1 || i == l_sq - len || i == l_sq - 1)) {
          var nbors = this.props.get_nbors(i, len, space);
          nbors.forEach((item) => {
            words.push(this.props.walls[i].get(item) ? 'solid' : 'none');
          });
        } else {
          this.props.walls[i].forEach((val, key) => {
            words.push(val ? 'solid' : 'none');
          });
        }
        var style_str = words.join(" ");
        b_style = {borderStyle: style_str};
      }
      if (this.props.explored[i] || this.props.solution_set.has(i)) {
        b_style.backgroundColor = 'MediumPurple';
      }
      if (i == this.props.position) {
        b_style.backgroundColor = 'green';
      }
      if (i == this.props.end) {
        b_style.backgroundColor = 'DarkRed';
        if (i == this.props.position) {
          b_style.backgroundColor = 'chocolate';
        }
      }

      board.push(
        <div className="square" id={"sq_id_"+ i} key={"square_"+ i} style={b_style}>
        </div>
      );
    }
    var gtc_style = {gridTemplateColumns: `repeat(${this.props.length}, 0fr)`};

    return (
      <div className="game_board" id="game_board" 
            style={gtc_style} tabIndex="1" ref={ref => this.myDiv = ref}>
        {board}
      </div>
    );
  }
}


export default Board;
