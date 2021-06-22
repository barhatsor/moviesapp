const header = document.querySelector('.header'),
      search = header.querySelector('.search'),
      user = header.querySelector('.user'),
      close = header.querySelector('.close'),
      addMovie = header.querySelector('.addmovie'),
      closeSub = header.querySelector('.closesub'),
      closeUsers = header.querySelector('.closeusers'),
      
      menu = document.querySelector('.menu'),
      showProfile = menu.querySelector('.showprofile'),
      showSub = menu.querySelector('.showsub'),
      showUsers = menu.querySelector('.showusers'),
      showLogin = menu.querySelector('.showlogin'),
      
      searchBox = document.querySelector('.searchbox'),
      searchInput = searchBox.querySelector('.searchinput'),
      searchClose = searchBox.querySelector('.back'),
      searchClear = searchBox.querySelector('.clear'),
      
      movieWrapper = document.querySelector('.movies'),
      
      profile = document.querySelector('.profile'),
      name = profile.querySelector('#name'),
      email = profile.querySelector('#email'),
      permissions = profile.querySelector('#permissions'),
      editButton = profile.querySelector('.edit'),
      deleteButton = profile.querySelector('.delete'),
      
      loginWrapper = document.querySelector('.login-wrapper'),
      login = loginWrapper.querySelector('.login'),
      
      loader = document.querySelector('.loader-wrapper');

let loggedId;

function checkLogin() {
  
  try {
    
    // if logged in previously
    if (localStorage.loggedId) {

      // log user id
      loggedId = localStorage.loggedId;

      // hide login prompt
      loginWrapper.classList.add('hidden');

    }
    
  } catch(e) {}
  
}

// show search box on click of search option
search.addEventListener('click', () => {
  
  searchBox.classList.add('visible');
  
  window.setTimeout(() => {
    searchInput.focus();
  }, 300);
  
})

// close dialog on click of close button
close.addEventListener('click', () => {
  
  header.classList.remove('user');
  
})

// show menu on click of user
user.addEventListener('click', () => {
  
  menu.classList.toggle('visible');
  
  // if window width is bigger than maximum
  if (window.innerWidth > 1024) {
    
    let userRect = user.getBoundingClientRect();
    let userLeft = userRect.left - 91 - 16;
    
    menu.style.left = userLeft + 'px';
    
  } else {
    
    menu.style.left = '';
    
  }
  
})

// hide menu when clicked anywhere else
document.addEventListener('click', (e) => {
  
  let notClickedOnMenu = (e.target != menu && e.target != user);
  let notClickedOnMenuChild = (e.target.parentElement != menu && e.target.parentElement != user);
  
  if (notClickedOnMenu && notClickedOnMenuChild) {
    
    menu.classList.remove('visible');
    
  }
  
})

// hide menu when clicked on option
menu.addEventListener('click', (e) => {
    
  // if clicked on option
  if (e.target != menu) {
    
    // animate option
    e.target.classList.add('clicked');
    
    window.setTimeout(() => {
      e.target.classList.remove('clicked'); 
    }, 100);
    
    
    // reset animation
    window.setTimeout(() => {
      
      menu.classList.remove('visible');
      
    }, 200);
    
  }
  
})

// show profile when clicked
showProfile.addEventListener('click', () => {
  
  window.setTimeout(() => {
    
    let userObj = usersArr.find(x => x.uid === loggedId);
    showUser(userObj);
  
  }, 500);
  
})

// show subscriptions when clicked
showSub.addEventListener('click', () => {
  
  window.setTimeout(() => {
    
    // hide edit buttons if user dosen't have permissions
    let loggedUserObj = usersArr.find(x => x.uid === loggedId);
    
    if (!loggedUserObj.permissions.includes('cmovies')) addMovie.style.display = 'none';
    else addMovie.style.display = '';
    
    header.classList.add('sub');
    
    movieWrapper.classList.add('hidden');
    
  }, 500);
  
  // render subscriptions when transition ended
  window.setTimeout(() => {
    
    renderSub(movieArr);
    
    movieWrapper.classList.remove('hidden');
    
  }, 500 + 180);
  
})

