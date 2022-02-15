import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Rule } from "../../../types/K3s/Ingress";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import styles from "./Default.module.css";
import Path, { PathRef } from "./Path";

export interface RulesProps {
  show?: boolean;
}

export interface RulesRef {
  getValue: () => Rule;
}

export default React.forwardRef((props: RulesProps, ref) => {
  const [minimized, onMinimize] = useState(true);

  const [rule, onRuleChange] = useState<Rule>({
    host: "",
  });

  const [paths, onPathChange] = useState<boolean[]>([]);
  const [pathsRef, onPathRefChange] = useState<React.RefObject<PathRef>[]>([]);

  useImperativeHandle<unknown, RulesRef>(ref, () => ({
    getValue() {
      return {
        ...rule,
        http: {
          ...rule.http,
          paths: pathsRef.map((item) => item.current?.getValue()),
        },
      } as Rule;
    },
  }));

  useEffect(() => {
    onPathRefChange(paths.map((_, i) => pathsRef[i] || createRef<PathRef>()));
  }, [paths.length]);

  return (
    <div className={`border rounded mx-1 py-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate className="mx-2" label="Host">
        <InputName
          name="host"
          char="http://"
          value={rule.host ?? ""}
          placeholder="mortis-grimreaper.ddns.net"
          onChange={({ target: { name, value } }) => {
            onRuleChange({ ...rule, [name]: value });
          }}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate
        className="mx-1"
        labelClassName="font-weight-bold mx-1"
        label={[
          "Path ",
          <FontAwesomeIcon icon={minimized ? faChevronDown : faChevronRight} />,
        ]}
        onClick={() => onMinimize(!minimized)}
      >
        <div className={`border rounded mx-1 p-2 ${minimized ? "" : "d-none"}`}>
          {paths.map((show, index) => (
            <div key={index} className={`mb-3 w-100 ${styles["el-index"]}`}>
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onPathChange({ ...paths, [index]: !paths[index] });
                  }}
                >
                  {`[${index}] `}
                  <FontAwesomeIcon
                    icon={show ? faChevronDown : faChevronRight}
                  />
                </label>
                <FontAwesomeIcon
                  className={`mr-1 ${styles["el-container"]} text-danger`}
                  icon={faTrashAlt}
                  size="lg"
                  fontSize="1rem"
                  onClick={() => {
                    onPathChange([
                      ...paths.slice(0, index),
                      ...paths.slice(index + 1),
                    ]);
                  }}
                />
              </div>
              <Path ref={pathsRef[index]} show={show} />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => onPathChange([...paths, true])}
            >
              <FontAwesomeIcon
                className={`text-success ${styles["icon"]}`}
                icon={faPlus}
              />
            </a>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
});
