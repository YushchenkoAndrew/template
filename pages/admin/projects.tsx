import React from "react";
import Card from "../../components/admin/Card";
import DefaultHeader from "../../components/admin/default/DefaultHeader";
import DefaultHead from "../../components/default/DefaultHead";
import defaultServerSideHandler from "../../lib/session";

export default function AdminHome() {
  return (
    <>
      <DefaultHead>
        <title>Projects</title>
      </DefaultHead>
      <DefaultHeader />
      <div className="container mt-4">
        <div className="row">
          <Card
            title="3D Engine"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Yet another Minecraft clone"
          />
          <Card
            title="Code Rain"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          <Card
            title="test"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          {/* </div>
        <div className="row"> */}
          <Card
            title="test"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          <Card
            title="test"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
          <Card
            title="test"
            img="https://images.unsplash.com/photo-1457976326363-73a4b5fb9e79?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaCxzdHJlZXR8fHx8fHwxNjI4NDI3MzEy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600"
            flag="js"
            desc="Take the blue pill and the site will close, or take the red pill and I show how deep the rabbit hole goes"
          />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = defaultServerSideHandler;