// close subscriptions when clicked
closeSub.addEventListener('click', () => {
  
  header.classList.remove('sub');
  
  movieWrapper.classList.add('hidden');
  
  // render movies when transition ended
  window.setTimeout(() => {
    
    renderMovies(movieArr);
    
    movieWrapper.classList.remove('hidden');
    
  }, 180);
  
})

// add movie when clicked
addMovie.addEventListener('click', () => {
  
  login.innerHTML = editMovieHTML;
  
  editMovie();

  loginWrapper.classList.remove('hidden');
  loginWrapper.scrollTo(0, 0);

  addInputListeners();
  
})

// show users when clicked
showUsers.addEventListener('click', () => {
  
  window.setTimeout(() => {
    
    document.body.classList.add('manage');
    header.classList.add('manage');
    
    movieWrapper.classList.add('hidden');
    
  }, 500);
  
  // render users when transition ended
  window.setTimeout(() => {
    
    renderUsersScreen(usersArr);
    
    movieWrapper.classList.remove('hidden');
    
  }, 500 + 180);
  
})

// close users when clicked
closeUsers.addEventListener('click', () => {
  
  document.body.classList.remove('manage');
  header.classList.remove('manage');
  
  movieWrapper.classList.add('hidden');
  
  // render movies when transition ended
  window.setTimeout(() => {
    
    renderMovies(movieArr);
    
    movieWrapper.classList.remove('hidden');
    
  }, 180);
  
})

// show login when clicked
showLogin.addEventListener('click', () => {
  
  window.setTimeout(() => {
    
    // remove login from localStorage
    localStorage.loggedId = '';
    
    login.innerHTML = loginHTML;
    loginWrapper.classList.remove('hidden');
    
    addInputListeners();
    addLoginListeners();
  
  }, 500);
  
})

// search movies when typed in search input
searchInput.addEventListener('input', () => {
  
  let query = searchInput.innerText.toLowerCase();
  let movies = movieWrapper.querySelectorAll('.movie');
  
  movies.forEach(movie => {
    
    let title = movie.querySelector('.title a').innerText;
    
    if (!title.toLowerCase().includes(query)) {
      
      movie.classList.add('hidden');
      movie.classList.remove('details');
      
    }
    
    else {
      movie.classList.remove('hidden');
    }
    
  })
  
})

// close search when clicked on back option
searchClose.addEventListener('click', () => {
  
  searchBox.classList.remove('visible');
  
  // show all movies
  let movies = movieWrapper.querySelectorAll('.movie');
  movies.forEach(movie => { movie.classList.remove('hidden') });
  
  // clear search box
  window.setTimeout(() => {
    
    searchInput.innerText = '';
    
  }, 300);
  
})

// clear search when clicked on x option
searchClear.addEventListener('click', () => {
    
  searchInput.innerText = '';
  searchInput.focus();
  
  // show all movies
  let movies = movieWrapper.querySelectorAll('.movie');
  movies.forEach(movie => { movie.classList.remove('hidden') });
  
})

// render movies from object
function renderMovies(movies) {
  
  let out = '';
  
  movies.forEach(movie => {
    
    // render users who watched the movie
    let userOut = renderUsersFor(movie);
    
    out += `
    <div class="movie" id="`+ movie.uid +`">
      <div class="top">
        <div class="image-wrapper">
          <img class="image" src="`+ movie.image +`">
        </div>
        <div class="details">
          <div class="title">
            <a>`+ movie.name +`</a>
            <div class="year">· `+ movie.date +`</div>
          </div>
          <div class="genres">`+ movie.genres +`</div>
        </div>
        <div class="people-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="option people">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"></path>
          </svg>
        </div>
      </div>
      <div class="bottom">
        `+ userOut +`
      </div>
    </div>
    `;
    
  })
  
  // place HTML into DOM
  movieWrapper.innerHTML = out;
  
  // expand movie when clicked
  addMovieListeners();
  
  // reset header classes
  header.classList.remove('sub');
  
}

