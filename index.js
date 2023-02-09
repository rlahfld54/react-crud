const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // 출처 허용 옵션
    credential: "true", // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
);
connection.connect();

// configuration =========================
app.set("port", process.env.PORT || 3001);

// http://localhost:3001
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// 회원가입
app.post("/signup", (req, res, next) => {
  // 클라이언트에서 받은 회원가입 데이터가 이미 저장되어있는지 확인해야한다.
  // 기존 정보들과 비교해서 중복 된 것이 없다면 삽입쿼리를 실행하고
  // 중복된 유저가 이미 있다면 중복된 유저가 있다고 클라이언트에 알려줘야한다.
  // 그리고 암호화를 해준다. crypto 모듈 설치해서 사용
  let users = req.body;
  console.log(users);

  var query = `SELECT userid FROM Users WHERE userid ='${users.userid}'`; // 중복 아이디 체크
  connection.query(query, (error, rows) => {
    if (error) throw error;
    if (rows.length > 0) {
      console.log("이미 등록된 사용자입니다");
      res.send("dup-userid");
    } else {
      //비밀번호 암호화 하기
      let hashPassword = {
        password: "",
      };
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(users.password, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) return next(err);
          console.log("해쉬 : " + hash);
          hashPassword.password = hash;
          console.log("해쉬 담음 : " + hashPassword.password);
          // sql제대로 연결되고 중복이 없는 경우
          var query = `INSERT INTO Users (userid,email,password) VALUES ('${users.userid}','${users.email}','${hashPassword.password}')`;
          connection.query(query, (error, rows) => {
            if (error) {
              throw error;
            } else {
              console.log("회원가입을 성공했습니다.");
              res.send("success");
            }
          });
        });
      });
    }
  });
});

app.listen(app.get("port"), () => {
  console.log(
    "Express server listening on port ... " +
      "http://localhost:" +
      app.get("port")
  );
});
