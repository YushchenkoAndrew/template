import React, { useEffect, useRef, useState } from "react";
import md5 from "../../lib/md5";
import { DefaultRes } from "../../types/request";
import styles from "./SignIn.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Image } from "react-bootstrap";
import { basePath, voidUrl } from "../../config";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export interface SignInProps {
  title: string;
  desc: string;
}

export default function SignIn(props: SignInProps) {
  const reCaptchaRef = useRef<ReCAPTCHA>(null);
  const [errMessage, onErrHappen] = useState("");

  function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!localStorage.getItem("id")) {
      return onErrHappen("Unauthorized user: Who the heck are you ?");
    }

    const target = event.target as typeof event.target & {
      user: { value: string };
      pass: { value: string };
    };
    const captcha = reCaptchaRef.current?.getValue();
    if (!target.user.value || !target.pass.value || !captcha) {
      return onErrHappen(
        !captcha
          ? `Please verify that you are not a bot`
          : `${!target.user.value ? "User name" : "Password"} can't be blank`
      );
    }

    const salt = md5(Math.round(Math.random() * 10000).toString());
    fetch(`${basePath}/api/admin/login?id=${localStorage.getItem("id")}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        salt,
        user: md5(salt + target.user.value),
        pass: md5(salt + target.pass.value),
        captcha,
      }),
    })
      .then((res) => res.json())
      .then((body: DefaultRes) => {
        if (body.status === "OK") window.location.href = `${basePath}/admin`;

        reCaptchaRef.current?.reset();
        return onErrHappen(body.message.replace("[LOGIN]", target.user.value));
      })
      .catch((err) => {
        reCaptchaRef.current?.reset();
        return onErrHappen(
          "Something went wrong. Please refresh the page and sign in again"
        );
      });
  }

  return (
    <>
      <form className={styles["signin"]} onSubmit={onSubmit}>
        <Image
          className="center-block rounded-circle"
          src={`${voidUrl}/admin/icon.webp`}
          width="100"
          height="100"
          alt="Project image"
        />
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
        <div className="mb-3">
          <ReCAPTCHA
            ref={reCaptchaRef}
            size="normal"
            sitekey={publicRuntimeConfig.RECAPTCHA_SITE_KEY}
          />
        </div>

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