// render subscriptions for object
function renderSub(movies) {
  
  let out = '';
  
  let loggedUserObj = usersArr.find(x => x.uid === loggedId);
  
  movies.forEach(movie => {
    
    
    // render users who watched the movie
    let userOut = '';
    
    if (loggedUserObj.permissions.includes('addsub')) userOut = renderUsersFor(movie, true);
    else userOut = renderUsersFor(movie, false);
    
    
    // hide edit buttons if user dosen't have permissions
    let optionsOut = '';
    
    let deleteHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="option delete">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"></path>
      </svg>
    `;
    
    let editHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="option edit">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"></path>
      </svg>
    `;

    if (loggedUserObj.permissions.includes('dmovies')) optionsOut += deleteHTML;
    if (loggedUserObj.permissions.includes('umovies')) optionsOut += editHTML;
    
    
    out += `
      <div class="movie details" id="`+ movie.uid +`">
        <div class="top locked">
          <div class="image-wrapper">
            <img class="image" src="`+ movie.image +`">
          </div>
          <div class="details">
            <div class="title">
              <a>`+ movie.name +`</a>
              <div class="year">· `+ movie.date +`</div>
            </div>
            <div class="genres">`+ movie.genres +`</div>
          </div>
          <div class="options-wrapper group">
            `+ optionsOut +`
          </div>
        </div>
        <div class="bottom">
          `+ userOut +`
        </div>
      </div>
    `;
    
  })
  
  // place HTML into DOM
  movieWrapper.innerHTML = out;
  
  addSubListeners();
  
}

// render users who watched the movie
function renderUsersFor(movie, add) {

  // get users who watched the movie
  let filteredUsers = usersArr.filter(user => {

    // filter the user's subscriptions
    let filteredSub = user.subscriptions
                      .filter(sub =>
                              sub.split('|')[1] == movie.uid
                             );

    // if movie exists in the user's subs, return the user
    if (filteredSub.length > 0) return user;

  });

  // render user HTML
  
  let out = '';

  // if users exist
  if (filteredUsers.length > 0) {

    // if subhead without add option
    if (!add) {
      
      out += `<div class="subhead">Watched By</div>
              <div class="users">`;
      
    } else {
      
      out += `<div class="subhead icon">
                Watched By
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="option addsub">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z" fill="currentColor"></path>
                </svg>
              </div>
              <div class="users">`;
      
    }
    
    filteredUsers.forEach(user => {

      out += '<div class="user" id="'+ user.uid +'">'+ user.fname +' '+ user.lname +'</div>';

    })
    
    out += '</div>';

  } else {

    // if subhead without add option
    if (!add) {
      
      out += '<div class="subhead gray">Not watched yet</div>';
      
    } else {
      
      out += `<div class="subhead icon gray">
                Not watched yet
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="option addsub">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z" fill="currentColor"></path>
                </svg>
              </div>`;
      
    }

  }
  
  return '<hr>' + out;
  
}

// render standalone manage users screen
function renderUsersScreen(usersObj) {
  
  // render user HTML
  
  let out = '<div class="users standalone">';
  
  usersObj.forEach(user => {

    out += '<div class="user" id="'+ user.uid +'">'+ user.fname +' '+ user.lname +'</div>';

  })

  out += '</div>';
  
  // place HTML into DOM
  movieWrapper.innerHTML = out;
  
  // open user profile when clicked
  let users = movieWrapper.querySelectorAll('.user');

  users.forEach(user => {

    user.addEventListener('click', () => {
      
      let userObj = usersArr.find(x => x.uid === user.id);
      showUser(userObj);
      
      // close users
      window.setTimeout(() => {
        
        document.body.classList.remove('manage');
        header.classList.remove('manage');

        renderMovies(movieArr);
        
      }, 300);

    })

  })
  
}

