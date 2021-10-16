import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import md5 from "../../lib/md5";
import { DefaultRes } from "../../types/request";
import styles from "./SignIn.module.css";

export interface SignInProps {
  title: string;
  desc: string;
}

export default function SignIn(props: SignInProps) {
  const router = useRouter();
  const basePath = router.basePath;

  const [errMessage, onErrHappen] = useState("");

  useEffect(() => {
    // TODO:
  }, []);

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!localStorage.getItem("id")) {
      return onErrHappen("Unauthorized user: Who the heck are you ?");
    }

    const target = event.target as typeof event.target & {
      user: { value: string };
      pass: { value: string };
    };

    if (!target.user.value || !target.pass.value) {
      return onErrHappen(
        `${!target.user.value ? "User name" : "Password"} can't be blank`
      );
    }

    const salt = Math.round(Math.random() * 10000);
    fetch(`${basePath}/api/admin/login?id=${localStorage.getItem("id")}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        salt,
        user: md5(salt.toString() + target.user.value),
        pass: md5(salt.toString() + target.pass.value),
      }),
    })
      .then((res) => res.json())
      .then((body: DefaultRes) => {
        if (body.status === "ERR")
          return onErrHappen(
            body.message.replace("[LOGIN]", target.user.value)
          );
        window.location.href = `${basePath}/admin`;
      })
      .catch((err) => {});
  }

  return (
    <>
      <form className={styles["signin"]} onSubmit={onSubmit}>
        {/* <img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"> */}
        <h1 className="h3 mb-3 font-weight-normal">{props.title}</h1>
        <small className="text-muted">{props.desc}</small>
        <input
          name="user"
          className="form-control mb-3 mt-1"
          placeholder="User name"
        ></input>
        <input
          name="pass"
          type="password"
          className="form-control my-3"
          placeholder="Password"
        ></input>

        <button className="btn btn-lg btn-dark btn-block" type="submit">
          Sign in
        </button>

        <small className="text-danger" hidden={!errMessage}>
          {errMessage}
        </small>
      </form>
    </>
  );
}
