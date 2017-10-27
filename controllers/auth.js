import bcrypt from 'bcryptjs';

import UserDB from '../models/User';

class Account {

  static userRegister(req, res) {
    let userObj = req.body;

    UserDB.findOne({ email: userObj.email }, (err0, dbUser) => {
      if(err0 || dbUser) return res.status(400).send({ error: 'Email not available.' });
      bcrypt.hash(userObj.password, 12, (err1, hash) => {
        if(err1) return res.status(400).send(err1);

        let user = new UserDB({
          email: userObj.email,
          username: userObj.username,
          password: hash
        });

        user.save((err2) => {
          if (err2){
            return res.status(400).send(err2)
          } else {
            req.user = user
            let token = req.user.makeToken();

            return res.cookie(`accessToken`, token).send(req.user);
          }
        })
      })
    })
  }

}

class Auth {

  static login(req, res) {
    let token = req.user.makeToken();
    return res.cookie(`accessToken`, token).send(req.user);
  }

  static mobileLogin(req, res) {
    let token = req.user.makeToken();
    return res.header('usertoken', token).status(200).send('Successful login.');
  }

  static fbAuth(req, res) {
    let data = req.body;

    UserDB.find({
        email: data.email
    }).exec(function(err, users) {
        if (err) return res.status(400).send(err);

        let user = users[0];

        if(user) {
          let token = user.makeToken();
          return res.cookie(`accessToken`, token).send(user);
        } else {
          let user = new UserDB({
            email: data.email,
            fullName: data.fullName,
            facebookUserID: data.facebookUserID,
            isFacebook: true
          });

          user.save((err, user) => {
            if(err) return res.status(400).send(err);

            let token = user.makeToken();

            return res.cookie(`accessToken`, token).send(user);
          })
        }
    });

  }

  static logout(req, res) {
    req.logout();
    res.clearCookie(`accessToken`).send('You\'ve successfully logged out!');
  }
  
}

export { Account, Auth };