// expand movie when clicked
function addMovieListeners() {
  
  let movies = movieWrapper.querySelectorAll('.movie');

  movies.forEach(movie => {

    let movieTop = movie.querySelector('.top');
    let details = movie.querySelector('.bottom');

    // setup movie transition:
    // be sneaky and get the scrollHeight of details
    // rather than clientHeight, to get the "real", expanded height
    // so we can transition to it with CSS
    details.style.height = details.scrollHeight + 'px';

    // expand movie when clicked
    movieTop.addEventListener('click', () => {

      // close all other expanded movies
      let expandedMovies = movieWrapper.querySelector('.movie.details');

      if (expandedMovies && expandedMovies != movie) {
        expandedMovies.classList.remove('details');
      }

      // expand movie
      movie.classList.toggle('details');

    })

    // open user profile when clicked
    let users = movie.querySelectorAll('.user');

    users.forEach(user => {

      user.addEventListener('click', () => {
        
        let userObj = usersArr.find(x => x.uid === user.id);
        showUser(userObj);
        
      })

    })

  })
  
}

// add event listeners for subscriptions
function addSubListeners() {
  
  let movies = movieWrapper.querySelectorAll('.movie');
  
  movies.forEach(movie => {
    
    let editOption = movie.querySelector('.edit');
    let deleteOption = movie.querySelector('.delete');
    let addSub = movie.querySelector('.addsub');
    
    // delete movie when clicked on option
    if (deleteOption) {
    
      deleteOption.addEventListener('click', () => {

        let movieObj = movieArr.find(x => x.uid === movie.id);
        let movieIndex = movieArr.indexOf(movieObj);
        
        movieArr.splice(movieIndex, 1);

        renderSub(movieArr);
        
        deleteMovieInDB(movieObj.id);

      })
      
    }
    
    // edit movie when clicked on option
    if (editOption) {
      
      editOption.addEventListener('click', () => {

        login.innerHTML = editMovieHTML;

        let movieObj = movieArr.find(x => x.uid === movie.id);
        editMovie(movieObj);

        loginWrapper.classList.remove('hidden');
        loginWrapper.scrollTo(0, 0);

        addInputListeners();

      })
      
    }

    // add subscription when clicked
    if (addSub) {
      
      addSub.addEventListener('click', () => {

        login.innerHTML = addSubHTML;

        let movieObj = movieArr.find(x => x.uid === movie.id);
        addSubscription(movieObj);

        loginWrapper.classList.remove('hidden');
        loginWrapper.scrollTo(0, 0);

        addInputListeners();

      })
      
    }
    
    // open user profile when clicked
    let users = movie.querySelectorAll('.user');

    users.forEach(user => {

      user.addEventListener('click', () => {

        let userObj = usersArr.find(x => x.uid === user.id);
        showUser(userObj);

      })

    })
    
  })
  
}

// add event listeners for add subscription prompt
function addSubscription(movie) {
  
  let saveButton = login.querySelector('.save'),
      backButton = login.querySelector('.back');
  
  // add subscription on click of button
  saveButton.addEventListener('click', () => {
    
    let username = login.querySelector('#username').value;
    
    // push new subscription
    let user = usersArr.find(x => (x.username == username));
        
    // if user exists
    if (user) {
    
      user.subscriptions.push(movie.name + '|' + movie.uid);
    
      renderSub(movieArr);
    
      updateUserInDB(user);
    
      loginWrapper.classList.add('hidden');
      
    } else {
      
      alert('User does not exist.');
      
    }
    
  })
  
  // close prompt on click of button
  backButton.addEventListener('click', () => {
    
    loginWrapper.classList.add('hidden');
    
  })
  
}

