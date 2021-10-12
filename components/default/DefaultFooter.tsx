import React from "react";
import FooterTop from "../Footer/Top";
import FooterBottom from "../Footer/Bottom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/dist/client/router";

export interface DefaultFooterProps {
  name: string;
  children: React.ReactNode;
}

export default function DefaultFooter(props: DefaultFooterProps) {
  const router = useRouter();
  const basePath = router.basePath;
  return (
    <div className="container">
      <footer className="pt-4 my-md-5 pt-md-5 border-top py-2">
        <div className="row justify-content-center">
          <div className="col-11">
            <FooterTop author="Andrew Y" name={props.name}>
              {props.children}
            </FooterTop>
            <FooterBottom email="AndrewYushchenko@gmail.com">
              <a
                className="text-muted mx-2 mx-md-3"
                href={process.env.GITHUB}
                onClick={() =>
                  localStorage.getItem("id")
                    ? fetch(
                        `${basePath}/api/view/media?id=${localStorage.getItem(
                          "id"
                        )}`,
                        { method: "PATCH" }
                      )
                        .then((res) => null)
                        .catch((err) => null)
                    : null
                }
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                className="text-muted mx-2 mx-md-3"
                href={process.env.TWITTER}
                onClick={() =>
                  localStorage.getItem("id")
                    ? fetch(
                        `${basePath}/api/view/media?id=${localStorage.getItem(
                          "id"
                        )}`,
                        { method: "PATCH" }
                      )
                        .then((res) => null)
                        .catch((err) => null)
                    : null
                }
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                className="text-muted mx-2 mx-md-3"
                href={process.env.LINKEDIN}
                onClick={() =>
                  localStorage.getItem("id")
                    ? fetch(
                        `${basePath}/api/view/media?id=${localStorage.getItem(
                          "id"
                        )}`,
                        { method: "PATCH" }
                      )
                        .then((res) => null)
                        .catch((err) => null)
                    : null
                }
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
              </a>
            </FooterBottom>
          </div>
        </div>
      </footer>
    </div>
  );
}
