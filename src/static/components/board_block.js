
import Board from "/static/components/board.js";
import {
  direction_map, 
  get_nbors,
  create_long_corridors,
  create_many_dead_ends,
  get_bfs_info,
  get_solution_set,
  solve_bfs,
  solve_dfs
} from "/static/utils/utils.js";



class BoardBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walls: {},
      length: 10,
      position: 0,
      end: 99,
      space: 'T2',
      explored: Array(100).fill(false),
      solution_set: new Set(),
      interval_id: null,
    };
  }

  update_explored(arr) {
    this.setState({explored: arr});
  }

  update_solution_set(s) {
    this.setState({solution_set: s});
  }

  move(dir, len, space = 'T2') {
    // dir is either 'up', 'right', 'down', or 'left'
    var old_pos = this.state.position;
    var nbors = get_nbors(old_pos, len, space);
    var new_pos = nbors[direction_map[dir]];

    if (!this.props.allow_actions || this.state.walls[old_pos].get(new_pos)) {
      return;
    }
    this.setState({position: new_pos});
    if (new_pos == this.state.end){
      setTimeout(() => {
        alert("Congratulations!\nYou made it!");  
      }, 50);
    }
  }

  on_key_press(event) {
    event.preventDefault();

    if (event.keyCode < 37 || event.keyCode > 40) {
      return;
    }
    var len = this.state.length;
    var space = this.state.space;
    switch (event.keyCode) {
      case 37: // left arrow key
      this.move('left', len, space);
      break;

      case 38: // up arrow key
      this.move('up', len, space);
      break;

      case 39: // right arrow key
      this.move('right', len, space);
      break;

      case 40: // down arrow key
      this.move('down', len, space);
      break;
    }
  }


  set_maze_start_end(new_walls, size_int, space) {
    var rand_start = Math.floor(Math.random()*size_int*size_int);
    var info = get_bfs_info(rand_start, new_walls, size_int, space);

    var max_dist = -1;
    var farthest = -1;
    info.forEach((item, index) => {
      if (item.dist > max_dist) {
        max_dist = item.dist;
        farthest = index;
      }
    });

    this.setState({
      position: rand_start,
      end: farthest,
      length: size_int, 
      walls: new_walls,
      space: space,
      explored: Array(size_int*size_int).fill(false),
      solution_set: new Set(),
    });
  }


  create_new() {
    if (!this.props.allow_actions){
      return;
    }

    var size = document.getElementById("select_size").value;
    var size_int = parseInt(size);
    var type = document.getElementById("select_type").value;
    var space = document.getElementById("select_space").value;
    
    var funcs = {
      'rand_dfs': (l, s) => create_long_corridors(l, s),
      'rand_prim': (l, s) => create_many_dead_ends(l, s),
    };

    var new_walls = funcs[type](size_int, space);
    this.set_maze_start_end(new_walls, size_int, space);
  }


  draw_exploration(explored_order, solution_set, len, speed) {
    if (explored_order.length > 0) {
      var cur_explored = Array(len*len).fill(false);
      var idx = 0;
      var i_id = setInterval(() => {
        cur_explored[explored_order[idx]] = true;
        this.update_explored(cur_explored);
        idx += 1;
        if (idx == explored_order.length) {
          clearInterval(i_id);
          this.setState({
            explored: Array(len*len).fill(false),
            solution_set: solution_set,
            interval_id: null,
          });
          this.props.update_allow_actions(true); // unblock at end
        }
      }, speed);
      this.setState({interval_id: i_id});
    }
  }


  solve() {
    if (!this.props.allow_actions) {
      return; // exit if already solving, there may be async calls
    }

    this.props.update_allow_actions(false); // block while drawing
    this.update_solution_set(new Set());

    var speed = document.getElementById("select_speed").value;
    var speed_int = parseInt(speed);
    var algo = document.getElementById("select_algo").value;
    var start = this.state.position;
    var end = this.state.end;
    var len = this.state.length;
    var space = this.state.space;
    var walls = this.state.walls;

    var funcs = {
      'BFS': (st, e, l, sp, w) => solve_bfs(st, e, l, sp, w),
      'DFS': (st, e, l, sp, w) => solve_dfs(st, e, l, sp, w),
    };

    var { predecessor, explored_order } = funcs[algo](start, end, len, space, walls);
    var solution_set = get_solution_set(predecessor, start, end);
    this.draw_exploration(explored_order, solution_set, len, speed_int);
  }


  cancel_solve() {
    clearInterval(this.state.interval_id);
    this.setState({
      explored: Array(this.state.length*this.state.length).fill(false),
      solution_set: new Set(),
      interval_id: null,
    });
    this.props.update_allow_actions(true);
  }


  render() {
    return (
      <div className="board_block">

        <label>Size: </label>
        <select id="select_size">
          <option key={"sel_size_key_" + 0} value={"10"}>{"10"}</option>
          <option key={"sel_size_key_" + 1} value={"24"}>{"24"}</option>
          <option key={"sel_size_key_" + 2} value={"36"}>{"36"}</option>
        </select>

        <label id="select_type_label">Type: </label>
        <select id="select_type">
          <option key={"sel_type_key_" + 0} value={"rand_dfs"}>{"long corridors"}</option>
          <option key={"sel_type_key_" + 1} value={"rand_prim"}>{"many dead ends"}</option>
        </select>

        <label id="select_space_label">Space: </label>
        <select id="select_space">
          <option key={"sel_space_key_" + 0} value={"T2"}>{"donut"}</option>
          <option key={"sel_space_key_" + 1} value={"RP2"}>{"twisted plane"}</option>
        </select>

        <button id="create_new_button" onClick={() => this.create_new()}>Create new maze</button>

        <div className="solve_div">
          <label id="select_solve_speed_label">Solve speed: </label>
          <select id="select_speed">
            <option key={"sel_speed_key_" + 0} value={"50"}>{"50 ms"}</option>
            <option key={"sel_speed_key_" + 1} value={"300"}>{"300 ms"}</option>
            <option key={"sel_speed_key_" + 2} value={"800"}>{"800 ms"}</option>
          </select>

          <label id="select_solve_algo_label">Solve algo: </label>
          <select id="select_algo">
            <option key={"sel_algo_key_" + 0} value={"BFS"}>{"breadth first"}</option>
            <option key={"sel_algo_key_" + 1} value={"DFS"}>{"depth first"}</option>
          </select>

          <button id="solve_button" onClick={() => this.solve()}>Solve</button>
          <button id="cancel_solve_button" onClick={() => this.cancel_solve()}>Cancel solution</button>
        </div>

        <p><b>Click on the board to enable movement with arrow keys. Start at green and end at red.</b></p>

        <Board
          position={this.state.position}
          end={this.state.end}
          length={this.state.length}
          walls={this.state.walls}
          space={this.state.space}
          explored={this.state.explored}
          solution_set={this.state.solution_set}
          get_nbors={(x, l, s) => get_nbors(x, l, s)}
          create_long_corridors={(l, s) => create_long_corridors(l, s)}
          on_key_press={(x) => this.on_key_press(x)}
          set_maze_start_end={(w, l, s) => this.set_maze_start_end(w, l, s)}
        />
      </div>
    );
  }
}


export default BoardBlock;