// show user prompt for object
function showUser(user) {
  
  profile.id = user.uid;
  
  name.innerHTML = user.fname + ' ' + user.lname;
  email.innerHTML = '@' + user.username;
  
  // show user permissions
  let perArr = [];
  let perStrings = ['Add Subscriptions', 'Create Movies', 'Update Movies', 'Delete Movies'];
  
  user.permissions.forEach(permission => {

    if (permission == 'addsub') perArr.push(perStrings[0]);
    else if (permission == 'cmovies') perArr.push(perStrings[1]);
    else if (permission == 'umovies') perArr.push(perStrings[2]);
    else if (permission == 'dmovies') perArr.push(perStrings[3]);

  })
  
  permissions.innerHTML = (perArr.join(', ') ? perArr.join(', ') : 'No permissions');
  
  // hide edit buttons if user dosen't have permissions
  let loggedUserObj = usersArr.find(x => x.uid === loggedId);
  
  if (loggedUserObj.permissions.length == 0 && loggedUserObj != user) {
    
    editButton.style.display = 'none';
    deleteButton.style.display = 'none';
    
  } else {
    
    editButton.style.display = '';
    deleteButton.style.display = '';
    
  }
  
  // show user prompt
  header.classList.add('user');
  
}

// edit user when clicked
editButton.addEventListener('click', () => {
  
  login.innerHTML = editUserHTML;
  
  let user = usersArr.find(x => x.uid === profile.id);
  editUser(user);
  
  loginWrapper.classList.remove('hidden');
  loginWrapper.scrollTo(0, 0);
  
  addInputListeners();
  
})

// delete user when clicked
deleteButton.addEventListener('click', () => {
  
  let userObj = usersArr.find(x => x.uid === profile.id);
  let userIndex = usersArr.indexOf(userObj);
  
  usersArr.splice(userIndex, 1);
  
  renderMovies(movieArr);
  header.classList.remove('user');
  
  deleteUserInDB(userObj.id);
  
  // if deleted onself, force relog
  if (profile.id == loggedId) {
    
    // remove login from localStorage
    localStorage.loggedId = '';
    
    loginWrapper.classList.remove('hidden');
    login.innerHTML = loginHTML;

    addInputListeners();
    addLoginListeners();
    
  }
  
})

// input placeholder effect
function addInputListeners() {
  
  document.querySelectorAll('.input').forEach(input => {

    if (input.value == '' && input.type != 'date') input.classList.add('empty');

    input.addEventListener('input', () => {

      if (input.value == '' && input.type != 'date') input.classList.add('empty');
      else input.classList.remove('empty');

    })

  })
  
}

// add event listeners for login prompt
function addLoginListeners() {
  
  let loginButton = login.querySelector('.loginbutton'),
      signupButton = login.querySelector('.signup');
  
  // login
  loginButton.addEventListener('click', () => {
    
    loginMovies();

  })
  
  // login when pressed enter in password field
  login.querySelector('#password').addEventListener('keyup', (e) => {
    
    if (e.key === 'Enter') {
      loginMovies();
    }
    
  })

  // sign up
  signupButton.addEventListener('click', () => {

    login.innerHTML = signupHTML;

    addInputListeners();
    addSignupListeners();

  })
  
}

// login to movies
function loginMovies() {
  
  let username = login.querySelector('#username').value;
  let pass = login.querySelector('#password').value;

  // find user in database
  let user = usersArr.find(x => (x.username == username && x.pass == pass));

  // if found user
  if (user) {

    // log user id
    loggedId = user.uid;

    // save login to localStorage
    localStorage.loggedId = loggedId;

    // hide login prompt
    loginWrapper.classList.add('hidden');

  } else {

    // determine incorrect field
    user = usersArr.find(x => (x.username == username));

    if (user) {

      // password is incorrect
      alert('Wrong password. Try again.');

    } else {

      // username is incorrect
      alert('Couldn\'t find your account.');

    }

  }
  
}

// add event listeners for sign up prompt
function addSignupListeners() {
  
  let signupButton = login.querySelector('.signup'),
      loginButton = login.querySelector('.loginbutton');
  
  // sign up
  signupButton.addEventListener('click', () => {
    
    signupMovies();
    
  })
  
  // sign up when pressed enter in password field
  login.querySelector('#password').addEventListener('keyup', (e) => {
    
    if (e.key === 'Enter') {
      signupMovies();
    }
    
  })

  // login
  loginButton.addEventListener('click', () => {

    login.innerHTML = loginHTML;

    addInputListeners();
    addLoginListeners();

  })
  
}

