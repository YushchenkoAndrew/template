import { faPlusCircle, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/dist/client/router";
import React from "react";
import styles from "./AddCard.module.css";

export interface AddCardProps {}

export default function AddCard(props: AddCardProps) {
  const router = useRouter();
  const basePath = router.basePath;

  return (
    <div className="col-lg-4 col-md-6 mt-4">
      <a
        href={`${basePath}/admin/projects/add`}
        className={`card border-info text-decoration-none p-2 h-100 ${styles["add-card"]}`}
      >
        <div className="container d-flex h-100 w-80">
          <div className="col align-self-center text-center">
            <FontAwesomeIcon
              className="text-info mt-4"
              icon={faPlusCircle}
              size="6x"
            />
            <p className={`text-info ${styles["add-title"]}`}>Project</p>
          </div>
        </div>
      </a>
    </div>
  );
}
