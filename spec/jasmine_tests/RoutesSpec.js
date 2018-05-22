const request = require('supertest');
const app = require('./../../app');
const {User, sequelize} = require('../../database');

//Check if GET /login works
describe('GET /login', function() {
  it('respond with http code 200 OK', function(done) {
    request(app)
      .get('/login')
      .expect(200,done);
  });
});

//Check if GET /compete returns 302 code without being logged in
describe('GET /compete without being logged in', function() {
  it('respond with http code 302 Found', function(done) {
    request(app)
      .get('/compete')
      .expect(302, done);
  });
});

//Check if post /login works
describe('POST /login', function() {
  it('respond with http code 302 Redirect', function(done) {
    request(app)
      .post('/login')
      .send({username: "testAccount",
             password: "testPassword"})
      .expect(302, done);
  });
});

//Register new user and check if he was added to database
describe('Register new user', function(){
  it('check if that users exists in database', function(done){
    
    //New user info(change this every time)///////////////////
    const username = 'abcaggdgefjjg';
    const email = 'abfgvaf@badfb.com';
    const password = 'aghdfrg112';
    //////////////////////////////////
    
    request(app).post('/register').send({username: username, email: email, password: password, confirmPassword: password}).expect(200).end(function(err, res){
      if(err) throw err;
      User.findOne({where: { username: username}}).then(user => {
        if(user)
          done();
        else
          fail(err);
      })
    })
  });
});