function signupMovies() {
      
  let username = login.querySelector('#username').value;
  let fname = login.querySelector('#fname').value;
  let lname = login.querySelector('#lname').value;
  let pass = login.querySelector('#password').value;

  // check if username exists
  let user = usersArr.find(x => (x.username == username));

  // if username does not exist
  if (!user) {

    user = 
      {
      id: (usersArr[usersArr.length-1].id+1),
      uid: genUID(),
      username: username,
      pass: pass,
      fname: fname,
      lname: lname,
      subscriptions: [],
      permissions: [
        'addsub'
      ]
    };

    // push user to database
    usersArr.push(user);
    postUsersDB(user);

    // log user id
    loggedId = user.uid;

    // save login to localStorage
    localStorage.loggedId = loggedId;

    // hide login prompt
    loginWrapper.classList.add('hidden');

  } else {

    alert('Username has already been taken.');

  }
  
}

// add event listeners for edit movie prompt
function editMovie(movie) {
  
  let saveButton = login.querySelector('.save'),
      backButton = login.querySelector('.back');
  
  if (!movie) {
    
    login.querySelector('h1').innerHTML = 'Create Movie';
    
  }
  
  // fill in movie fields
  else {
    
    for (const key in movie) {
    
      if (key != 'id' && key != 'uid') login.querySelector('#' + key).value = movie[key];
      
    }
    
  }
  
  // save movie on click of button
  saveButton.addEventListener('click', () => {
    
    let newMovie;
    
    // if movie does not exist
    if (!movie) {
      
      newMovie = 
        {
        id: (movieArr[movieArr.length-1].id+1),
        uid: genUID(),
        name: '',
        genres: '',
        image: '',
        date: ''
      };
      
      // push new movie to array
      movieArr.push(newMovie);
      
      movie = movieArr[movieArr.length-1];
      
    }
    
    // fill in movie fields
    for (const key in movie) {

      if (key != 'id' && key != 'uid') movie[key] = login.querySelector('#' + key).value;

    }
    
    renderSub(movieArr);
    
    if (newMovie) postMoviesDB(movie);
    else updateMovieInDB(movie);
    
    loginWrapper.classList.add('hidden');
    
  })
  
  // close prompt on click of button
  backButton.addEventListener('click', () => {
    
    loginWrapper.classList.add('hidden');
    
  })
  
}

// add event listeners for edit user prompt
function editUser(user) {
  
  let saveButton = login.querySelector('.save'),
      backButton = login.querySelector('.back');
  
  // fill in user fields
  login.querySelector('#username').value = user.username;
  login.querySelector('#fname').value = user.fname;
  login.querySelector('#lname').value = user.lname;
  login.querySelector('#password').value = user.pass;

  // if user has permissions
  let userObj = usersArr.find(x => x.uid === loggedId);
  
  if (userObj.permissions.length > 0) {
    
    user.permissions.forEach(permission => {

      login.querySelector('#' + permission).checked = true;

    })
    
  } else {
    
    login.querySelector('.checkboxes').style.display = 'none';
    
  }
  
  // check update checkbox when checked create
  login.querySelector('#cmovies').addEventListener('input', () => {
    
    if (login.querySelector('#cmovies').checked) {
      
      login.querySelector('#umovies').checked = true;
      
    }
    
  })
  
  // save user on click of button
  saveButton.addEventListener('click', () => {

    user.username = login.querySelector('#username').value;
    user.fname = login.querySelector('#fname').value;
    user.lname = login.querySelector('#lname').value;
    user.pass = login.querySelector('#password').value;
    
    // update user permissions
    user.permissions = [];
    
    login.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      
      if (checkbox.checked) {
        
        user.permissions.push(checkbox.id);
        
      }
      
    })
    
    showUser(user);
    renderMovies(movieArr);
    
    updateUserInDB(user);
    
    loginWrapper.classList.add('hidden');

  })

  // close prompt on click of button
  backButton.addEventListener('click', () => {

    loginWrapper.classList.add('hidden');

  })
  
}


// database functions

