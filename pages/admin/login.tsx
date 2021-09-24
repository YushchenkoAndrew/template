import React from "react";
import SignIn from "../../components/admin/SignIn";
import DefaultHead from "../../components/default/DefaultHead";

export default function Login() {
  return (
    <>
      <DefaultHead>
        <title>Login</title>
      </DefaultHead>

      <div className="container text-center">
        {/* <div className="row align-items-center h-100">
          <div className="col-6 mx-auto"> */}
        <div className="h-100 justify-content-center">
          <SignIn title="Welcome back" desc="Sign in to go further" />
        </div>
        {/* </div>
        </div> */}
      </div>
    </>
  );
}
