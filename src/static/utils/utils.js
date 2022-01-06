
var direction_map = {
  'up': 0,
  'right': 1,
  'down': 2,
  'left': 3,  
};


function mod(x, n) {
  return ((x % n) + n) % n ;
}


function get_quotient_remainder(x, n) {
  return [Math.floor(x/n), mod(x, n)];
}


function random_elem_from_array(arr) {
  var ran_idx = Math.floor(Math.random()*arr.length);
  return arr[ran_idx];
}


function get_nbors(x, len, space = 'T2') {
  // space is either T2 (torus), or RP2 (real projective plane)
  var [r, c] = get_quotient_remainder(x, len);
  // order: top, right, bottom, left
  var nbors = [
    len*mod(r - 1, len) + c,
    len*r + mod(c + 1, len),
    len*mod(r + 1, len) + c, 
    len*r + mod(c - 1, len),
  ];

  if (space == 'RP2') {
    if (r == 0) {
      nbors[0] = len*mod(r - 1, len) + mod(len - 1 - c, len);
    }
    if (c == len - 1) {
      nbors[1] = len*mod(len - 1 - r, len) + mod(c + 1, len);
    }
    if (r == len - 1) {
      nbors[2] = len*mod(r + 1, len) + mod(len - 1 - c, len);
    }
    if (c == 0) {
      nbors[3] = len*mod(len - 1 - r, len) + mod(c - 1, len);
    }
  }
  // in RP2, the corners have 3 unique neighbors
  return nbors;
}


function init_walls(len, space) {
  var walls = {}; // walls is an object
  for (var i = 0; i < len*len; i++){
    var nbors = get_nbors(i, len, space);
    // map remembers the original insertion order of the keys
    var nbor_walls = new Map();
    for (var bor of nbors) {
      nbor_walls.set(bor, true);
    }
    walls[i] = nbor_walls; // walls[i] is a map
  }
  return walls;
}


function create_long_corridors(len, space) {
  // https://en.wikipedia.org/wiki/Maze_generation_algorithm#Iterative_implementation

  var walls = init_walls(len, space);
  var visited = new Set([0]);
  var stack = [0];

  while (stack.length > 0) {
    var cur = stack.pop();
    var nbors = get_nbors(cur, len, space);
    var unvis_nbors = nbors.filter((elem) => !visited.has(elem));
    var len_unvis = unvis_nbors.length;

    if (len_unvis > 0) {
      stack.push(cur);
      var chosen = random_elem_from_array(unvis_nbors);

      walls[cur].set(chosen, false);
      walls[chosen].set(cur, false);

      visited.add(chosen);
      stack.push(chosen);
    }
  }
  return walls;
}


function create_many_dead_ends(len, space) {
  // https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Prim's_algorithm

  var walls = init_walls(len, space);
  var visited = new Set([0]);
  var frontier = new Set(get_nbors(0, len, space));

  while (frontier.size > 0) {
    var front_vals = [...frontier.values()];
    var cur = random_elem_from_array(front_vals);

    var cur_nbors = get_nbors(cur, len, space);
    var vis_nbors = cur_nbors.filter((elem) => visited.has(elem));
    var vis_nbr = random_elem_from_array(vis_nbors);

    walls[cur].set(vis_nbr, false);
    walls[vis_nbr].set(cur, false);

    visited.add(cur);
    frontier.delete(cur);

    cur_nbors.forEach((item) => {
      if (!visited.has(item)) {
        frontier.add(item);
      }
    });
  }
  return walls;
}


function get_bfs_info(root, walls, len, space) {
  var info = [];
  for (var i = 0; i < len*len; i++) {
    info[i] = {dist: -1, pred: null};
  }
  info[root].dist = 0;
  var que = new Queue();
  que.enqueue(root);

  while(que.length > 0) {
    var cur = que.dequeue();
    var nbors = get_nbors(cur, len, space);
    var valid_nbors = nbors.filter((elem) => !walls[cur].get(elem));

    valid_nbors.forEach((item) => {
      if (info[item].dist == -1) {
        info[item].dist = info[cur].dist + 1;
        info[item].pred = cur;
        que.enqueue(item);
      }
    });
  }
  return info;
}


function get_solution_set(predecessor, start, end) {
  var solution_set = new Set([start]);
  var pred = predecessor[end];
  while (predecessor[pred] >= 0){
    solution_set.add(pred);
    pred = predecessor[pred];
  }
  return solution_set;
}


function solve_bfs(start, end, len, space, walls) {
  var predecessor = Array(len*len).fill(-1);
  predecessor[start] = -2;
  var explored_order = [];

  var que = new Queue();
  que.enqueue(start);

  var done = false;
  while(que.length > 0 && !done) {
    var cur = que.dequeue();
    var nbors = get_nbors(cur, len, space);
    var valid_nbors = nbors.filter((elem) => !walls[cur].get(elem));
    
    valid_nbors.forEach((item) => {
      if (predecessor[item] == -1) {
        predecessor[item] = cur;
        que.enqueue(item);
        explored_order.push(item);
        if (item == end) {
          done = true;
        }
      }
    });
  }
  return {predecessor, explored_order};
}


function solve_dfs(start, end, len, space, walls) {
  var predecessor = Array(len*len).fill(-1);
  var color = Array(len*len).fill(false);
  var explored_order = [];
  
  var stack = [start];
  
  var done = false;
  while(stack.length > 0 && !done) {
    var cur = stack.pop();
    if (!color[cur]) {
      color[cur] = true;
      explored_order.push(cur);
      var nbors = get_nbors(cur, len, space);
      var valid_nbors = nbors.filter((elem) => !walls[cur].get(elem));

      valid_nbors.forEach((item) => {
        if (!color[item]) {
          predecessor[item] = cur;
          stack.push(item);
        }
        if (item == end) {
          done = true;
        }
      });
    }
  }
  return {predecessor, explored_order};
}


class Queue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }
  enqueue(item) {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }
  dequeue() {
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }
  peek() {
    return this.items[this.headIndex];
  }
  get length() {
    return this.tailIndex - this.headIndex;
  }
}


export {
  direction_map, 
  get_nbors,
  create_long_corridors,
  create_many_dead_ends,
  get_bfs_info,
  get_solution_set,
  solve_bfs,
  solve_dfs
};