async function getMoviesDB() {
  
  let resp = await axios.get('https://berrymovies.herokuapp.com/movies');
  
  return resp;
  
}

async function getUsersDB() {
  
  let resp = await axios.get('https://berrymovies.herokuapp.com/users');
  
  return resp;
  
}

async function postMoviesDB(movie) {
  
  let resp = await axios.post('https://berrymovies.herokuapp.com/movies/', movie);
  
  return resp;
  
}

async function updateMovieInDB(movie) {
  
  let resp = await axios.put(('https://berrymovies.herokuapp.com/movies/' + movie.id), movie);
  
  return resp;
  
}

async function deleteMovieInDB(id) {
  
  let resp = await axios.delete('https://berrymovies.herokuapp.com/movies/' + id);
  
  return resp;
  
}

async function postUsersDB(user) {
  
  let resp = await axios.post('https://berrymovies.herokuapp.com/users/', user);
  
  return resp;
  
}

async function updateUserInDB(user) {
    
  let resp = await axios.put(('https://berrymovies.herokuapp.com/users/' + user.id), user);
  
  return resp;
  
}

async function deleteUserInDB(id) {
  
  let resp = await axios.delete('https://berrymovies.herokuapp.com/users/' + id);
  
  return resp;
  
}


var genUID = () => { return Math.random().toString(36).substring(2) };

var axios = {
  'get': (url) => {
    return new Promise((resolve, reject) => {
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText));
          }
        };

        xmlhttp.open('GET', url, true);
        xmlhttp.send();
      } catch(e) { reject(e) }
    });
  },
  'post': (url, data) => {
    return new Promise((resolve, reject) => {
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            resolve(JSON.parse(this.responseText));
          }
        };

        xmlhttp.open('POST', url, true);

        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xmlhttp.send(JSON.stringify(data));
      } catch(e) { reject(e) }
    });
  },
  'put': (url, data) => {
    return new Promise((resolve, reject) => {
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            resolve(JSON.parse(this.responseText));
          }
        };

        xmlhttp.open('PUT', url, true);

        xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xmlhttp.send(JSON.stringify(data));
      } catch(e) { reject(e) }
    });
  },
  'delete': (url) => {
    return new Promise((resolve, reject) => {
      try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText));
          }
        };

        xmlhttp.open('DELETE', url, true);
        xmlhttp.send();
      } catch(e) { reject(e) }
    });
  },
};


async function init() {
  
  addInputListeners();
  
  // get users database
  let usersResp = await getUsersDB();
  usersArr = usersResp;
  
  // add event listeners for login prompt
  addLoginListeners();
  
  // check if logged in previously and log in
  checkLogin();
  
  // hide loader
  loader.classList.add('hidden');
  
  let moviesResp = await getMoviesDB();
  movieArr = moviesResp;
  
  renderMovies(movieArr);
  
}


let movieArr =
[
  {
    id: 0,
    uid: 'fh1be2csseg',
    name: 'Star Wars',
    genres: 'Space, Adventure, Action',
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Star_Wars_%281997_re-release_poster%29.jpg',
    date: '1977'
  },
  {
    id: 1,
    uid: 'm1hnke1ei6',
    name: 'The Big Short',
    genres: 'Comedies',
    image: 'https://upload.wikimedia.org/wikipedia/en/1/16/The_Big_Short_%282015_film_poster%29.png',
    date: '2015'
  }
];

let usersArr =
[
  {
    id: 0,
    uid: '526iw15vj3x',
    username: 'barhatsor',
    pass: 'bar1',
    fname: 'Bar',
    lname: 'Hatsor',
    subscriptions: [
      'Star Wars|fh1be2csseg'
    ],
    permissions: [
      'addsub'
    ]
  },
  {
    id: 1,
    uid: 'ynvqjdvo1h',
    username: 'kostamals',
    pass: 'kosta1',
    fname: 'Kosta',
    lname: 'Malsev',
    subscriptions: [
      'Star Wars|fh1be2csseg', 'The Big Short|m1hnke1ei6'
    ],
    permissions: [
      'cmovies',
      'umovies',
      'dmovies'
    ]
  },
  {
    id: 2,
    uid: 'cptzqn7p0mu',
    username: 'jjaqques',
    pass: 'james1',
    fname: 'James',
    lname: 'Jaqques',
    subscriptions: [],
    permissions: []
  }
];


