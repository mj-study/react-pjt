import React, {useState} from "react";
import {Link} from "react-router-dom";
import {app} from "firebaseApp"
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";

export default function SignupForm() {
  const [error, setError] = useState<string>(""); // validation 검증시 에러발생
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // form을 직접 제출하지 않기에 prevent
    e.preventDefault();

    try {
      const auth = getAuth(app);
      console.log('email: ', email);
      console.log('password: ', password);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch(e) {
      console.log('e: ', e);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {name, value},
    } = e;

    console.log(name, value);
    // validation
    if (name === 'email') {
      setEmail(value);
      console.log('email: ', email);
      const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === 'password') {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해주세요");
      } else if (passwordConfirm?.length > 0 && value !== passwordConfirm) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다. 확인해주세요")
      } else {
        setError("");
      }
    }

    if (name === 'password_confirm') {
      setPasswordConfirm(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다. 확인해주세요")
      } else {
        setError("");
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="form form--lg">
      <h1 className="form__title">회원가입</h1>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input type="email" name="email" id="email" required onChange={onChange}/>
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" name="password" id="password" required onChange={onChange}/>
      </div>
      <div className="form__block">
        <label htmlFor="password_confirm">비밀번호 확인</label>
        <input type="password" name="password_confirm" id="password_confirm" required onChange={onChange}/>
      </div>
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}
      <div className="form__block">
        계정이 없으신가요?
        <Link to="/login" className="form__link">로그인하기</Link>
      </div>
      <div className="form__block">
        <input type="submit" value="회원가입" className="form__btn--submit" disabled={error?.length > 0}/>
      </div>
    </form>
  );
}
