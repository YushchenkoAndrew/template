import { Image } from "react-bootstrap";
import ContactMe from "../components/ContactMe";
import ProjectLink from "../components/ProjectLink";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultNav from "../components/default/DefaultNav";
import { basePath } from "../config";
import DefaultHeadShape from "../components/default/ShapeDivider/DefaultHeadShape";
import DefaultContactMeShape from "../components/default/ShapeDivider/DefaultContactMeShape";
import { MediaView } from "../components/default/DefaultLinks";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <>
      <DefaultHead>
        <title>Mortis Projects</title>
        <link
          rel="preload"
          href={`${basePath}/fonts/ABSTRACT.ttf`}
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href={`${basePath}/fonts/Roboto-Thin.ttf`}
          as="font"
          crossOrigin=""
        />
      </DefaultHead>

      <main role="main">
        <div
          className="section d-flex justify-content-center embed-responsive embed-responsive-21by9 bg-dark"
          style={{ maxHeight: "1000px" }}
        >
          <video className="embed-responsive-item" autoPlay muted>
            <source
              src={`${process.env.NEXT_PUBLIC_VOID_URL ?? ""}/home/Intro.mp4`}
              type="video/mp4"
            />
          </video>
        </div>
      </main>

      <DefaultHeader home />
      <DefaultHeadShape />

      <div className="container-fluid">
        <div className="row my-5 justify-content-center">
          <div
            className="col-8 col-sm-7 col-lg-6 col-xl-4 mb-4 mx-auto mr-lg-2 mr-xl-auto"
            style={{ maxWidth: "750px" }}
          >
            <Image
              className="card-img"
              src={`${
                process.env.NEXT_PUBLIC_VOID_URL ?? ""
              }/home/projects.jpeg`}
              alt="Temp"
            />
          </div>
          <div className="col-10 col-lg-5 px-0 mr-lg-auto">
            <h4 className="font-weight-bold mb-3">So Hello there</h4>

            <p className={`text-justify ${styles["text"]}`}>
              I&apos;m Andrew Yushchenko and this is mine small portfolio, where
              I upload some of my work which I want to share with the rest of
              world. Currently you could find here visual implementation of
              algorithms and some other random stuff that I was interested back
              in the days. Most of mine interest are laid on such fields as
              Hardware, Backend, maybe a small portion of Devops spread here and
              there. Plus I currently interesting in Web Design and Frontend
              magic. I think that, when you have a variety of skills by
              combining them together you could achieve quite unique and
              fascinating result. So I guess this is mine goal which I&apos;m
              trying to achieve. I knew that I won&apos;t be skilled in one
              specific field then others but at least I be able to do an
              interesting work by myself.
            </p>
            <p className={`text-justify ${styles["text"]}`}>
              Shortly speaking this site is actually is hosted on Raspberry Pi
              cluster which is running Kubernetes for orchestrating Docker
              containers, such as:
            </p>

            <ul className="list-group list-group-flush ml-4 mb-3">
              <li className="list-group-item">
                <ProjectLink
                  desc="API on Golang with Gin framework"
                  link="https://github.com/YushchenkoAndrew/api/tree/golang"
                />
              </li>
              <li className="list-group-item">
                <ProjectLink
                  desc="Small and simple File server (named 'void') which is build with Nginx + PHP"
                  link="https://github.com/YushchenkoAndrew/void"
                />
              </li>
              <li className="list-group-item">
                <ProjectLink
                  desc="A bot on NestJS framework for mine Discord server (which I use for logging purpose)"
                  link="https://github.com/YushchenkoAndrew/botodachi"
                />
              </li>
              <li className="list-group-item">
                <ProjectLink
                  desc="And the last one is the Web page that you looking at is created on NextJS (React)"
                  link="https://github.com/YushchenkoAndrew/template/tree/next-react"
                />
              </li>
            </ul>

            <p className={`text-justify ${styles["text"]}`}>
              If you re interested in any of my work you could find it on mine
              <a
                className="text-primary ml-1"
                href="https://github.com/YushchenkoAndrew"
                onClick={MediaView}
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
              , also you could reach me on
              <a
                className="text-primary mx-1"
                href="https://twitter.com/AndrewY69942173"
                onClick={MediaView}
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
              or
              <a
                className="text-primary mx-1"
                href="https://www.linkedin.com/in/andrew-yushchenko-7447771a2/"
                onClick={MediaView}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </div>

      <DefaultContactMeShape />
      <ContactMe />
      <DefaultFooter
        name="Menu"
        background
        className="pt-4 pt-md-5 border-top py-2"
      >
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}