const loginHTML = `
  <h1>Login</h1>
  <div class="inputdrawer">
    <input class="input empty" type="text" spellcheck="false" id="username">
    <div class="subhead">Username</div>
  </div>
  <div class="inputdrawer">
    <input class="input empty" type="password" id="password">
    <div class="subhead">Password</div>
  </div>
  <div class="button loginbutton">Login</div>
  <div class="button secondary signup">Or sign up</div>
`;

const signupHTML = `
  <h1>Sign Up</h1>
  <div class="inputdrawer">
    <input class="input" type="text" spellcheck="false" id="username">
    <div class="subhead">Username</div>
  </div>
  <div class="drawers">
    <div class="inputdrawer">
      <input class="input" type="text" spellcheck="false" id="fname">
      <div class="subhead">First Name</div>
    </div>
    <div class="inputdrawer">
      <input class="input" type="text" spellcheck="false" id="lname">
      <div class="subhead">Last Name</div>
    </div>
  </div>
  <div class="inputdrawer">
    <input class="input" type="password" id="password">
    <div class="subhead">Password</div>
  </div>
  <div class="button signup">Sign up</div>
  <div class="button secondary loginbutton">Or login</div>
`;

const editMovieHTML = `
  <h1>Edit Movie</h1>
  <div class="inputdrawer">
    <input class="input" type="text" spellcheck="false" id="name">
    <div class="subhead">Name</div>
  </div>
  <div class="inputdrawer">
    <input class="input" type="text" spellcheck="false" id="genres">
    <div class="subhead">Genres</div>
  </div>
  <div class="inputdrawer">
    <input class="input" type="url" spellcheck="false" id="image">
    <div class="subhead">Image</div>
  </div>
  <div class="inputdrawer">
    <input class="input" type="number" spellcheck="false" id="date">
    <div class="subhead">Release Date</div>
  </div>
  <div class="button save">Save</div>
  <div class="button secondary back">Back</div>
`;

const editUserHTML = `
  <h1>Edit User</h1>
  <div class="inputdrawer">
    <input class="input" type="text" spellcheck="false" id="username">
    <div class="subhead">Username</div>
  </div>
  <div class="drawers">
    <div class="inputdrawer">
      <input class="input" type="text" spellcheck="false" id="fname">
      <div class="subhead">First Name</div>
    </div>
    <div class="inputdrawer">
      <input class="input" type="text" spellcheck="false" id="lname">
      <div class="subhead">Last Name</div>
    </div>
  </div>
  <div class="inputdrawer">
    <input class="input" type="text" spellcheck="false" id="password">
    <div class="subhead">Password</div>
  </div>
  <div class="checkboxes">
    <div class="checkwrapper">
      <input type="checkbox" id="addsub">
      <div class="checkmark"></div>
      <label for="addsub">Add subscriptions</label>
    </div>
    <div class="checkwrapper">
      <input type="checkbox" id="cmovies">
      <div class="checkmark"></div>
      <label for="cmovies">Create movies</label>
    </div>
    <div class="checkwrapper">
      <input type="checkbox" id="umovies">
      <div class="checkmark"></div>
      <label for="umovies">Update movies</label>
    </div>
    <div class="checkwrapper">
      <input type="checkbox" id="dmovies">
      <div class="checkmark"></div>
      <label for="dmovies">Delete movies</label>
    </div>
  </div>
  <div class="button save">Save</div>
  <div class="button secondary back">Back</div>
`;

const addSubHTML = `
  <h1>Add Subscription</h1>
  <div class="inputdrawer">
    <input class="input empty" type="text" spellcheck="false" id="username">
    <div class="subhead">Username</div>
  </div>
  <div class="button save">Save</div>
  <div class="button secondary back">Back</div>
`;

init();
