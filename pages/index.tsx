import DefaultFooter from "../components/default/DefaultFooter";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultNav from "../components/default/DefaultNav";
import DefaultShapeDivider from "../components/default/DefaultShapeDivider";
import { basePath, voidUrl } from "../config";
import styles from "../styles/Home.module.css";

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
        <div className="section d-flex justify-content-center embed-responsive embed-responsive-21by9 bg-dark">
          <video className="embed-responsive-item" autoPlay muted>
            <source src={`${voidUrl}/home/Intro.mp4`} type="video/mp4" />
          </video>
        </div>
      </main>

      <DefaultHeader home />
      <DefaultShapeDivider />

      <div className="container"></div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}
